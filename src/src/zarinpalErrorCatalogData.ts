import { ZarinpalError } from "./zarinpalError";

export default {
  errors: [
    new ZarinpalError(-999, "پرداخت توسط کاربر لغو شد."),
    new ZarinpalError(-1, "اطلاعات ارسال شده ناقص است."),
    new ZarinpalError(-2, "IP و یا مرچنت کد پذیرنده صحیح نیست."),
    new ZarinpalError(
      -3,
      "با توجه به محدودیت های شاپرک امکان پرداخت با رقم درخواست شده میسر نمی باشد."
    ),
    new ZarinpalError(-4, "سطح تایید پذیرنده پایین تر از سطح نقره ای است."),
    new ZarinpalError(-11, "درخواست مورد نظر یافت نشد."),
    new ZarinpalError(-12, "امکان ویرایش درخواست میسر نمی باشد."),
    new ZarinpalError(-21, "هیچ نوع عملیات مالی برای این تراکنش یافت نشد."),
    new ZarinpalError(-22, "تراکنش نا موفق میباشد."),
    new ZarinpalError(-33, "رقم تراکنش با رقم پرداخت شده مطابقت ندارد."),
    new ZarinpalError(
      -34,
      "سقف تقسیم تراکنش از لحاظ تعداد یا رقم عبور نموده است."
    ),
    new ZarinpalError(-40, "اجازه دسترسی به متد مربوطه وجود ندارد."),
    new ZarinpalError(
      -41,
      "اطلاعات ارسال شده مربوط به AdditionalData غیرمعتبر میباشد."
    ),
    new ZarinpalError(
      -42,
      "مدت زمان معتبر طول عمر شناسه پرداخت باید بین 30 دقیقه تا 45 روز می باشد."
    ),
    new ZarinpalError(-54, "درخواست مورد نظر آرشیو شده است."),
    new ZarinpalError(100, "عملیات با موفقیت انجام گردیده است."),
    new ZarinpalError(
      101,
      "عملیات پرداخت موفق بوده و قبلا PaymentVerification تراکنش انجام شده است."
    )
  ]
};
