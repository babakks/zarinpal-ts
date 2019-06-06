import { ZarinpalErrorCatalog } from "../src/zarinpalErrorCatalog";

import { expect } from "chai";
import "mocha";

describe("ZarinpalErrorCatalog", () => {
  describe("get()", () => {
    it("should return the correct entry.", () => {
      expect(ZarinpalErrorCatalog.instance.get(-11).code).to.equal(-11);
    });

    it("should return `undefined` if given code was not found.", () => {
      expect(ZarinpalErrorCatalog.instance.get(999888)).to.be.undefined;
    });
  });

  describe("getSuccessful()", () => {
    it("should return the 'successful' entry correctly.", () => {
      expect(ZarinpalErrorCatalog.instance.getSuccessful().code).to.equal(100);
    });
  });
});
