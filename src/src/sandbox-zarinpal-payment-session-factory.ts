import { ZarinpalPaymentSessionFactory } from "./zarinpal-payment-session-factory";
import { ZarinpalServiceConfig } from "./zarinpal-service-config";
import { ZarinpalPaymentSession } from "./zarinpal-payment-session";
import { HttpServiceInvoker } from "./http/http-service-invoker";
import { SandboxZarinpalPaymentSession } from "./sandbox-zarinpal-payment-session";

/**
 * Implements the Zarinpal sandbox payment session factory, which is meant to be
 * used for integration tests.
 *
 * @export
 * @class SandboxZarinpalPaymentSessionFactory
 * @implements {ZarinpalPaymentSessionFactory}
 */
export class SandboxZarinpalPaymentSessionFactory
  implements ZarinpalPaymentSessionFactory {
  /**
   * Creates an instance of SandboxZarinpalPaymentSessionFactory.
   *
   * @param {ZarinpalServiceConfig} _config Zarinpal sandbox payment service
   *    configurations.
   * @param {HttpServiceInvoker} _invoker HTTP/HTTPS service invoker.
   * @memberof SandboxZarinpalPaymentSessionFactory
   */
  constructor(
    private _config: ZarinpalServiceConfig,
    private _invoker: HttpServiceInvoker
  ) {}

  /**
   * Creates and returns a new Zarinpal sandbox payment session instance.
   *
   * @returns {ZarinpalPaymentSession}
   * @memberof SandboxZarinpalPaymentSessionFactory
   */
  create(): ZarinpalPaymentSession {
    return new SandboxZarinpalPaymentSession(this._config, this._invoker);
  }
}
