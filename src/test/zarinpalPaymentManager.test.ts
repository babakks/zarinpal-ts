import { ZarinpalPaymentManager } from "../src/zarinpalPaymentManager";
import { ZarinpalPaymentSessionFactory } from "../src/zarinpalPaymentSessionFactory";

import { expect } from "chai";
import sinon from "sinon";

import { createRegistrationSubject } from "./defaultZarinpalPaymentSession.test";
import "mocha";

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
