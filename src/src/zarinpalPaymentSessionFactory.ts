import { ZarinpalPaymentSession } from "./zarinpalPaymentSession";

/**
 * Defines an interface for Zarinpal payment session factories.
 *
 * @export
 * @interface ZarinpalPaymentSessionFactory
 */
export interface ZarinpalPaymentSessionFactory {
  /**
   * Creates and returns a Zarinpal payment session instance.
   *
   * @returns {ZarinpalPaymentSession}
   * @memberof ZarinpalPaymentSessionFactory
   */
  create(): ZarinpalPaymentSession;
}
