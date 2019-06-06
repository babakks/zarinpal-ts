import { PaymentStatus } from "./paymentStatus";

/**
 * Encapsulates payment information.
 *
 * @class
 * @exports
 */
export class Payment {
  /**
   * Payment status.
   *
   * @type {PaymentStatus}
   * @memberof Payment
   */
  status: PaymentStatus;

  /**
   * Purchase description.
   *
   * @type {string}
   * @memberof Payment
   */
  description: string;

  /**
   * Amount of the payment (in Rials).
   *
   * @type {number}
   * @memberof Payment
   */
  amount: number;

  /**
   * Purchaser's email.
   *
   * @type {string}
   * @memberof Payment
   */
  email: string;

  /**
   * Purchaser's mobile number.
   *
   * @type {string}
   * @memberof Payment
   */
  mobile: string;

  /**
   * Purchaser's name.
   *
   * @type {string}
   * @memberof Payment
   */
  name: string;

  /**
   * Creates an instance of `Payment`.
   *
   * @memberof Payment
   */
  constructor() {
    this.init();
  }

  /**
   * Initializes properties with default values.
   *
   * @private
   * @memberof Payment
   */
  private init(): void {
    this.status = PaymentStatus.Created;
    this.description = "";
    this.amount = 0;
    this.email = "";
    this.mobile = "";
    this.name = "";
  }
}
