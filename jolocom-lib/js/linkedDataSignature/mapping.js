"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const ecdsaKoblitzSignature2016_1 = require("./suites/ecdsaKoblitzSignature2016");
const ed25519Signature2018_1 = require("./suites/ed25519Signature2018");
exports.SuiteImplementation = {
    [_1.SupportedSuites.Ed25519Signature2018]: {
        impl: ed25519Signature2018_1.Ed25519Signature2018,
        customArgs: {},
    },
    [_1.SupportedSuites.EcdsaKoblitzSignature2016]: {
        impl: ecdsaKoblitzSignature2016_1.EcdsaLinkedDataSignature,
        customArgs: {},
    },
};
//# sourceMappingURL=mapping.js.map