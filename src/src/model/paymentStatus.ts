/**
 * Defines states of a payment.
 *
 * @enum
 * @exports
 */
export enum PaymentStatus {
  /**
   * Payment object is created but yet to be registered on payment server.
   */
  Created = "created",

  /**
   * Payment is being processed for registration.
   */
  Processing = "processing",

  /**
   * Payment registration has failed.
   */
  RegistrationFailed = "registrationFailed",

  /**
   * Payment has been registered on the payment server and is ready to be
   * accomplished by the user.
   */
  Registered = "registered",

  /**
   * Payment has failed.
   */
  Failed = "failed",

  /**
   * Payment done successfully.
   */
  Done = "done"
}

/**
 * Determines whether given argument is a `PaymentStatus` object.
 *
 * @export
 * @param {unknown} object Object to check its type.
 * @returns {object is PaymentStatus}
 */
export function isPaymentStatus(object: unknown): object is PaymentStatus {
  return (
    typeof object === "string" &&
    (object === "created" ||
      object === "processing" ||
      object === "registrationFailed" ||
      object === "registered" ||
      object === "failed" ||
      object === "done")
  );
}
