"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SignedCredential_1;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const linkedDataSignature_1 = require("../../linkedDataSignature");
const credential_1 = require("./credential");
const errors_1 = require("../../errors");
const mapping_1 = require("../../linkedDataSignature/mapping");
const chainedProof2021_1 = require("../../linkedDataSignature/suites/chainedProof2021");
const util_1 = require("./util");
const DEFAULT_EXPIRY_MS = 365 * 24 * 3600 * 1000;
let SignedCredential = SignedCredential_1 = class SignedCredential {
    constructor() {
        this.credential = new credential_1.Credential();
        this._proof = [];
    }
    get credentialSubject() {
        return this.credential.credentialSubject;
    }
    set credentialSubject(claim) {
        this.credential.credentialSubject = claim;
    }
    get context() {
        return this.credential['_@context'];
    }
    set context(context) {
        this.credential['_@context'] = context;
    }
    get id() {
        return this.credential.id;
    }
    set id(id) {
        this.credential.id = id;
    }
    get issuer() {
        return this._issuer;
    }
    set issuer(issuer) {
        this._issuer = issuer;
    }
    get issued() {
        return this._issued;
    }
    set issued(issued) {
        this._issued = issued;
    }
    get expires() {
        return this._expires;
    }
    get type() {
        return this.credential.type;
    }
    set type(type) {
        this.credential.type = type;
    }
    get credentialSchema() {
        return this._credentialSchema;
    }
    set credentialSchema(schema) {
        this._credentialSchema = schema;
    }
    set expires(expiry) {
        this._expires = expiry;
    }
    get proof() {
        return this._proof;
    }
    set proof(proof) {
        this._proof = proof;
    }
    addProof(proof) {
        this._proof.push(proof);
    }
    get subject() {
        return this.credentialSubject.id;
    }
    set subject(subject) {
        this.credentialSubject.id = subject;
    }
    static async create(credentialOptions, issInfo, expires) {
        const credential = credential_1.Credential.build(credentialOptions);
        const { context, id, type, credentialSubject } = credential;
        const signedCred = new SignedCredential_1();
        signedCred.context = context;
        signedCred.id = id;
        signedCred.type = type;
        signedCred.credentialSubject = credentialSubject;
        signedCred.issued = new Date();
        signedCred.expires = expires || new Date(Date.now() + DEFAULT_EXPIRY_MS);
        signedCred.issuer = issInfo.issuerDid;
        if (signedCred.expires <= signedCred.issued) {
            throw new Error(errors_1.ErrorCodes.VCInvalidExpiryDate);
        }
        return signedCred;
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(SignedCredential_1, json);
    }
    toJSON() {
        return class_transformer_1.classToPlain(this, { exposeUnsetFields: false });
    }
};
__decorate([
    class_transformer_1.Expose()
], SignedCredential.prototype, "credentialSubject", null);
__decorate([
    class_transformer_1.Expose({ name: '@context' })
], SignedCredential.prototype, "context", null);
__decorate([
    class_transformer_1.Expose()
], SignedCredential.prototype, "id", null);
__decorate([
    class_transformer_1.Expose()
], SignedCredential.prototype, "issuer", null);
__decorate([
    class_transformer_1.Expose({ name: 'issuanceDate' }),
    class_transformer_1.Transform(({ value }) => util_1.dateToIsoString(value), {
        toPlainOnly: true,
    }),
    class_transformer_1.Transform(({ value }) => value && new Date(value), { toClassOnly: true })
], SignedCredential.prototype, "issued", null);
__decorate([
    class_transformer_1.Expose({ name: 'expirationDate' }),
    class_transformer_1.Transform(({ value }) => util_1.dateToIsoString(value), {
        toPlainOnly: true,
    }),
    class_transformer_1.Transform(({ value }) => value && new Date(value), { toClassOnly: true })
], SignedCredential.prototype, "expires", null);
__decorate([
    class_transformer_1.Expose()
], SignedCredential.prototype, "type", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform(({ value }) => (value && Array.isArray(value) ? value : [value]), {
        toClassOnly: true,
    }),
    class_transformer_1.Transform(({ value }) => value && (value.length === 1 ? value[0] : value), {
        toPlainOnly: true,
    })
], SignedCredential.prototype, "credentialSchema", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform(({ value }) => value.filter((v) => !!v).map((v) => v.toJSON()), {
        toPlainOnly: true,
    }),
    class_transformer_1.Transform(({ value }) => {
        const proofs = Array.isArray(value) ? value : [value];
        return proofs.map((v) => {
            const dto = mapping_1.SuiteImplementation[v.type];
            if (v.type === linkedDataSignature_1.SupportedSuites.ChainedProof2021) {
                return chainedProof2021_1.ChainedProof2021.fromJSON(v);
            }
            return dto ? dto.impl.fromJSON(v) : undefined;
        });
    }, { toClassOnly: true })
], SignedCredential.prototype, "proof", null);
SignedCredential = SignedCredential_1 = __decorate([
    class_transformer_1.Exclude()
], SignedCredential);
exports.SignedCredential = SignedCredential;
//# sourceMappingURL=signedCredential.js.map