import { PaymentOperationResult } from "./payment-operation-result";
import { Payment } from "./payment";
import { IncomingMessage } from "http";

/**
 * Defines a payment session to provide a context for the entire payment
 * process.
 *
 * @export
 * @interface PaymentSession
 */
export interface PaymentSession {
  /**
   * Payment information object of the session.
   *
   * @type {Payment}
   * @memberof PaymentSession
   */
  readonly payment: Payment;

  /**
   * Registers the payment on the server to get a unique gateway token.
   *
   * @param {string} callbackURL Callback URL to which the user has to be
   *    navigated following the payment.
   * @returns {Promise<PaymentOperationResult>}
   * @memberof PaymentSession
   */
  register(callbackURL: string): Promise<PaymentOperationResult>;

  /**
   * Returns the URL of the payment gateway.
   *
   * The method should be called after a successful registration.
   *
   * @returns {string} Payment URL gateway.
   * @memberof PaymentSession
   */
  gateway(): string;

  /**
   * Verifies the payment, associated with given HTTP request, on the server.
   *
   * @param {IncomingMessage} request
   * @param {*} [requestData]
   * @returns {Promise<PaymentOperationResult>}
   * @memberof PaymentSession
   */
  verify(
    request: IncomingMessage,
    requestData?: any
  ): Promise<PaymentOperationResult>;
}
