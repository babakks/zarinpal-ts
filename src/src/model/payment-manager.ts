import { PaymentSession } from "./payment-session";
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
   * Returns the payment session associated with given HTTP request.
   *
   * @param {IncomingMessage} request Incoming request message.
   * @param {*} [requestData] Request data.
   * @returns {PaymentSession} The associated payment session; otherwise,
   *    undefined.
   * @memberof PaymentManager
   */
  get(request: IncomingMessage, requestData?: any): PaymentSession;
}
