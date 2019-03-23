/**
 * Encapsulates Zarinpal's error objects.
 *
 * @export
 * @class ZarinpalError
 * @extends {Error}
 */
export class ZarinpalError extends Error {
  /**
   * Creates an instance of ZarinpalError.
   *
   * @param {number} code Error code (as defined in Zarinpal's docs.)
   * @param {string} message Error message.
   * @memberof ZarinpalError
   */
  constructor(public code: number, public message: string) {
    super(message);
  }
}
