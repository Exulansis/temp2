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
var Ed25519Signature2018_1;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const crypto_1 = require("../../utils/crypto");
const contexts_1 = require("../../utils/contexts");
const linkedData_1 = require("../../linkedData");
const validation_1 = require("../../utils/validation");
const __1 = require("..");
const rfc4648_1 = require("rfc4648");
const util_1 = require("../../credentials/v1.1/util");
let Ed25519Signature2018 = Ed25519Signature2018_1 = class Ed25519Signature2018 extends __1.LinkedDataProof {
    constructor() {
        super(...arguments);
        this.encodedJWTHeader = 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19';
        this.proofType = __1.SupportedSuites.Ed25519Signature2018;
        this.signatureSuite = {
            hashFn: crypto_1.sha256,
            normalizeFn: async (doc) => {
                return await linkedData_1.normalizeJsonLd(doc, contexts_1.defaultContext);
            },
            encodeSignature: (signature) => {
                return (this.encodedJWTHeader +
                    '..' +
                    rfc4648_1.base64url.stringify(signature, { pad: false }));
            },
            decodeSignature: (jws) => {
                const [_, signature] = jws.split('..');
                return Buffer.from(rfc4648_1.base64url.parse(signature, {
                    loose: true,
                }));
            },
        };
    }
    get proofPurpose() {
        return this._proofPurpose;
    }
    set proofPurpose(proofPurpose) {
        this._proofPurpose = proofPurpose;
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
    get jws() {
        return this._proofValue;
    }
    set jws(signature) {
        this._proofValue = signature;
    }
    get verificationMethod() {
        return this._verificationMethod;
    }
    set verificationMethod(verificationMethod) {
        this._verificationMethod = verificationMethod;
    }
    static create(arg) {
        const cp = new Ed25519Signature2018_1();
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
        const documentDigest = await this.createVerifyHash(inputs.document);
        const toSign = Buffer.concat([
            Buffer.from(this.encodedJWTHeader + '.', 'utf8'),
            documentDigest,
        ]);
        this.jws = this.signatureSuite.encodeSignature(await signer.sign(toSign, pass));
        return this;
    }
    async verify(inputs, signer) {
        const digest = await this.createVerifyHash(inputs.document);
        const [header, _] = this.jws.split('..');
        if (header !== this.encodedJWTHeader) {
            throw new Error('Invalid JWS header, expected ' +
                rfc4648_1.base64url.parse(this.encodedJWTHeader).toString());
        }
        const toVerify = Buffer.concat([
            Buffer.from(this.encodedJWTHeader + '.', 'utf8'),
            digest,
        ]);
        return validation_1.verifySignatureWithIdentity(toVerify, this.signatureSuite.decodeSignature(this.jws), this.verificationMethod, signer);
    }
    async createVerifyHash(document) {
        const normalizedDoc = await this.signatureSuite.normalizeFn(document);
        const _a = this.toJSON(), { jws } = _a, proofOptions = __rest(_a, ["jws"]);
        const normalizedProofOptions = await this.signatureSuite.normalizeFn(proofOptions);
        return Buffer.concat([
            this.signatureSuite.hashFn(Buffer.from(normalizedProofOptions)),
            this.signatureSuite.hashFn(Buffer.from(normalizedDoc)),
        ]);
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(Ed25519Signature2018_1, json);
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
};
__decorate([
    class_transformer_1.Expose()
], Ed25519Signature2018.prototype, "proofPurpose", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform(({ value }) => value && new Date(value), { toClassOnly: true }),
    class_transformer_1.Transform(({ value }) => util_1.dateToIsoString(value), {
        toPlainOnly: true,
    })
], Ed25519Signature2018.prototype, "created", null);
__decorate([
    class_transformer_1.Expose()
], Ed25519Signature2018.prototype, "type", null);
__decorate([
    class_transformer_1.Expose()
], Ed25519Signature2018.prototype, "jws", null);
__decorate([
    class_transformer_1.Expose()
], Ed25519Signature2018.prototype, "verificationMethod", null);
Ed25519Signature2018 = Ed25519Signature2018_1 = __decorate([
    class_transformer_1.Exclude()
], Ed25519Signature2018);
exports.Ed25519Signature2018 = Ed25519Signature2018;
//# sourceMappingURL=ed25519Signature2018.js.map