import { ZarinpalWageCalculator } from "./zarinpalWageCalculator";

/**
 * Holds the Zarinpal payment service configurations.
 *
 * @export
 * @class ZarinpalServiceConfig
 */
export class ZarinpalServiceConfig {
  /**
   * Creates an instance of ZarinpalServiceConfig.
   *
   * @param {string} merchantId Merchant ID of the gateway owner.
   * @param {ZarinpalWageCalculator} [wageCalculator] Wage calculator function,
   *    if any.
   * @param {number} [expireIn] Gateway expiration duration to override the
   *    default value.
   * @memberof ZarinpalServiceConfig
   */
  constructor(
    public merchantId: string,
    public wageCalculator?: ZarinpalWageCalculator,
    public expireIn?: number
  ) {}
}
