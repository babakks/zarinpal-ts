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
   * @returns {Promise<PaymentSession | undefined>} A `Promise` that resolves
   *   with the newly created payment session object; otherwise, `undefined`.
   * @memberof PaymentManager
   */
  create(): Promise<PaymentSession | undefined>;

  /**
   * Stores given payment session for future references (typically, at
   * verification step).
   *
   * @param {PaymentSession} session Payment session to store.
   * @returns {Promise<void>} A `Promise` that resolves if the session stored
   *   successfully; otherwise, the `Promise` will reject.
   * @memberof PaymentManager
   */
  store(session: PaymentSession): Promise<void>;

  /**
   * Returns the payment session associated with given callback HTTP request.
   *
   * @param {IncomingMessage} callbackRequest Payment callback request message.
   * @param {*} [requestData] Request data.
   * @returns {Promise<PaymentSession | undefined>} A `Promise` that resolves
   *   with the associated payment session; otherwise, `undefined`.
   * @memberof PaymentManager
   */
  get(
    callbackRequest: IncomingMessage,
    requestData?: any
  ): Promise<PaymentSession | undefined>;
}
