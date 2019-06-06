import { Payment } from "./model/payment";

/**
 * Defines a function that calculates the desired Zarinpal payment wags.
 *
 * @param {Payment} payment
 * @returns {*} The object of wages, in the same format as in the Zarinpal
 *     service documentations.
 */
export type ZarinpalWageCalculator = (payment: Payment) => any;
