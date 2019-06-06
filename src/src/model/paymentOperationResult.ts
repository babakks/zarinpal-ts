/**
 * Encapsulates payment operation (i.e., registration or verification) result.
 *
 * @export
 * @class PaymentOperationResult
 */
export class PaymentOperationResult {
  /**
   * Creates an instance of `PaymentResult`.
   *
   * @param {boolean} [isSuccessful=true] Operation success/failure indicator.
   * @param {string} [code=""] Error code, if any.
   * @param {string} [message=""] Error message, if any.
   * @memberof PaymentOperationResult
   */
  constructor(
    public readonly isSuccessful: boolean = true,
    public readonly code: string = "",
    public readonly message: string = ""
  ) {}
}
