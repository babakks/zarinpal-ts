import { PaymentSession } from "./model/paymentSession";
import { Payment, isPayment } from "./model/payment";
import { IncomingMessage } from "http";
import { PaymentOperationResult } from "./model/paymentOperationResult";
import { ZarinpalServiceConfig } from "./zarinpalServiceConfig";
import { HttpServiceInvoker } from "./http/httpServiceInvoker";
import { ZarinpalOriginalRegistrationResult } from "./zarinpalOriginalRegistrationResult";
import { ZarinpalErrorCatalog } from "./zarinpalErrorCatalog";
import { ZarinpalOriginalVerificationResult } from "./zarinpalOriginalVerificationResult";
import { PaymentStatus } from "./model/paymentStatus";
import * as querystring from "querystring";
import * as url from "url";
import { ZarinpalError } from "./zarinpalError";

/**
 * Implements Zarinpal payment session.
 *
 * @export
 * @abstract
 * @class ZarinpalPaymentSession
 * @implements {PaymentSession}
 */
export abstract class ZarinpalPaymentSession implements PaymentSession {
  private _payment: Payment;
  private _authority: string;
  protected errors: ZarinpalErrorCatalog;

  /**
   * Creates an instance of `ZarinpalPaymentSession`.
   *
   * @param {ZarinpalServiceConfig} config Zarinpal payment service
   *    configuration.
   * @param {HttpServiceInvoker} invoker HTTP/HTTPs service invoker instance.
   * @param {unknown} [object] Compatible argument to load new instance from. If
   *   the argument was incompatible, an exception is thrown.
   * @memberof ZarinpalPaymentSession
   */
  constructor(
    protected config: ZarinpalServiceConfig,
    protected invoker: HttpServiceInvoker,
    object?: unknown
  ) {
    this.errors = ZarinpalErrorCatalog.instance;

    if (object) {
      if (!isZarinpalPaymentSession(object)) {
        throw new Error("Incompatible argument");
      }

      this._payment = Payment.from(object.payment);
      this._authority = object.authority;
    } else {
      this._payment = new Payment();
      this._authority = "";
    }
  }

  /**
   * Gets the payment information object.
   *
   * @readonly
   * @type {Payment}
   * @memberof ZarinpalPaymentSession
   */
  get payment(): Payment {
    return this._payment;
  }

  /**
   * Authority string of the payment.
   *
   * @readonly
   * @type {string}
   * @memberof ZarinpalPaymentSession
   */
  get authority(): string {
    return this._authority;
  }

  /**
   * Registers the payment on the Zarinpal payment server.
   *
   * @param {string} callbackURL Callback URL to which the user has to be
   *    navigated following the payment.
   * @returns {Promise<PaymentOperationResult | undefined>}
   * @memberof ZarinpalPaymentSession
   */
  async register(
    callbackURL: string
  ): Promise<PaymentOperationResult | undefined> {
    const canProceed =
      this.payment.status === PaymentStatus.Created ||
      this.payment.status === PaymentStatus.RegistrationFailed;

    if (!canProceed) {
      return undefined;
    }

    this.payment.status = PaymentStatus.Processing;

    const op = await this.callRegister(callbackURL);
    if (op.isSuccessful) {
      this._authority = op.authority;
      this.payment.status = PaymentStatus.Registered;
    } else {
      this.payment.status = PaymentStatus.RegistrationFailed;
    }

    const error = this.errors.get(op.status);
    return op.isSuccessful
      ? this.zarinpalErrorToOperationResult(this.errors.getSuccessful())
      : this.zarinpalErrorToOperationResult(error);
  }

  protected async callRegister(callbackURL: string) {
    return ZarinpalOriginalRegistrationResult.from(
      await this.invoker.invoke(
        this.appropriateRegistrationURL(),
        "POST",
        this.registrationRequestData(callbackURL)
      )
    );
  }

  /**
   * Returns the Zarinpal payment gateway URL.
   *
   * @abstract
   * @returns {string}
   * @memberof ZarinpalPaymentSession
   */
  abstract gateway(): string;

  /**
   * Verifies the payment, associated with the given request, on the Zarinpal
   * payment server.
   *
   * @param {IncomingMessage} request
   * @param {*} [requestData]
   * @returns {Promise<PaymentOperationResult | undefined>}
   * @memberof ZarinpalPaymentSession
   */
  async verify(
    request: IncomingMessage,
    requestData?: any
  ): Promise<PaymentOperationResult | undefined> {
    const canProceed = this.payment.status === PaymentStatus.Registered;

    if (!canProceed) {
      return undefined;
    }

    if (this.isPaymentAborted(request)) {
      return this.zarinpalErrorToOperationResult(this.errors.get(-999));
    }

    const op = await this.callVerify();
    const error = this.errors.get(op.status);
    return op.isSuccessful
      ? this.zarinpalErrorToOperationResult(this.errors.getSuccessful())
      : this.zarinpalErrorToOperationResult(error);
  }

