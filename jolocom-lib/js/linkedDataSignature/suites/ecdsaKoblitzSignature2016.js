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
var EcdsaLinkedDataSignature_1;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const jsonld_1 = require("jsonld");
const crypto_1 = require("../../utils/crypto");
const contexts_1 = require("../../utils/contexts");
const helper_1 = require("../../utils/helper");
const linkedData_1 = require("../../linkedData");
const validation_1 = require("../../utils/validation");
const __1 = require("..");
let EcdsaLinkedDataSignature = EcdsaLinkedDataSignature_1 = class EcdsaLinkedDataSignature extends __1.LinkedDataProof {
    constructor() {
        super(...arguments);
        this.proofType = __1.SupportedSuites.EcdsaKoblitzSignature2016;
        this.proofPurpose = 'assertionMethod';
        this.signatureSuite = {
            hashFn: crypto_1.sha256,
            normalizeFn: async (doc) => {
                return await linkedData_1.normalizeJsonLd(doc, contexts_1.defaultContext);
            },
            encodeSignature: (data) => data.toString('hex'),
            decodeSignature: (data) => Buffer.from(data, 'hex'),
        };
    }
    get created() {
        return this._created;
    }
    set created(created) {
        this._created = created;
    }
    get proofPurose() {
        return this._proofPurpose;
    }
    set proofPurose(proofPurpose) {
        this._proofPurpose = proofPurpose;
    }
    get type() {
        return this.proofType;
    }
    get signatureValue() {
        return this._proofValue;
    }
    set signatureValue(signature) {
        this._proofValue = signature;
    }
    get verificationMethod() {
        return this._verificationMethod;
    }
    set verificationMethod(verificationMethod) {
        this._verificationMethod = verificationMethod;
    }
    set creator(creator) {
        this._verificationMethod = creator;
    }
    get signer() {
        return {
            did: helper_1.keyIdToDid(this.verificationMethod),
            keyId: this.verificationMethod,
        };
    }
    get signature() {
        return this._proofValue;
    }
    set signature(signature) {
        this._proofValue = signature;
    }
    get nonce() {
        return "";
    }
    static create(arg) {
        const cp = new EcdsaLinkedDataSignature_1();
        cp.verificationMethod = arg.verificationMethod;
        cp.created = arg.created || new Date();
        cp._proofPurpose = arg.proofPurpose || 'assertionMethod';
        return cp;
    }
    async derive(inputs, proofSpecificOptions, signer, pass) {
        if (!this.verificationMethod || !this.created) {
            throw new Error('Proof options not set');
        }
        if (this.verificationMethod !== signer.publicKeyMetadata.signingKeyId) {
            throw new Error(`No signer for referenced verificationMethod ${this.verificationMethod}`);
        }
        const toSign = await this.createVerifyHash(inputs.document);
        const signature = await signer.sign(toSign, pass);
        this.signatureValue = this.signatureSuite.encodeSignature(signature);
        return this;
    }
    async verify(inputs, signer) {
        const digest = await this.createVerifyHash(inputs.document);
        return validation_1.verifySignatureWithIdentity(digest, this.signatureSuite.decodeSignature(this.signatureValue), this.verificationMethod, signer);
    }
    async createVerifyHash(document) {
        const normalizedDoc = await this.signatureSuite.normalizeFn(document);
        const _a = this.toJSON(), { signatureValue } = _a, proofOptions = __rest(_a, ["signatureValue"]);
        const normalizedProofOptions = await this.signatureSuite.normalizeFn(proofOptions);
        return Buffer.concat([
            this.signatureSuite.hashFn(Buffer.from(normalizedProofOptions)),
            this.signatureSuite.hashFn(Buffer.from(normalizedDoc)),
        ]);
    }
    async normalize() {
        const json = this.toJSON();
        json['@context'] = contexts_1.defaultContext[0];
        delete json.signatureValue;
        delete json.type;
        delete json.id;
        return jsonld_1.canonize(json);
    }
    async asBytes() {
        return Buffer.from(await this.normalize());
    }
    async digest() {
        const normalized = await this.normalize();
        return crypto_1.sha256(Buffer.from(normalized));
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(EcdsaLinkedDataSignature_1, json);
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
};
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform(({ value }) => value && new Date(value), { toClassOnly: true }),
    class_transformer_1.Transform(({ value }) => value && value.toISOString(), {
        toPlainOnly: true,
    })
], EcdsaLinkedDataSignature.prototype, "created", null);
__decorate([
    class_transformer_1.Expose()
], EcdsaLinkedDataSignature.prototype, "proofPurose", null);
__decorate([
    class_transformer_1.Expose()
], EcdsaLinkedDataSignature.prototype, "type", null);
__decorate([
    class_transformer_1.Expose()
], EcdsaLinkedDataSignature.prototype, "signatureValue", null);
__decorate([
    class_transformer_1.Expose()
], EcdsaLinkedDataSignature.prototype, "verificationMethod", null);
EcdsaLinkedDataSignature = EcdsaLinkedDataSignature_1 = __decorate([
    class_transformer_1.Exclude()
], EcdsaLinkedDataSignature);
exports.EcdsaLinkedDataSignature = EcdsaLinkedDataSignature;
//# sourceMappingURL=ecdsaKoblitzSignature2016.js.map