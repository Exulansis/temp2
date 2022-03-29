"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Credential_1;
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const signedCredential_1 = require("./signedCredential");
const util_1 = require("./util");
let Credential = Credential_1 = class Credential {
    constructor() {
        this._id = util_1.generateCredId();
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get credentialSubject() {
        return this._claim;
    }
    set credentialSubject(claim) {
        this._claim = claim;
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }
    get context() {
        return this['_@context'];
    }
    set context(context) {
        this['_@context'] = context;
    }
    static build({ metadata, claim, subject, }) {
        const credential = new Credential_1();
        credential.context = [
            'https://www.w3.org/2018/credentials/v1',
            metadata.context[0],
        ];
        credential.type = ['VerifiableCredential', metadata.type[1]];
        credential.credentialSubject = claim;
        credential.credentialSubject.id = subject;
        return credential;
    }
    toVerifiableCredential() {
        const signedCred = new signedCredential_1.SignedCredential();
        signedCred.id = this.id;
        signedCred.type = this.type;
        signedCred.context = this.context;
        signedCred.credentialSubject = this.credentialSubject;
        signedCred.proof = [];
        return signedCred;
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(Credential_1, json);
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
};
__decorate([
    class_transformer_1.Expose()
], Credential.prototype, "credentialSubject", null);
__decorate([
    class_transformer_1.Expose()
], Credential.prototype, "type", null);
__decorate([
    class_transformer_1.Expose({ name: '@context' })
], Credential.prototype, "context", null);
Credential = Credential_1 = __decorate([
    class_transformer_1.Exclude()
], Credential);
exports.Credential = Credential;
//# sourceMappingURL=credential.js.map