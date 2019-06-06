import { ZarinpalPaymentSessionFactory } from "./zarinpalPaymentSessionFactory";
import { ZarinpalServiceConfig } from "./zarinpalServiceConfig";
import { ZarinpalPaymentSession } from "./zarinpalPaymentSession";
import { HttpServiceInvoker } from "./http/httpServiceInvoker";
import { SandboxZarinpalPaymentSession } from "./sandboxZarinpalPaymentSession";

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
   * Creates an instance of `SandboxZarinpalPaymentSessionFactory`.
   *
   * @param {ZarinpalServiceConfig} config Zarinpal sandbox payment service
   *    configurations.
   * @param {HttpServiceInvoker} invoker HTTP/HTTPS service invoker.
   * @memberof SandboxZarinpalPaymentSessionFactory
   */
  constructor(
    private config: ZarinpalServiceConfig,
    private invoker: HttpServiceInvoker
  ) {}

  /**
   * Creates and returns a new Zarinpal sandbox payment session instance from
   * given compatible object, if any.
   *
   * @param {unknown} [object] Compatible object to create new payment session
   *   instance from, if any.
   * @returns {SandboxZarinpalPaymentSession}
   * @memberof SandboxZarinpalPaymentSessionFactory
   */
  create(object?: unknown): ZarinpalPaymentSession {
    return new SandboxZarinpalPaymentSession(this.config, this.invoker, object);
  }
}
