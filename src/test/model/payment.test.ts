import { Payment } from "../../src/model/payment";
import { PaymentStatus } from "../../src/model/paymentStatus";

import { expect } from "chai";

describe("Payment", () => {
  it("should initialize with `Created` state.", () => {
    expect(new Payment().status === PaymentStatus.Created).to.be.true;    
  });
});
