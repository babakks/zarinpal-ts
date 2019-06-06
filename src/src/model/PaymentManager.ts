import { PaymentSession } from "./paymentSession";
import { IncomingMessage } from "http";

/**
 * Defines the interface of a payment manager.
 *
 * @export
 * @interface PaymentManager
 */
export interface PaymentManager {
  /**
   * Creates and returns a new payment session object instance.
   *
   * @returns {PaymentSession}
   * @memberof PaymentManager
   */
  create(): PaymentSession;

  /**
   * Returns the payment session associated with given callback HTTP request.
   *
   * @param {IncomingMessage} callbackRequest Payment callback request message.
   * @param {*} [requestData] Request data.
   * @returns {PaymentSession} The associated payment session; otherwise,
   *    `undefined`.
   * @memberof PaymentManager
   */
  get(callbackRequest: IncomingMessage, requestData?: any): PaymentSession;
}
