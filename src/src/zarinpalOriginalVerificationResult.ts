/**
 * Encapsulates the Zarinpal's original verification service result.
 *
 * The class is defined for strong-typing.
 *
 * @export
 * @class ZarinpalOriginalVerificationResult
 */
export class ZarinpalOriginalVerificationResult {
  constructor(public status: number, public refId: string) {}

  static from(data: any): ZarinpalOriginalVerificationResult {
    return new ZarinpalOriginalVerificationResult(
      parseInt(data.Status),
      data.RefID
    );
  }

  isSuccessful(): boolean {
    return this.status === 100;
  }
}