  private zarinpalErrorToOperationResult(
    error: ZarinpalError
  ): PaymentOperationResult {
    return new PaymentOperationResult(
      error.code >= 100,
      error.code.toString(),
      error.message
    );
  }

  private isPaymentAborted(request: IncomingMessage): boolean {
    const qs = querystring.parse(url.parse(request.url).query);
    return qs.Status !== "OK";
  }

  protected async callVerify() {
    return ZarinpalOriginalVerificationResult.from(
      await this.invoker.invoke(
        this.appropriateVerificationURL(),
        "POST",
        this.verificationRequestData()
      )
    );
  }

  /**
   * Creates the registration input data required to invoke the remote
   * "PaymentRequest" method.
   *
   * @protected
   * @param {string} callbackURL
   * @returns {*}
   * @memberof ZarinpalPaymentSession
   */
  protected registrationRequestData(callbackURL: string): any {
    const result: any = {
      MerchantID: this.config.merchantId,
      Amount: this.payment.amount,
      Description: this.payment.description,
      Email: this.payment.email,
      Mobile: this.payment.mobile,
      CallbackURL: callbackURL
    };

    if (this.config.expireIn) {
      result.AdditionalData = result.AdditionalData || {};
      result.AdditionalData.expireIn = this.config.expireIn;
    }

    if (this.config.wageCalculator) {
      result.AdditionalData = result.AdditionalData || {};
      result.AdditionalData.Wages = this.config.wageCalculator(this.payment);
    }

    return result;
  }

  /**
   * Creates the registration input data required to invoke the remote
   * "PaymentVerification" method.
   *
   * @protected
   * @returns {*}
   * @memberof ZarinpalPaymentSession
   */
  protected verificationRequestData(): any {
    return {
      MerchantID: this.config.merchantId,
      Authority: this.authority,
      Amount: this.payment.amount
    };
  }

  /**
   * Determines whether the payment should be handled with the Zarinpal extended
   * API.
   *
   * @protected
   * @returns {boolean}
   * @memberof ZarinpalPaymentSession
   */
  protected requiresExtendedAPI(): boolean {
    return this.config.expireIn !== undefined || !!this.config.wageCalculator;
  }

  /**
   * Returns the appropriate registration method URL.
   *
   * Note that the registration method URL is not the same for extended payments
   * (those with custom expiration or wages).
   *
   * @protected
   * @returns {string}
   * @memberof ZarinpalPaymentSession
   */
  protected appropriateRegistrationURL(): string {
    return this.requiresExtendedAPI()
      ? this.extendedRegistrationURL()
      : this.registrationURL();
  }

  /**
   * Returns the appropriate verification method URL.
   *
   * Note that the verification method URL is not the same for extended payments
   * (those with custom expiration or wages).
   *
   * @protected
   * @returns {string}
   * @memberof ZarinpalPaymentSession
   */
  protected appropriateVerificationURL(): string {
    return this.requiresExtendedAPI()
      ? this.extendedVerificationURL()
      : this.verificationURL();
  }

  /**
   * Returns the registration method URL.
   *
   * @protected
   * @abstract
   * @returns {string}
   * @memberof ZarinpalPaymentSession
   */
  protected abstract registrationURL(): string;

  /**
   * Returns the verification method URL.
   *
   * @protected
   * @abstract
   * @returns {string}
   * @memberof ZarinpalPaymentSession
   */
  protected abstract verificationURL(): string;

  /**
   * Returns the extended registration method URL.
   *
   * @protected
   * @abstract
   * @returns {string}
   * @memberof ZarinpalPaymentSession
   */
  protected abstract extendedRegistrationURL(): string;

  /**
   * Returns the extended verification method URL.
   *
   * @protected
   * @abstract
   * @returns {string}
   * @memberof ZarinpalPaymentSession
   */
  protected abstract extendedVerificationURL(): string;
}

/**
 * Determines whether given argument is a `ZarinpalPaymentSession` object.
 *
 * @export
 * @param {unknown} object Object to check its type.
 * @returns {object is ZarinpalPaymentSession}
 */
export function isZarinpalPaymentSession(
  object: unknown
): object is ZarinpalPaymentSession {
  return (
    object &&
    typeof object === "object" &&
    typeof (object as ZarinpalPaymentSession).authority === "string" &&
    isPayment((object as ZarinpalPaymentSession).payment)
  );
}
