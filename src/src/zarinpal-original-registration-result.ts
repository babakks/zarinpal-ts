/**
 * Encapsulates the Zarinpal's original registration service result.
 *
 * The class is defined for strong-typing.
 *
 * @export
 * @class ZarinpalOriginalRegistrationResult
 */
export class ZarinpalOriginalRegistrationResult {
  constructor(public status: number, public authority: string) {}

  static from(data: any): ZarinpalOriginalRegistrationResult {
    return new ZarinpalOriginalRegistrationResult(
      parseInt(data.Status),
      data.Authority
    );
  }

  isSuccessful(): boolean {
    return this.status === 100;
  }
}
