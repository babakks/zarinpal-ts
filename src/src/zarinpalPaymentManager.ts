import { PaymentManager } from "./model/paymentManager";
import { PaymentSession } from "./model/paymentSession";
import { ZarinpalPaymentSession } from "./zarinpalPaymentSession";
import { IncomingMessage } from "http";
import * as qs from "querystring";
import * as url from "url";
import { ZarinpalPaymentSessionFactory } from "./zarinpalPaymentSessionFactory";
import { AsyncMap } from "./misc/asyncMap";

/**
 * Implements Zarinpal payment service manager.
 *
 * @export
 * @class ZarinpalPaymentManager
 * @implements {PaymentService}
 */
export class ZarinpalPaymentManager implements PaymentManager {
  /**
   * Creates an instance of `ZarinpalPaymentManager`.
   *
   * @param {ZarinpalPaymentSessionFactory} factory A `ZarinpalPaymentSession`
   *   factory.
   * @param {AsyncMap<string, any>} storage An asynchronous key/value pair
   *   storage.
   * @memberof ZarinpalPaymentManager
   */
  constructor(
    private factory: ZarinpalPaymentSessionFactory,
    private storage: AsyncMap<string, any>
  ) {}

  /**
   * Creates and returns a new Zarinpal payment session object instance.
   *
   * @returns {Promise<PaymentSession | undefined>} A `Promise` that resolves
   *   with the newly created payment session object; otherwise, `undefined`.
   * @memberof PaymentManager
   */
  async create(): Promise<PaymentSession | undefined> {
    return this.factory.create();
  }

  /**
   * Stores given payment session for future references (typically, at
   * verification step).
   *
   * @param {ZarinpalPaymentSession} session Payment session to store.
   * @returns {Promise<void>} A `Promise` that resolves if the session stored
   *   successfully; otherwise, the `Promise` will reject.
   * @memberof PaymentManager
   */
  async store(session: ZarinpalPaymentSession): Promise<void> {
    const id = this.extractIdFromSession(session);
    await this.storage.set(id, session);
  }

  /**
   * Returns the payment session associated with given callback HTTP request.
   *
   * @param {IncomingMessage} callbackRequest Payment callback request message.
   * @param {*} [requestData] Request data.
   * @returns {Promise<PaymentSession | undefined>} A `Promise` that resolves
   *   with the associated payment session; otherwise, `undefined`.
   * @memberof PaymentManager
   */
  async get(
    callbackRequest: IncomingMessage,
    requestData?: any
  ): Promise<ZarinpalPaymentSession | undefined> {
    const id = this.extractIdFromCallback(callbackRequest);
    const object = await this.storage.get(id);
    return this.factory.create(object);
  }

  /**
   * Extracts a unique payment session identifier out of given session object.
   *
   * @protected
   * @param {ZarinpalPaymentSession} session Payment session object to extract
   *   the identifier from.
   * @returns {string} The extracted payment session unique identifier.
   * @memberof ZarinpalPaymentManager
   */
  protected extractIdFromSession(session: ZarinpalPaymentSession): string {
    return session.authority;
  }

  /**
   * Extracts a unique payment session identifier out of given callback request
   * message.
   *
   * @protected
   * @param {IncomingMessage} request Callback request message.
   * @returns {string} The extracted payment session unique identifier. If the
   *   given request message was not valid, an exception is thrown.
   * @memberof ZarinpalPaymentManager
   */
  protected extractIdFromCallback(request: IncomingMessage): string {
    const qss = qs.parse(url.parse(request.url).query);

    if (typeof qss.Authority !== "string") {
      throw new Error("Invalid callback request.");
    }

    return qss.Authority;
  }
}
