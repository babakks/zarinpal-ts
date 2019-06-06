import { PaymentStatus, isPaymentStatus } from "./paymentStatus";

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
    this.status = PaymentStatus.Created;
    this.amount = 0;
    this.name = "";
    this.email = "";
    this.mobile = "";
    this.description = "";
  }

  /**
   * Creates an instance of `Payment` from a compatible object.
   *
   * @static
   * @param {unknown} object Object to create new instance from.
   * @returns {Payment} A `Payment` instance created from the given object. If
   *   the given argument was not compatible, the method throws an exception.
   * @memberof Payment
   */
  static from(object: unknown): Payment {
    if (!isPayment(object)) {
      throw new Error("Incompatible object.");
    }

    const result = new Payment();
    result.status = object.status;
    result.amount = object.amount;
    result.name = object.name;
    result.email = object.email;
    result.mobile = object.mobile;
    result.description = object.description;

    return result;
  }
}

/**
 * Determines whether given argument is a `Payment` object.
 *
 * @export
 * @param {unknown} object Object to check its type.
 * @returns {object is Payment}
 */
export function isPayment(object: unknown): object is Payment {
  return (
    object &&
    typeof object === "object" &&
    isPaymentStatus((object as Payment).status) &&
    typeof (object as Payment).amount === "number" &&
    typeof (object as Payment).name === "string" &&
    typeof (object as Payment).mobile === "string" &&
    typeof (object as Payment).email === "string" &&
    typeof (object as Payment).amount === "string" &&
    typeof (object as Payment).description === "string"
  );
}
