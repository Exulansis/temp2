"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SupportedSuites;
(function (SupportedSuites) {
    SupportedSuites["ChainedProof2021"] = "ChainedProof2021";
    SupportedSuites["EcdsaKoblitzSignature2016"] = "EcdsaKoblitzSignature2016";
    SupportedSuites["Ed25519Signature2018"] = "Ed25519Signature2018";
})(SupportedSuites = exports.SupportedSuites || (exports.SupportedSuites = {}));
class LinkedDataProof {
    constructor() {
        this._verificationMethod = "";
        this._proofPurpose = "assertionMethod";
        this._created = new Date();
        this._proofValue = "";
    }
}
exports.LinkedDataProof = LinkedDataProof;
//# sourceMappingURL=index.js.map