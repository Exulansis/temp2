/// <reference types="node" />
import 'reflect-metadata';
import { ILinkedDataSignatureAttrs, ProofDerivationOptions } from '../types';
import { sha256 } from '../../utils/crypto';
import { IdentityWallet } from '../../identityWallet/identityWallet';
import { JsonLdObject } from '@jolocom/protocol-ts';
import { Identity } from '../../identity/identity';
import { LinkedDataProof, SupportedSuites, BaseProofOptions } from '..';
export declare class EcdsaLinkedDataSignature<T extends BaseProofOptions> extends LinkedDataProof<T> {
    proofType: SupportedSuites;
    proofPurpose: string;
    signatureSuite: {
        hashFn: typeof sha256;
        normalizeFn: (doc: JsonLdObject) => Promise<any>;
        encodeSignature: (data: Buffer) => string;
        decodeSignature: (data: string) => Buffer;
    };
    created: Date;
    proofPurose: string;
    readonly type: SupportedSuites;
    signatureValue: string;
    verificationMethod: string;
    creator: string;
    readonly signer: {
        did: string;
        keyId: string;
    };
    signature: string;
    readonly nonce: string;
    static create(arg: BaseProofOptions): LinkedDataProof<BaseProofOptions>;
    derive(inputs: ProofDerivationOptions, proofSpecificOptions: {}, signer: IdentityWallet, pass: string): Promise<this>;
    verify(inputs: ProofDerivationOptions, signer: Identity): Promise<boolean>;
    private createVerifyHash;
    private normalize;
    asBytes(): Promise<Buffer>;
    digest(): Promise<Buffer>;
    static fromJSON(json: ILinkedDataSignatureAttrs): EcdsaLinkedDataSignature<BaseProofOptions>;
    toJSON(): ILinkedDataSignatureAttrs;
}
