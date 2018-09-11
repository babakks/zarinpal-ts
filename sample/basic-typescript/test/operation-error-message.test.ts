import { OperationErrorMessage } from "../src/operation-error-message";

import chai from "chai";
import "jest";

const expect = chai.expect;

describe("OperationErrorMessage", () => {
    it("should be able to be instantiated with null arguments.", () => {
        new OperationErrorMessage(null, null);
    });
});
