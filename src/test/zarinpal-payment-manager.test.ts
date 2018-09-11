import { ZarinpalPaymentManager } from "../src/zarinpal-payment-manager";
import { ZarinpalPaymentSessionFactory } from "../src/zarinpal-payment-session-factory";
import "jest";

describe("ZarinpalPaymentManager.create()", () => {
    it("should call PaymentSessionFactory.create() only once.", () => {
        const MockFactory = jest.fn<ZarinpalPaymentSessionFactory>(() => {
            return {
                create: jest.fn()
            };
        });

        const mockFactory = new MockFactory();

        new ZarinpalPaymentManager(mockFactory).create();

        expect(mockFactory.create).toHaveBeenCalledTimes(1);
    });
});
