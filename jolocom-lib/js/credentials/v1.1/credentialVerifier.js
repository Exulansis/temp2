"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const linkedDataSignature_1 = require("../../linkedDataSignature");
const chainedProof2021_1 = require("../../linkedDataSignature/suites/chainedProof2021");
class CredentialVerifier {
    constructor(signers) {
        this.signerIdentities = {};
        signers.forEach((id) => {
            this.signerIdentities[id.publicKeyMetadata.signingKeyId] = id.identity;
        });
    }
    async verifyProofAtIndex(credential, index) {
        const ldProof = credential.proof[index];
        if (!ldProof) {
            throw new Error(`Proof at index ${index} not found.`);
        }
        const _a = credential.toJSON(), { proof } = _a, document = __rest(_a, ["proof"]);
        const verifier = this.signerIdentities[ldProof.verificationMethod];
        if (!verifier) {
            throw new Error(`No Identity found for did ${ldProof.verificationMethod}`);
        }
        return await ldProof.verify({
            document,
            previousProofs: credential.proof,
        }, verifier, Object.values(this.signerIdentities));
    }
    async verifyProofs(credential) {
        const toVerify = credential.proof;
        const allVerifications = await Promise.all(credential.proof.map((_, i) => {
            return this.verifyProofAtIndex(credential, i).catch(_ => false);
        }));
        return (allVerifications).every(res => res == true);
    }
    addSignerIdentity(signer) {
        this.signerIdentities[signer.did] = signer;
    }
    async generateVerificationReport(credential) {
        return this.verLoop(credential, credential.proof);
    }
    async verLoop(credential, [toVerify, ...otherProofs], report = {}) {
        if (!toVerify) {
            return report;
        }
        const index = credential.proof.indexOf(toVerify);
        report[index] = {
            valid: true,
            proofMetadata: Object.assign({ type: toVerify.proofType, created: toVerify.created, verificationMethod: toVerify.verificationMethod }, (toVerify.proofType === linkedDataSignature_1.SupportedSuites.ChainedProof2021
                ? {
                    referencedProofValid: true,
                    previousProof: toVerify
                        .previousProof,
                    chainSignatureSuite: toVerify.chainSignatureSuite,
                }
                : {})),
        };
        try {
            const result = await this.verifyProofAtIndex(credential, index);
            if (!result) {
                throw new Error('SignatureVerificationFailed');
            }
            report[index] = Object.assign(Object.assign({}, report[index]), { valid: result });
        }
        catch (e) {
            if (e.message === chainedProof2021_1.ErrorCodes.InnerSignatureVerificationFailed) {
                report[index] = Object.assign(Object.assign({}, report[index]), { valid: true, proofMetadata: Object.assign(Object.assign({}, report[index].proofMetadata), { referencedProofValid: false }), error: e.message });
            }
            else if (e.message === chainedProof2021_1.ErrorCodes.ChainAndInnerSignatureVerificationFailed) {
                report[index] = Object.assign(Object.assign({}, report[index]), { valid: false, proofMetadata: Object.assign(Object.assign({}, report[index].proofMetadata), { referencedProofValid: false }), error: e.message });
            }
            else {
                report[index] = Object.assign(Object.assign({}, report[index]), { valid: false, error: e.message });
            }
        }
        return this.verLoop(credential, otherProofs, report);
    }
}
exports.CredentialVerifier = CredentialVerifier;
//# sourceMappingURL=credentialVerifier.js.map