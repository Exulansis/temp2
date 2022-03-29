"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_hash_1 = __importDefault(require("create-hash"));
const vaulted_key_provider_1 = require("@jolocom/vaulted-key-provider");
const native_core_1 = require("@jolocom/native-core");
function sha256(data) {
    return create_hash_1.default('sha256')
        .update(data)
        .digest();
}
exports.sha256 = sha256;
async function getRandomBytes(nr) {
    return vaulted_key_provider_1.getCryptoProvider(native_core_1.cryptoUtils).getRandom(nr);
}
exports.getRandomBytes = getRandomBytes;
var bip39_1 = require("bip39");
exports.mnemonicToEntropy = bip39_1.mnemonicToEntropy;
exports.entropyToMnemonic = bip39_1.entropyToMnemonic;
//# sourceMappingURL=crypto.js.map