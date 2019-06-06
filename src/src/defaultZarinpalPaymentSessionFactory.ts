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
