import { SandboxZarinpalPaymentSession } from "../src/sandbox-zarinpal-payment-session";
import { HttpServiceInvoker } from "../src/http/http-service-invoker";
import { ZarinpalServiceConfig } from "../src/zarinpal-service-config";
import { PaymentStatus } from "../src/model/payment-status";

import { expect } from "chai";
import sinon from "sinon";

const fakeCallbackUrl = "https://my.domain.com/payment/callback";

// Zarinpal endpoints
const gatewayUrl = "https://sandbox.zarinpal.com/pg/StartPay/";
const verificationAPIEndpoint =
  "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerification.json";
const verificationExtendedAPIEndpoint =
  "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerificationWithExtra.json";
const registrationAPIEndpoint =
  "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json";
const registrationExtendedAPIEndpoint =
  "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequestWithExtra.json";

describe("SandboxZarinpalPaymentSession", () => {
  describe("register()", () => {
    it("should send a `POST` request to the server.", () => {
      const setup = createRegistrationSubject();

      setup.subject.register(fakeCallbackUrl);

      const mockMethod = setup.invoker.invoke as sinon.SinonStub;

      expect(
        mockMethod.calledOnceWith(
          sinon.match(
            value =>
              typeof value === "string" &&
              (value.startsWith(registrationAPIEndpoint) ||
                value.startsWith(registrationExtendedAPIEndpoint))
          ),
          sinon.match("POST")
        )
      ).to.be.true;
    });

    it("should return `undefined`, if the payment was already registered.", async () => {
      const setup = createRegistrationSubject();
      setup.subject.payment.status = PaymentStatus.Registered;

      const value = await setup.subject.register(fakeCallbackUrl);

      expect(value).to.be.undefined;
    });

    it("should call the extended API ('~WithExtra'), if any wage calculation function was defined.", () => {
      const setup = createRegistrationSubject();
      setup.config.wageCalculator = () => {
        return { z1: {}, z2: {} };
      };

      setup.subject.register(fakeCallbackUrl);

      const mockMethod = setup.invoker.invoke as sinon.SinonStub;

      expect(
        mockMethod.calledOnceWith(
          sinon.match(
            value =>
              typeof value === "string" &&
              value.startsWith(registrationExtendedAPIEndpoint)
          )
        )
      ).to.be.true;
    });

    it("should call the extended API ('~WithExtra'), if any custom expiration was defined.", () => {
      const setup = createRegistrationSubject();
      setup.config.expireIn = 1000;

      setup.subject.register(fakeCallbackUrl);

      const mockMethod = setup.invoker.invoke as sinon.SinonStub;

      expect(
        mockMethod.calledOnceWith(
          sinon.match(
            value =>
              typeof value === "string" &&
              value.startsWith(registrationExtendedAPIEndpoint)
          )
        )
      ).to.be.true;
    });
  });

  describe("verify()", () => {
    it("should send a POST request to the server.", () => {
      const setup = createVerificationSubject();

      setup.subject.verify(setup.callbackRequest, undefined);

      const mockMethod = setup.invoker.invoke as sinon.SinonStub;

      expect(
        mockMethod.calledOnceWith(
          sinon.match(
            value =>
              typeof value === "string" &&
              (value.startsWith(verificationAPIEndpoint) ||
                value.startsWith(verificationExtendedAPIEndpoint)),
            "POST"
          )
        )
      ).to.be.true;
    });

    it("should return `undefined`, if the payment was not registered.", async () => {
      const setup = createVerificationSubject();
      setup.subject.payment.status = PaymentStatus.Created;

      const value = await setup.subject.verify(
        setup.callbackRequest,
        undefined
      );

      expect(value).to.be.undefined;
    });

    it("should call the extended API (~'WithExtra'), if any wage calculation function was defined.", () => {
      const setup = createVerificationSubject();
      setup.config.wageCalculator = () => {
        return { z1: {}, z2: {} };
      };

      setup.subject.verify(setup.callbackRequest, undefined);

      const mockMethod = setup.invoker.invoke as sinon.SinonStub;
      expect(
        mockMethod.calledOnceWith(
          sinon.match(
            value =>
              typeof value === "string" &&
              value.startsWith(verificationExtendedAPIEndpoint)
          )
        )
      ).to.be.true;
    });

    it("should call the extended API (~'WithExtra'), if any custom expiration was defined.", () => {
      const setup = createVerificationSubject();
      setup.config.expireIn = 1000;

      setup.subject.verify(setup.callbackRequest, undefined);

      const mockMethod = setup.invoker.invoke as sinon.SinonStub;
      expect(
        mockMethod.calledOnceWith(
          sinon.match(
            value =>
              typeof value === "string" &&
              value.startsWith(verificationExtendedAPIEndpoint)
          )
        )
      ).to.be.true;
    });
  });

  describe("gateway()", () => {
    it("should return a URL with correct beginning.", () => {
      const setup = createRegistrationSubject();

      const value = setup.subject.gateway();

      expect(value.startsWith(gatewayUrl)).to.be.true;
    });
  });

  describe("isMine()", () => {
    it("should identify its callback request.", () => {
      const setup = createVerificationSubject();

      const result = setup.subject.isMine(setup.callbackRequest, undefined, {
        Status: "OK",
        Authority: "00000000000000000000987"
      });

      expect(result).to.be.true;
    });

    it("should not false identify another payment's callback request.", () => {
      const setup = createVerificationSubject();

      setup.callbackRequest.url = (setup.callbackRequest.url as string).replace(
        setup.subject.authority,
        "00000000000000000000111"
      );

      const result = setup.subject.isMine(setup.callbackRequest, undefined, {
        Status: "OK",
        Authority: "00000000000000000000111"
      });

      expect(result).to.be.false;
    });
  });
});

class Setup {
  constructor(
    public config: ZarinpalServiceConfig,
    public subject: SandboxZarinpalPaymentSession,
    public invoker: HttpServiceInvoker,
    public callbackRequest: any
  ) {}
}

function createVerificationSubject(): Setup {
  const result = createRegistrationSubject();
  result.callbackRequest = {
    url: `${fakeCallbackUrl}?Status=OK&Authority=00000000000000000000987`
  };

  result.subject.payment.status = PaymentStatus.Registered;
  result.subject.authority = "00000000000000000000987";

  return result;
}

function createRegistrationSubject(): Setup {
  const config = new ZarinpalServiceConfig(
    "00000000-0000-0000-0000-000000000000",
    undefined,
    undefined
  );

  const fakeInvoker: HttpServiceInvoker = {
    invoke: sinon.stub().returns(
      Promise.resolve({
        Status: "100",
        Authority: "00000000000000000000987",
        RefID: "999999999999"
      })
    )
  };

  const subject = new SandboxZarinpalPaymentSession(config, fakeInvoker);
  subject.payment.amount = 1000;
  subject.payment.description = "Test payment";

  return new Setup(config, subject, fakeInvoker, {});
}
