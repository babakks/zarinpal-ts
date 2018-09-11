import { ZarinpalPaymentSession } from "./zarinpal-payment-session";
import { ZarinpalServiceConfig } from "./zarinpal-service-config";
import { HttpServiceInvoker } from "./http/http-service-invoker";

/**
 * Implements the default Zarinpal sandbox payment session.
 *
 * @export
 * @class SandboxZarinpalPaymentSession
 * @extends {ZarinpalPaymentSession}
 */
export class SandboxZarinpalPaymentSession extends ZarinpalPaymentSession {
  constructor(config: ZarinpalServiceConfig, invoker: HttpServiceInvoker) {
    super(config, invoker);
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
