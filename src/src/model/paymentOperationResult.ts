/**
 * Encapsulates payment operation (i.e., registration or verification) result.
 *
 * @export
 * @class PaymentOperationResult
 */
export class PaymentOperationResult {
  /**
   * Creates an instance of PaymentResult.
   *
   * @param {boolean} [isSuccessful=true] Operation success/failure indicator.
   * @param {string} [code=""] Error code, if any.
   * @param {string} [message=""] Error message, if any.
   * @memberof PaymentOperationResult
   */
  constructor(
    public isSuccessful: boolean = true,
    public code: string = "",
    public message: string = ""
  ) {}
}
