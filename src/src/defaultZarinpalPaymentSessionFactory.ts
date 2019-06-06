import { ZarinpalPaymentSessionFactory } from "./zarinpalPaymentSessionFactory";
import { DefaultZarinpalPaymentSession } from "./defaultZarinpalPaymentSession";
import { ZarinpalServiceConfig } from "./zarinpalServiceConfig";
import { ZarinpalPaymentSession } from "./zarinpalPaymentSession";
import { HttpServiceInvoker } from "./http/httpServiceInvoker";

/**
 * Implements the default Zarinpal payment session factory.
 *
 * @export
 * @class DefaultZarinpalPaymentSessionFactory
 * @implements {ZarinpalPaymentSessionFactory}
 */
export class DefaultZarinpalPaymentSessionFactory
  implements ZarinpalPaymentSessionFactory {
  /**
   * Creates an instance of `DefaultZarinpalPaymentSessionFactory`.
   *
   * @param {ZarinpalServiceConfig} config Zarinpal payment service
   *    configurations.
   * @param {HttpServiceInvoker} invoker HTTP/HTTPS service invoker.
   * @memberof DefaultZarinpalPaymentSessionFactory
   */
  constructor(
    private config: ZarinpalServiceConfig,
    private invoker: HttpServiceInvoker
  ) {}

  /**
   * Creates and returns a new Zarinpal payment session instance from given
   * compatible object, if any.
   *
   * @param {unknown} [object] Compatible object to create new payment session
   *   instance from, if any.
   * @returns {DefaultZarinpalPaymentSession}
   * @memberof DefaultZarinpalPaymentSessionFactory
   */
  create(object?: unknown): ZarinpalPaymentSession {
    return new DefaultZarinpalPaymentSession(this.config, this.invoker, object);
  }
}
