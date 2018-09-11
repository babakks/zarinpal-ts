import { PaymentManager } from "./model/payment-manager";
import { PaymentSession } from "./model/payment-session";
import { ZarinpalPaymentSession } from "./zarinpal-payment-session";

import { IncomingMessage } from "http";
import { parse as parseQueryString } from "querystring";
import { parse as parseURL } from "url";
import { ZarinpalPaymentSessionFactory } from "./zarinpal-payment-session-factory";
import { HttpReader } from "./http/http-reader";

/**
 * Implements Zarinpal payment service manager.
 *
 * @export
 * @class ZarinpalPaymentManager
 * @implements {PaymentService}
 */
export class ZarinpalPaymentManager implements PaymentManager {
  private _sessions: ZarinpalPaymentSession[];

  constructor(private _paymentSessionFactory: ZarinpalPaymentSessionFactory) {}

  /**
   * Creates and returns a Zarinpal payment session object.
   *
   * @returns {PaymentSession}
   * @memberof ZarinpalPaymentManager
   */
  create(): PaymentSession {
    return this._paymentSessionFactory.create();
  }

  /**
   * Returns the payment session associated with given request.
   *
   * @param {IncomingMessage} request
   * @param {*} [requestData]
   * @returns {PaymentSession} The associated payment session; otherwise,
   *    undefined.
   * @memberof ZarinpalPaymentManager
   */
  get(request: IncomingMessage, requestData?: any): PaymentSession {
    const qs = parseQueryString(parseURL(request.url).query);

    return this._sessions.find(x => {
      return x.isMine(request, requestData, qs);
    });
  }
}
