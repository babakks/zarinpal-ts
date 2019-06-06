import { ZarinpalPaymentSession } from "./zarinpalPaymentSession";

/**
 * Defines an interface for Zarinpal payment session factories.
 *
 * @export
 * @interface ZarinpalPaymentSessionFactory
 */
export interface ZarinpalPaymentSessionFactory {
  /**
   * Creates and returns Zarinpal payment session instance from given compatible
   * object, if any.
   *
   * @param {unknown} [object] Compatible object to create new payment session
   *   instance from, if any.
   * @returns {ZarinpalPaymentSession}
   * @memberof ZarinpalPaymentSessionFactory
   */
  create(object?: unknown): ZarinpalPaymentSession;
}
