import { OperationResult } from "../src/operation-result";

import chai from "chai";
import "jest";

const expect = chai.expect;

describe("OperationResult", () => {
    it("should be able to be instantiated with null arguments.", () => {
        new OperationResult<string>(null, null);
    });
});
