import { ZarinpalErrorCatalog } from "../src/zarinpal-error-catalog";

import { expect } from "chai";

describe("ZarinpalErrorCatalog", () => {
  describe("get()", () => {
    it("should return the correct entry.", () => {
      expect(new ZarinpalErrorCatalog().get(-11).code).to.equal(-11);
    });

    it("should return `undefined` if given code was not found.", () => {
      expect(new ZarinpalErrorCatalog().get(999888)).to.be.undefined;
    });
  });

  describe("getSuccessful()", () => {
    it("should return the 'successful' entry correctly.", () => {
      expect(new ZarinpalErrorCatalog().getSuccessful().code).to.equal(100);
    });
  });
});
