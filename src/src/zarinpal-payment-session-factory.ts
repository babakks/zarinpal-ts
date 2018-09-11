import { ZarinpalPaymentSession } from "./zarinpal-payment-session";

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
