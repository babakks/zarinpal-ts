import { DefaultZarinpalPaymentSession } from "../src/default-zarinpal-payment-session";
import { HttpServiceInvoker } from "../src/http/http-service-invoker";
import { ZarinpalServiceConfig } from "../src/zarinpal-service-config";
import "jest";
import { PaymentStatus } from "../src/model/payment-status";

describe("DefaultZarinpalPaymentSession.register()", () => {
  it("should send a POST request to the server.", () => {
    const setup = createRegistrationSubject();

    setup.subject.register("https://my.domain.com/payment/callback");

    expect(
      (setup.invoker.invoke as jest.Mock).mock.calls.length
    ).toBeGreaterThan(0);

    expect(
      (setup.invoker.invoke as jest.Mock).mock.calls.some(
        x =>
          (x[0].startsWith(
            "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json"
          ) ||
            x[0].startsWith(
              "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequestWithExtra.json"
            )) &&
          x[1] === "POST"
      )
    ).toBeTruthy();
  });

  it("should return undefined, if the payment was already registered.", () => {
    const setup = createRegistrationSubject();
    setup.subject.payment.status = PaymentStatus.Registered;

    setup.subject
      .register("https://my.domain.com/payment/callback")
      .then(value => {
        expect(value).toBeUndefined();
      });

    expect.assertions(1);
  });

  it("should call extended API, if any wage calculation function was defined.", () => {
    const setup = createRegistrationSubject();
    setup.config.wageCalculator = () => {
      return { z1: {}, z2: {} };
    };

    setup.subject.register("https://my.domain.com/payment/callback");

    expect(
      (setup.invoker.invoke as jest.Mock).mock.calls.length
    ).toBeGreaterThan(0);

    expect(
      (setup.invoker.invoke as jest.Mock).mock.calls.some(x =>
        (x[0] as string).startsWith(
          "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequestWithExtra.json"
        )
      )
    ).toBeTruthy();
  });

  it("should call extended API, if any custom expiration was defined.", () => {
    const setup = createRegistrationSubject();
    setup.config.expireIn = 1000;

    setup.subject.register("https://my.domain.com/payment/callback");

    expect(
      (setup.invoker.invoke as jest.Mock).mock.calls.length
    ).toBeGreaterThan(0);

    expect(
      (setup.invoker.invoke as jest.Mock).mock.calls.some(x =>
        x[0].startsWith(
          "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequestWithExtra.json"
        )
      )
    ).toBeTruthy();
  });
});

describe("DefaultZarinpalPaymentSession.verify()", () => {
  it("should send a POST request to the server.", () => {
    const setup = createVerificationSubject();
    setup.subject.verify(setup.callbackRequest, undefined);

    expect(
      (setup.invoker.invoke as jest.Mock).mock.calls.length
    ).toBeGreaterThan(0);

    expect(
      (setup.invoker.invoke as jest.Mock).mock.calls.some(
        x =>
          (x[0].startsWith(
            "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json"
          ) ||
            x[0].startsWith(
              "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerificationWithExtra.json"
            )) &&
          x[1] === "POST"
      )
    ).toBeTruthy();
  });

  it("should return undefined, if the payment was not registered.", () => {
    const setup = createVerificationSubject();
    setup.subject.payment.status = PaymentStatus.Created;

    setup.subject.verify(setup.callbackRequest, undefined).then(value => {
      expect(value).toBeUndefined();
    });

    expect.assertions(1);
  });

  it("should call extended API, if any wage calculation function was defined.", () => {
    const setup = createVerificationSubject();
    setup.config.wageCalculator = () => {
      return { z1: {}, z2: {} };
    };

    setup.subject.verify(setup.callbackRequest, undefined);

    expect(
      (setup.invoker.invoke as jest.Mock).mock.calls.length
    ).toBeGreaterThan(0);

    expect(
      (setup.invoker.invoke as jest.Mock).mock.calls.some(x =>
        x[0].startsWith(
          "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerificationWithExtra.json"
        )
      )
    ).toBeTruthy();
  });

  it("should call extended API, if any custom expiration was defined.", () => {
    const setup = createVerificationSubject();
    setup.config.expireIn = 1000;

    setup.subject.verify(setup.callbackRequest, undefined);

    expect(
      (setup.invoker.invoke as jest.Mock).mock.calls.length
    ).toBeGreaterThan(0);

    expect(
      (setup.invoker.invoke as jest.Mock).mock.calls.some(x =>
        x[0].startsWith(
          "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerificationWithExtra.json"
        )
      )
    ).toBeTruthy();
  });
});

describe("DefaultZarinpalPaymentSession.gateway()", () => {
  it("should return a URL with correct beginning.", () => {
    const setup = createRegistrationSubject();

    const gateway = setup.subject.gateway();
    expect(
      gateway.startsWith("https://www.zarinpal.com/pg/StartPay/")
    ).toBeTruthy();
  });
});

describe("DefaultZarinpalPaymentSession.isMine()", () => {
  it("should identify its callback request.", () => {
    const setup = createVerificationSubject();

    const result = setup.subject.isMine(setup.callbackRequest, undefined, {
      Status: "OK",
      Authority: "00000000000000000000987"
    });

    expect(result).toBeTruthy();
  });

  it("should not false identify another payment's callback request.", () => {
    const setup = createVerificationSubject();

    (setup.callbackRequest.url as string).replace(
      setup.subject.authority,
      "00000000000000000000111"
    );

    const result = setup.subject.isMine(setup.callbackRequest, undefined, {
      Status: "OK",
      Authority: "00000000000000000000111"
    });

    expect(result).toBeFalsy();
  });
});

function createVerificationSubject(): Setup {
  const result = createRegistrationSubject();
  result.callbackRequest = {
    url:
      "https://my.domain.com/callback?Status=OK&Authority=00000000000000000000987"
  };

  result.subject.payment.status = PaymentStatus.Registered;
  result.subject.authority = "00000000000000000000987";

  return result;
}

function createRegistrationSubject(): Setup {
  const MockInvoker = jest.fn<HttpServiceInvoker>(() => {
    return {
      invoke: jest.fn().mockReturnValue(
        Promise.resolve({
          Status: "100",
          Authority: "00000000000000000000987",
          RefID: "999999999999"
        })
      )
    };
  });

  const mockInvoker = new MockInvoker();
  const config = new ZarinpalServiceConfig(
    "00000000-0000-0000-0000-000000000000",
    undefined,
    undefined
  );

  const subject = new DefaultZarinpalPaymentSession(config, mockInvoker);
  subject.payment.amount = 1000;
  subject.payment.description = "Test payment";

  const result = new Setup();
  result.config = config;
  result.subject = subject;
  result.invoker = mockInvoker;
  result.callbackRequest = {};

  return result;
}

class Setup {
  config: ZarinpalServiceConfig;
  subject: DefaultZarinpalPaymentSession;
  invoker: HttpServiceInvoker;
  callbackRequest: any;
}
