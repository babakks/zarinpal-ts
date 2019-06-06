import { PaymentSession } from "./model/paymentSession";
import { Payment } from "./model/payment";
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

/**
 * Implements Zarinpal payment session.
 *
 * @export
 * @abstract
 * @class ZarinpalPaymentSession
 * @implements {PaymentSession}
 */
export abstract class ZarinpalPaymentSession implements PaymentSession {
  authority: string;

  protected _payment: Payment;
  protected _errors: ZarinpalErrorCatalog;

  /**
   * Creates an instance of `ZarinpalPaymentSession`.
   *
   * @param {ZarinpalServiceConfig} _config Zarinpal payment service
   *    configuration.
   * @param {HttpServiceInvoker} _invoker HTTP/HTTPs service invoker instance.
   * @memberof ZarinpalPaymentSession
   */
  constructor(
    protected _config: ZarinpalServiceConfig,
    protected _invoker: HttpServiceInvoker
  ) {
    this._payment = new Payment();
    this.authority = "";
    this._errors = new ZarinpalErrorCatalog();
  }

  /**
   * Gets the payment information object.
   *
   * @readonly
   * @memberof ZarinpalPaymentSession
   */
  get payment() {
    return this._payment;
  }

  /**
   * Registers the payment on the Zarinpal payment server.
   *
   * @param {string} callbackURL Callback URL to which the user has to be
   *    navigated following the payment.
   * @returns {Promise<PaymentOperationResult>}
   * @memberof ZarinpalPaymentSession
   */
  async register(callbackURL: string): Promise<PaymentOperationResult> {
    const canProceed =
      this._payment.status === PaymentStatus.Created ||
      this._payment.status === PaymentStatus.RegistrationFailed;

    if (!canProceed) {
      return undefined;
    }

    this._payment.status = PaymentStatus.Processing;

    const operationResult = await this.callRegister(callbackURL);

    const error = this._errors.get(operationResult.status);

    if (operationResult.isSuccessful()) {
      this.authority = operationResult.authority;
      this._payment.status = PaymentStatus.Registered;
    } else {
      this._payment.status = PaymentStatus.RegistrationFailed;
    }

    return operationResult.isSuccessful()
      ? new PaymentOperationResult(
          true,
          this._errors.getSuccessful().code.toString(),
          this._errors.getSuccessful().message
        )
      : new PaymentOperationResult(false, error.code.toString(), error.message);
  }

  protected async callRegister(callbackURL: string) {
    return ZarinpalOriginalRegistrationResult.from(
      await this._invoker.invoke(
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
   * @returns {Promise<PaymentOperationResult>}
   * @memberof ZarinpalPaymentSession
   */
  async verify(
    request: IncomingMessage,
    requestData?: any
  ): Promise<PaymentOperationResult> {
    const canProceed = this._payment.status === PaymentStatus.Registered;

    if (!canProceed) {
      return undefined;
    }

    if (this.isPaymentAborted(request)) {
      const result = this._errors.get(-999);
      return new PaymentOperationResult(
        false,
        result.code.toString(),
        result.message
      );
    }

    const operationResult = await this.callVerify();

    const error = this._errors.get(operationResult.status);

    return operationResult.isSuccessful()
      ? new PaymentOperationResult(
          true,
          this._errors.getSuccessful().code.toString(),
          this._errors.getSuccessful().message
        )
      : new PaymentOperationResult(false, error.code.toString(), error.message);
  }

  private isPaymentAborted(request: IncomingMessage): boolean {
    const qs = querystring.parse(url.parse(request.url).query);
    return !qs || qs.Status !== "OK";
  }

  protected async callVerify() {
    return ZarinpalOriginalVerificationResult.from(
      await this._invoker.invoke(
        this.appropriateVerificationURL(),
        "POST",
        this.verificationRequestData()
      )
    );
  }

  /**
   * Determines whether the given request is associated with the current session
   * instance.
   *
   * @param {IncomingMessage} request
   * @param {*} requestData
   * @param {*} requestQueryString
   * @returns {boolean}
   * @memberof ZarinpalPaymentSession
   */
  isMine(
    request: IncomingMessage,
    requestData: any,
    requestQueryString: any
  ): boolean {
    return (
      requestQueryString &&
      requestQueryString.Authority &&
      requestQueryString.Authority === this.authority
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
      MerchantID: this._config.merchantId,
      Amount: this._payment.amount,
      Description: this._payment.description,
      Email: this._payment.email,
      Mobile: this._payment.mobile,
      CallbackURL: callbackURL
    };

    if (this._config.expireIn) {
      result.AdditionalData = result.AdditionalData || {};
      result.AdditionalData.expireIn = this._config.expireIn;
    }

    if (this._config.wageCalculator) {
      result.AdditionalData = result.AdditionalData || {};
      result.AdditionalData.Wages = this._config.wageCalculator(this._payment);
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
      MerchantID: this._config.merchantId,
      Authority: this.authority,
      Amount: this._payment.amount
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
    if (this._config.expireIn || this._config.wageCalculator) {
      return true;
    }

    return false;
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
