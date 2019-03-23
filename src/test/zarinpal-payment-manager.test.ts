import { ZarinpalPaymentManager } from "../src/zarinpal-payment-manager";
import { ZarinpalPaymentSessionFactory } from "../src/zarinpal-payment-session-factory";

import { expect } from "chai";
import sinon from "sinon";

import { createRegistrationSubject } from "./default-zarinpal-payment-session.test";

describe("ZarinpalPaymentManager", () => {
  describe("create()", () => {
    it("should call `PaymentSessionFactory.create()` only once.", () => {
      const setup = createRegistrationSubject();
      const mockFactory: ZarinpalPaymentSessionFactory = {
        create: sinon.stub().returns(setup.subject)
      };

      new ZarinpalPaymentManager(mockFactory).create();

      const mockMethod = mockFactory.create as sinon.SinonStub;
      expect(mockMethod.calledOnce).to.be.true;
    });
  });
});
