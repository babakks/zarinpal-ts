import {
  ZarinpalPaymentManager,
  SandboxZarinpalPaymentSessionFactory,
  ZarinpalServiceConfig,
  DefaultHttpServiceInvoker,
  PaymentManager
} from "zarinpal-payment";

export function composePaymentInterface(): PaymentManager {
  const zarinpalConfig = new ZarinpalServiceConfig(
    "00000000-0000-0000-0000-000000000000"
  );
  const invoker = new DefaultHttpServiceInvoker();

  const sessionFactory = new SandboxZarinpalPaymentSessionFactory(
    zarinpalConfig,
    invoker
  );

  const paymentManager = new ZarinpalPaymentManager(sessionFactory);

  return paymentManager;
}
