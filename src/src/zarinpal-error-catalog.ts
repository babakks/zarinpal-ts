import { default as config } from "./zarinpal-error-catalog-data";

export type ZarinpalError = { code: number; message: string };

/**
 * Provides an error catalog for Zarinpal payment process.
 *
 * @export
 * @class ZarinpalErrorCatalog
 */
export class ZarinpalErrorCatalog {
  private _catalog: ZarinpalError[];

  constructor() {
    this._catalog = config.errors;
  }

  /**
   * Returns the error associated with given error code.
   *
   * @param {number} code
   * @returns The error associated with the given code; otherwise, undefined.
   * @memberof ZarinpalErrorCatalog
   */
  get(code: number): ZarinpalError {
    return this._catalog.find(x => x.code === code);
  }

  /**
   * Gets the default successful operation error object.
   *
   * @returns {ZarinpalError}
   * @memberof ZarinpalErrorCatalog
   */
  getSuccessful(): ZarinpalError {
    return this._catalog.find(x => x.code === 100);
  }
}
