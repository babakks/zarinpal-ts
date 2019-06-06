import { ZarinpalPaymentSession } from "./zarinpalPaymentSession";
import { ZarinpalServiceConfig } from "./zarinpalServiceConfig";
import { HttpServiceInvoker } from "./http/httpServiceInvoker";

/**
 * Implements the default Zarinpal payment session.
 *
 * @export
 * @class DefaultZarinpalPaymentSession
 * @extends {ZarinpalPaymentSession}
 */
export class DefaultZarinpalPaymentSession extends ZarinpalPaymentSession {
  constructor(config: ZarinpalServiceConfig, invoker: HttpServiceInvoker) {
    super(config, invoker);
  }

  protected registrationURL(): string {
    return "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json";
  }

  protected verificationURL(): string {
    return "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json";
  }

  protected extendedRegistrationURL(): string {
    return "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequestWithExtra.json";
  }

  protected extendedVerificationURL(): string {
    return "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerificationWithExtra.json";
  }

  gateway(): string {
    return `https://www.zarinpal.com/pg/StartPay/${this.authority}`;
  }
}
