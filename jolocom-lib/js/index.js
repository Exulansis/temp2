"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const parse_1 = require("./parse/parse");
const parseAndValidate_1 = require("./parse/parseAndValidate");
const credentialRequest_1 = require("./interactionTokens/credentialRequest");
const helper_1 = require("./utils/helper");
const validation_1 = require("./utils/validation");
const didMethods_1 = require("./didMethods");
const vaulted_key_provider_1 = require("@jolocom/vaulted-key-provider");
const credentialVerifier_1 = require("./credentials/v1.1/credentialVerifier");
exports.CredentialVerifier = credentialVerifier_1.CredentialVerifier;
const credentialSigner_1 = require("./credentials/v1.1/credentialSigner");
exports.CredentialSigner = credentialSigner_1.CredentialSigner;
const credential_1 = require("./credentials/v1.1/credential");
const signedCredential_1 = require("./credentials/v1.1/signedCredential");
const linkedDataSignature_1 = require("./linkedDataSignature");
const identityWallet_1 = require("./identityWallet/identityWallet");
exports.IdentityWallet = identityWallet_1.IdentityWallet;
exports.JolocomLib = {
    credentials: {
        Credential: credential_1.Credential,
        SignedCredential: signedCredential_1.SignedCredential,
    },
    parse: parse_1.parse,
    parseAndValidate: parseAndValidate_1.parseAndValidate,
    didMethods: didMethods_1.didMethods,
    KeyProvider: vaulted_key_provider_1.SoftwareKeyProvider,
    util: {
        constraintFunctions: credentialRequest_1.constraintFunctions,
        fuelKeyWithEther: helper_1.fuelKeyWithEther,
        validateDigestable: validation_1.validateDigestable,
        validateDigestables: validation_1.validateDigestables,
    },
    KeyTypes: vaulted_key_provider_1.KeyTypes,
    LinkedDataProofTypes: linkedDataSignature_1.SupportedSuites,
};
var vaulted_key_provider_2 = require("@jolocom/vaulted-key-provider");
exports.SoftwareKeyProvider = vaulted_key_provider_2.SoftwareKeyProvider;
var protocol_ts_1 = require("@jolocom/protocol-ts");
exports.claimsMetadata = protocol_ts_1.claimsMetadata;
//# sourceMappingURL=index.js.map