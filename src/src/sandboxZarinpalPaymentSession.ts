import { ZarinpalPaymentSession } from "./zarinpalPaymentSession";
import { ZarinpalServiceConfig } from "./zarinpalServiceConfig";
import { HttpServiceInvoker } from "./http/httpServiceInvoker";

/**
 * Implements the default Zarinpal sandbox payment session.
 *
 * @export
 * @class SandboxZarinpalPaymentSession
 * @extends {ZarinpalPaymentSession}
 */
export class SandboxZarinpalPaymentSession extends ZarinpalPaymentSession {
  constructor(
    config: ZarinpalServiceConfig,
    invoker: HttpServiceInvoker,
    object?: unknown
  ) {
    super(config, invoker, object);
  }

  protected registrationURL(): string {
    return "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json";
  }

  protected verificationURL(): string {
    return "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerification.json";
  }

  protected extendedRegistrationURL(): string {
    return "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequestWithExtra.json";
  }

  protected extendedVerificationURL(): string {
    return "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerificationWithExtra.json";
  }

  gateway(): string {
    return `https://sandbox.zarinpal.com/pg/StartPay/${this.authority}`;
  }
}
