import { ZarinpalErrorCatalog } from "../src/zarinpal-error-catalog";

import "jest";

describe("ZarinpalErrorCatalog.get()", () => {
  it("should return the correct entry.", () => {
    expect(new ZarinpalErrorCatalog().get(-11).code).toBe(-11);
  });

  it("should return undefined if given code was not found.", () => {
    expect(new ZarinpalErrorCatalog().get(999888)).toBeUndefined();
  });
});

describe("ZarinpalErrorCatalog.getSuccessful()", () => {
  it('should return the "successful" entry correctly.', () => {
    expect(new ZarinpalErrorCatalog().getSuccessful().code).toBe(100);
  });
});
