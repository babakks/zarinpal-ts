import { ZarinpalError } from "./zarinpalError";
import { default as config } from "./zarinpalErrorCatalogData";

/**
 * Provides an error catalog for Zarinpal payment process.
 *
 * @export
 * @class ZarinpalErrorCatalog
 */
export class ZarinpalErrorCatalog {
  private _catalog: ZarinpalError[];

  /**
   * Creates an instance of `ZarinpalErrorCatalog`.
   *
   * @memberof ZarinpalErrorCatalog
   */
  constructor() {
    this._catalog = config.errors;
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
    return this._catalog.filter(x => x.code === code)[0];
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
