import { ZarinpalError } from "./zarinpalError";
import { default as config } from "./zarinpalErrorCatalogData";

/**
 * Provides an error catalog for Zarinpal payment process.
 *
 * @export
 * @class ZarinpalErrorCatalog
 */
export class ZarinpalErrorCatalog {
  /**
   * Provides the singleton instance of `ZarinpalErrorCatalog`.
   *
   * @static
   * @type {ZarinpalErrorCatalog}
   * @memberof ZarinpalErrorCatalog
   */
  static readonly instance: ZarinpalErrorCatalog = new ZarinpalErrorCatalog();

  private catalog: ZarinpalError[];

  /**
   * Creates an instance of `ZarinpalErrorCatalog`.
   *
   * @private
   * @memberof ZarinpalErrorCatalog
   */
  private constructor() {
    this.catalog = config.errors;
  }

  /**
   * Returns the error associated with given error code.
   *
   * @param {number} code
   * @returns {ZarinpalError} The error associated with the given code;
   *   otherwise, undefined.
   * @memberof ZarinpalErrorCatalog
   */
  get(code: number): ZarinpalError {
    return this.catalog.filter(x => x.code === code)[0];
  }

  /**
   * Gets the default successful operation error object.
   *
   * @returns {ZarinpalError}
   * @memberof ZarinpalErrorCatalog
   */
  getSuccessful(): ZarinpalError {
    return this.get(100);
  }
}
