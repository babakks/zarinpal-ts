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
  Created,

  /**
   * Payment is being processed for registration.
   */
  Processing,

  /**
   * Payment registration has failed.
   */
  RegistrationFailed,

  /**
   * Payment has been registered on the payment server and is ready to be
   * accomplished by the user.
   */
  Registered,

  /**
   * Payment has failed.
   */
  Failed,

  /**
   * Payment done successfully.
   */
  Done
}
