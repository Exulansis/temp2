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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const signedCredential_1 = require("./signedCredential");
const linkedDataSignature_1 = require("../../linkedDataSignature");
const mapping_1 = require("../../linkedDataSignature/mapping");
const chainedProof2021_1 = require("../../linkedDataSignature/suites/chainedProof2021");
const AllsuiteImpls = Object.assign({ [linkedDataSignature_1.SupportedSuites.ChainedProof2021]: {
        impl: chainedProof2021_1.ChainedProof2021,
        customArgs: {},
    } }, mapping_1.SuiteImplementation);
class CredentialSigner {
    constructor() {
        this._credential = null;
        this._proofs = [];
        this.issuanceMetadata = {};
    }
    get proofs() {
        return this._proofs;
    }
    addProof(proof) {
        this.proofs.push(proof);
    }
    addProofs(proofS) {
        proofS.forEach((p) => {
            p && this.addProof(p);
        });
        return this;
    }
    get credential() {
        return this._credential;
    }
    set credential(credential) {
        this._credential = credential;
    }
    setIssuer(issuer) {
        this.issuanceMetadata.issuer = issuer;
        return this;
    }
    setDates(issuance, expiry) {
        this.issuanceMetadata = Object.assign(Object.assign({}, this.issuanceMetadata), { expiry,
            issuance });
        return this;
    }
    generateAndSetDates() {
        this.issuanceMetadata = Object.assign(Object.assign({}, this.issuanceMetadata), { issuance: new Date(), expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) });
        return this;
    }
    async generateProof(proofType, opts, issuer, pass) {
        this.ensureReadyToIssue();
        const _a = this.toSignedCredential().toJSON(), { proof } = _a, document = __rest(_a, ["proof"]);
        const suiteImpl = AllsuiteImpls[proofType];
        if (!suiteImpl) {
            throw new Error(`Signature suite ${proofType} not suported`);
        }
        const ldProofImpl = suiteImpl.impl.create(opts.proofOptions);
        const ldProof = (await ldProofImpl.derive({
            document,
            previousProofs: this.proofs,
        }, opts.proofSpecificOptions, issuer, pass));
        this.addProof(ldProof);
        return ldProof;
    }
    ensureReadyToIssue() {
        assert_1.default(this.credential, 'no credential set');
        assert_1.default(this.issuanceMetadata.issuer, 'issuer not set');
        assert_1.default(this.issuanceMetadata.issuance, 'issuance date not set');
        return;
    }
    toSignedCredential() {
        this.ensureReadyToIssue();
        const signedCred = this.credential.toVerifiableCredential();
        signedCred.issuer = this.issuanceMetadata.issuer;
        signedCred.expires = this.issuanceMetadata.expiry;
        signedCred.issued = this.issuanceMetadata.issuance;
        signedCred.proof = this.proofs.filter((p) => !!p);
        return signedCred;
    }
    static fromCredential(credential) {
        return new CredentialSigner().setCredential(credential);
    }
    static fromSignedCredential(vcOrJSON) {
        const signedCredential = vcOrJSON instanceof signedCredential_1.SignedCredential
            ? vcOrJSON
            : signedCredential_1.SignedCredential.fromJSON(vcOrJSON);
        return new CredentialSigner()
            .setCredential(signedCredential.credential)
            .setDates(signedCredential.issued, signedCredential.expires)
            .setIssuer(signedCredential.issuer)
            .addProofs(signedCredential.proof);
    }
    setCredential(credential) {
        if (!this.credential) {
            assert_1.default(credential.id, new Error('credential identifier must be present'));
            assert_1.default(credential.context[0] === 'https://www.w3.org/2018/credentials/v1', new Error('context must be one or more URIs, first URI must be https://www.w3.org/2018/credentials/v1'));
            assert_1.default(credential.type.length > 1 &&
                credential.type[0] === 'VerifiableCredential', new Error('Type must contain at least two entries, first must be VerifiableCredential'));
            assert_1.default(credential.credentialSubject.id, new Error('credentialSubject section must be present. Multiple subjects are not supported.'));
            this.credential = credential;
        }
        return this;
    }
}
exports.CredentialSigner = CredentialSigner;
//# sourceMappingURL=credentialSigner.js.map