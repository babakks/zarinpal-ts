import { ZarinpalPaymentSessionFactory } from "./zarinpal-payment-session-factory";
import { DefaultZarinpalPaymentSession } from "./default-zarinpal-payment-session";
import { ZarinpalServiceConfig } from "./zarinpal-service-config";
import { ZarinpalPaymentSession } from "./zarinpal-payment-session";
import { HttpServiceInvoker } from "./http/http-service-invoker";

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
   * Creates an instance of DefaultZarinpalPaymentSessionFactory.
   *
   * @param {ZarinpalServiceConfig} _config Zarinpal payment service
   *    configurations.
   * @param {HttpServiceInvoker} _invoker HTTP/HTTPS service invoker.
   * @memberof DefaultZarinpalPaymentSessionFactory
   */
  constructor(
    private _config: ZarinpalServiceConfig,
    private _invoker: HttpServiceInvoker
  ) {}

  /**
   * Creates and returns a new Zarinpal payment session instance.
   *
   * @returns {ZarinpalPaymentSession}
   * @memberof DefaultZarinpalPaymentSessionFactory
   */
  create(): ZarinpalPaymentSession {
    return new DefaultZarinpalPaymentSession(this._config, this._invoker);
  }
}
