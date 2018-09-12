# `zarinpal-ts`

A NodeJS package, written in TypeScript, to provide access to Zarinpal's payment gateway.

# Installing

Open a command prompt in the directory where `package.json` resides, and run this:

```
npm install zarinpal-ts --save
```

This installs the latest version of the package in your project's local node modules.

# Sample codes

Sample usages of the package are located under the [`zarinpal-ts-sample`](https://github.com/babakks/zarinpal-ts-sample) repository.

# Design

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

The `PaymentSession`, enables the client to set the details of the payment (held
within the `Payment` class objects) and register it on the payment server. This
is done via the `register` method which takes a callback URL that determines
where to navigate back the end user after the payment has been done/aborted. 