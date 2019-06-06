import { PaymentManager } from "./model/paymentManager";
import { PaymentSession } from "./model/paymentSession";
import { ZarinpalPaymentSession } from "./zarinpalPaymentSession";

import { IncomingMessage } from "http";
import { parse as parseQueryString } from "querystring";
import { parse as parseURL } from "url";
import { ZarinpalPaymentSessionFactory } from "./zarinpalPaymentSessionFactory";

/**
 * Implements Zarinpal payment service manager.
 *
 * @export
 * @class ZarinpalPaymentManager
 * @implements {PaymentService}
 */
export class ZarinpalPaymentManager implements PaymentManager {
  private sessions: ZarinpalPaymentSession[];

  /**
   * Creates an instance of `ZarinpalPaymentManager`.
   *    
   * @param {ZarinpalPaymentSessionFactory} factory A `ZarinpalPaymentSession`
   *   factory.
   * @memberof ZarinpalPaymentManager
   */
  constructor(private factory: ZarinpalPaymentSessionFactory) {}

  /**
   * Creates and returns a Zarinpal payment session object.
   *
   * @returns {PaymentSession}
   * @memberof ZarinpalPaymentManager
   */
  create(): PaymentSession {
    return this.factory.create();
  }

  /**
   * Returns the payment session associated with given callback HTTP request.
   *
   * @param {IncomingMessage} callbackRequest Payment callback request message.
   * @param {*} [requestData] Request data.
   * @returns {PaymentSession} The associated payment session; otherwise,
   *    `undefined`.
   * @memberof ZarinpalPaymentManager
   */
  get(callbackRequest: IncomingMessage, requestData?: any): PaymentSession {
    const qs = parseQueryString(parseURL(callbackRequest.url).query);

    return this.sessions.find(x => {
      return x.isMine(callbackRequest, requestData, qs);
    });
  }
}
