import { Payment } from "../../src/model/payment";
import { PaymentStatus } from "../../src/model/payment-status";

import "jest";

describe("Payment", () => {
  it("should initialize with 'Created' state.", () => {
    expect(new Payment().status === PaymentStatus.Created).toBe(true);
  });
});
