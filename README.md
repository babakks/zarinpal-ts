# `zarinpal-ts`

A NodeJS package, written in TypeScript, to provide access to Zarinpal's payment gateway.

## Installation

Open a command prompt in the directory where `package.json` resides, and run this:

```sh
npm install zarinpal-ts --save
```

This installs the latest version of the package in your project's local node modules.

## Sample codes

Sample usages of the package are located under the [`zarinpal-ts-sample`](https://github.com/babakks/zarinpal-ts-sample) repository.

## Design

The package is a set of loosely-coupled components that enable developers to
replace their own implementations, if they ever had to. More than that, the
design of the package is general to most of the current web based payment
providers, so the developers do not need to replace the whole package (and hence,
their code) if they've switched to a new payment service; adding a few
implementations, if not already been made by others, and a little modification
of the application's composition root will do the job.

The design is based on these abstract entities:

- `PaymentManager`
- `PaymentSession`
- `Payment`

The `PaymentManager` is the outmost interface that provides the clients (here,
the developers that use the package) with appropriate `PaymentSession` objects
which encapsulate the payment process. That is, every payment, from the
beginning to the end, takes place in a context, called `PaymentSession`. The job
of the `PaymentManager`, is to create `PaymentSession` objects for new payments,
track all active sessions, and given the HTTP request sent back from the payment
server to the application (callback), return the corresponding payment session
object.

The `PaymentSession`, enables client to set the details of the payment (held
within the `Payment` class objects) and register it on the payment server. This
is done via the `register` method, which takes a callback URL that determines
where to navigate back the user after the payment has been done/aborted.

Since, the three steps: registration, payment, and verification are common among
payment services, it's possible to use the abstraction above for payment
services other than the Zarinpal's.

## Usage

1. To start a payment process, first off, you need to create a new payment session
   by calling `PaymentManager`'s `create` method:

```ts
const paymentManager = this.sessionContext("paymentManager");
const paymentSession = paymentManager.create();
```

Note that, `PaymentManager` has to be a singleton. So, here,
`this.sessionContext()` is assumed to return from the user session data on the
application server.

2. Setting up payment information:

```ts
paymentSession.payment.amount = 1000; // (In Rials.)
paymentSession.payment.description = "Showcase payment.";
paymentSession.payment.email = "me@someserver.com";
```

3. Registering on the payment server:

```ts
const registration = await paymentSession.register(
    "http://my.domain.com/payment/callback"
);

if (registration.isSuccessful) {
    const gatewayURL = paymentSession.gateway;

    /* ...Redirecting to the "gatewayURL"... */
} else {
    const message = registration.message;

    /* ...Returning "message" to the user... */
}
```

4. After the user has done/abort the payment, the payment server redirects to
   the given callback URL at which payment verification should take place. Before proceeding to verification, it's necessary to recover the corresponding
   `PaymentSession`:

```ts
const paymentManager = this.sessionContext("paymentManager");
const paymentSession = paymentManager.get(request);
```

Here, `request` is assumed to be the original request object of
`IncomingMessage` type.

5. Verifying the payment:

```ts
const verification = await paymentSession.verify(request);

if (verification.isSuccessful) {
    const refId = verification.refId;

    /* ...Returning "refId" to the user... */
} else {
    const message = verification.message;

    /* ...Returning "message" to the user... */
}
```

## Composition

At startup, application should compose payment module from components. For
example, for a sandbox-ed payment module:

```ts
import {
    ZarinpalPaymentManager,
    SandboxZarinpalPaymentSessionFactory,
    DefaultZarinpalPaymentSessionFactory,
    ZarinpalServiceConfig,
    DefaultHttpServiceInvoker,
    PaymentManager
} from "zarinpal-ts";

const zarinpalConfig = new ZarinpalServiceConfig(
    // Put your MerchantID here:
    "00000000-0000-0000-0000-000000000000"
);
const invoker = new DefaultHttpServiceInvoker();

/**
 * The line below initializes a sandbox-ed payment gateway. To use the actual
 * gateway replace "SandboxZarinpalPaymentSessionFactory" with
 * "DefaultZarinpalPaymentSessionFactory".
 */
const sessionFactory = new SandboxZarinpalPaymentSessionFactory(
    zarinpalConfig,
    invoker
);

const paymentManager = new ZarinpalPaymentManager(sessionFactory);
```

Now, `paymentManager` should be stored to be available for every request as a
singleton.

For complete sample code, look at the
[`zarinpal-ts-sample`](https://github.com/babakks/zarinpal-ts-sample) repository.
