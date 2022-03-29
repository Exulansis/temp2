"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var ChainedProof2021_1;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const __1 = require("..");
const mapping_1 = require("../mapping");
const validation_1 = require("../../utils/validation");
const util_1 = require("../../credentials/v1.1/util");
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["InnerSignatureVerificationFailed"] = "InnerSignatureVerificationFailed";
    ErrorCodes["ChainAndInnerSignatureVerificationFailed"] = "ChainAndInnerSignatureVerificationFailed";
})(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
let ChainedProof2021 = ChainedProof2021_1 = class ChainedProof2021 extends __1.LinkedDataProof {
    constructor() {
        super(...arguments);
        this.proofType = __1.SupportedSuites.ChainedProof2021;
        this.signatureSuite = {
            hashFn: undefined,
            normalizeFn: undefined,
            encodeSignature: undefined,
            decodeSignature: undefined,
        };
        this._chainSignatureSuite = __1.SupportedSuites.EcdsaKoblitzSignature2016;
    }
    get chainSignatureSuite() {
        return this._chainSignatureSuite;
    }
    set chainSignatureSuite(chainSignatureSuite) {
        this._chainSignatureSuite = chainSignatureSuite;
        if (!this.signatureSuite.normalizeFn &&
            !this.signatureSuite.hashFn &&
            !this.signatureSuite.encodeSignature &&
            !this.signatureSuite.decodeSignature) {
            this.signatureSuite = new mapping_1.SuiteImplementation[chainSignatureSuite].impl().signatureSuite;
        }
    }
    get created() {
        return this._created;
    }
    set created(created) {
        this._created = created;
    }
    get type() {
        return this.proofType;
    }
    set type(type) {
        this.proofType = type;
    }
    get previousProof() {
        return this._previousProof;
    }
    set previousProof(prevProof) {
        this._previousProof = prevProof;
    }
    get proofPurpose() {
        return this._proofPurpose;
    }
    set proofPurpose(proofPurpose) {
        this._proofPurpose = proofPurpose;
    }
    get signature() {
        return this._proofValue;
    }
    set signature(signature) {
        this._proofValue = signature;
    }
    get verificationMethod() {
        return this._verificationMethod;
    }
    set verificationMethod(verificationMethod) {
        this._verificationMethod = verificationMethod;
    }
    static create(args) {
        const cp = new ChainedProof2021_1();
        cp.verificationMethod = args.verificationMethod;
        cp.created = args.created || new Date();
        cp._proofPurpose = args.proofPurpose || 'assertionMethod';
        return cp;
    }
    async derive(inputs, customProofOptions, signer, pass) {
        this.previousProof = customProofOptions.previousProof;
        const ldProof = this.findMatchingProof(inputs.previousProofs);
        if (customProofOptions.strict) {
            const prevSigValid = await ldProof
                .verify(inputs, signer.identity)
                .catch((_) => false);
            if (!prevSigValid) {
                throw new Error(ErrorCodes.InnerSignatureVerificationFailed);
            }
        }
        this.chainSignatureSuite = customProofOptions.chainSignatureSuite;
        const toBeSigned = await this.createVerifyHash(class_transformer_1.classToPlain(ldProof));
        this.signature = this.signatureSuite.encodeSignature(await signer.sign(toBeSigned, pass));
        return this;
    }
    async verify(inputs, signer, additionalSigners) {
        const previousProof = this.findMatchingProof(inputs.previousProofs);
        if (!previousProof) {
            throw new Error('Referenced Previous Proof not found');
        }
        const combinedSigners = [signer, ...additionalSigners];
        const referencedProofSigner = combinedSigners.find((identity) => previousProof.verificationMethod.includes(identity.did));
        const referencedProofValid = await previousProof
            .verify(inputs, referencedProofSigner, combinedSigners)
            .catch((_) => false);
        const toBeVerified = await this.createVerifyHash(class_transformer_1.classToPlain(previousProof));
        const chainSignatureValid = await validation_1.verifySignatureWithIdentity(toBeVerified, this.signatureSuite.decodeSignature(this.signature), this.verificationMethod, signer).catch((_) => false);
        if (!referencedProofValid) {
            throw new Error(ErrorCodes.InnerSignatureVerificationFailed);
        }
        if (!referencedProofValid && !chainSignatureValid) {
            throw new Error(ErrorCodes.ChainAndInnerSignatureVerificationFailed);
        }
        return chainSignatureValid;
    }
    async createVerifyHash(document) {
        const normalizedPrevProof = await this.signatureSuite.normalizeFn(Object.assign(Object.assign({}, document), { '@context': document['@context'] }));
        const _a = this.toJSON(), { proofValue } = _a, proofOptions = __rest(_a, ["proofValue"]);
        const normalizedProofOptions = await this.signatureSuite.normalizeFn(Object.assign(Object.assign({}, proofOptions), { '@context': document['@context'] }));
        return Buffer.concat([
            this.signatureSuite.hashFn(Buffer.from(normalizedProofOptions)),
            this.signatureSuite.hashFn(Buffer.from(normalizedPrevProof)),
        ]);
    }
    findMatchingProof(proofs) {
        const matches = proofs.filter(({ proofPurpose, proofType, created, verificationMethod }) => {
            return (proofType === this.previousProof.type &&
                verificationMethod === this.previousProof.verificationMethod &&
                created.toString() === this.previousProof.created.toString() &&
                proofPurpose === this.previousProof.proofPurpose);
        });
        if (matches.length !== 1) {
            throw new Error(`Expected previousProof to match exactly one proof node, instead it matches ${matches.length}`);
        }
        return matches[0];
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(ChainedProof2021_1, json);
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
};
__decorate([
    class_transformer_1.Expose()
], ChainedProof2021.prototype, "chainSignatureSuite", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform(({ value }) => value && new Date(value), { toClassOnly: true }),
    class_transformer_1.Transform(({ value }) => util_1.dateToIsoString(value), {
        toPlainOnly: true,
    })
], ChainedProof2021.prototype, "created", null);
__decorate([
    class_transformer_1.Expose()
], ChainedProof2021.prototype, "type", null);
__decorate([
    class_transformer_1.Expose()
], ChainedProof2021.prototype, "previousProof", null);
__decorate([
    class_transformer_1.Expose()
], ChainedProof2021.prototype, "proofPurpose", null);
__decorate([
    class_transformer_1.Expose({ name: 'proofValue' })
], ChainedProof2021.prototype, "signature", null);
__decorate([
    class_transformer_1.Expose()
], ChainedProof2021.prototype, "verificationMethod", null);
ChainedProof2021 = ChainedProof2021_1 = __decorate([
    class_transformer_1.Exclude()
], ChainedProof2021);
exports.ChainedProof2021 = ChainedProof2021;
//# sourceMappingURL=chainedProof2021.js.map