import { OperationError } from "../src/operation-error";

import chai from "chai";
import "jest";

const expect = chai.expect;

describe("OperationError", () => {
    it("should be able to be instantiated with null arguments.", () => {
        new OperationError(null, null);
    });

    it("should correctly identify successful result.", () => {
        expect(OperationError.successful().isSuccessful).to.be.equal(true);
    });
});
