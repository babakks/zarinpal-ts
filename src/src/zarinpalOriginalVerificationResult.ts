/**
 * Encapsulates the Zarinpal's original verification service result.
 *
 * The class is defined for strong-typing.
 *
 * @export
 * @class ZarinpalOriginalVerificationResult
 */
export class ZarinpalOriginalVerificationResult {
  /**
   * Creates an instance of `ZarinpalOriginalVerificationResult`.
   *
   * @param {number} status
   * @param {string} refId
   * @memberof ZarinpalOriginalVerificationResult
   */
  constructor(public status: number, public refId: string) {}

  static from(data: any): ZarinpalOriginalVerificationResult {
    return new ZarinpalOriginalVerificationResult(
      parseInt(data.Status),
      data.RefID
    );
  }

  get isSuccessful(): boolean {
    return this.status === 100;
  }
}
