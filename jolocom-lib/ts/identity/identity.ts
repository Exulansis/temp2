import { IDidDocumentAttrs } from '@jolocom/protocol-ts'
import { classToPlain, plainToClass, Type, Exclude, Expose } from 'class-transformer'
import { DidDocument } from './didDocument/didDocument'
import { SignedCredential } from '../credentials/outdated/signedCredential'
import { IIdentityCreateArgs } from './types'
import { ISignedCredentialAttrs } from '../credentials/types'

/**
 * @class
 * Class representing an identity, combines a {@link DidDocument} and a public profile {@link SignedCredential}
 */

interface IdentityAttributes {
  didDocument: IDidDocumentAttrs
  publicProfile?: ISignedCredentialAttrs
}

@Exclude()
export class Identity {
  private _didDocument: DidDocument
  private _publicProfileCredential?: SignedCredential

  /**
   * Get the identity did
   * @example `console.log(identity.did) // 'did:jolo:...'`
   */

  get did() {
    return this.didDocument.did
  }

  /**
   * Set the identity did
   * @example `identity.did = 'did:jolo:...'`
   */

  set did(did: string) {
    this.didDocument.did = did
  }

  /**
   * Get the did document associated with the identity
   * @example `console.log(identity.didDocument) // DidDocument {...}`
   */
  @Expose()
  @Type(() => DidDocument)
  get didDocument(): DidDocument {
    return this._didDocument
  }

  /**
   * Set did document associated with the identity
   * @example `identity.didDocument = DidDocument.fromPublicKey(...)`
   */

  set didDocument(didDocument: DidDocument) {
    this._didDocument = didDocument
  }

  /**
   * Get the identity service endpoint sections
   * @example `console.log(identity.serviceEndpointSections) // [ServiceEndpointSection {...}, ...]`
   */

  get serviceEndpointSections() {
    return this.didDocument.service
  }

  /**
   * Get the identity public key sections
   * @example `console.log(identity.publicKeySection) // [PublicKeySection {...}, ...]`
   */

  get publicKeySection() {
    return this.didDocument.publicKey
  }

  /**
   * Get the public profile signed credential associated with the identity
   * @example `console.log(identity.publicProfile) // SignedCredential {...}`
   */

  @Expose()
  @Type(() => SignedCredential)
  get publicProfile() {
    return this._publicProfileCredential
  }

  /**
   * Get the public profile signed credential associated with the identity
   * @example `identity.publicProfile = publicProfileSignedCredential`
   */

  set publicProfile(publicProfile: SignedCredential | undefined) {
    this._publicProfileCredential = publicProfile
  }

  /**
   * Instantiates the {@link Identity} class based on a did document and public profile
   * @param didDocument - The did document associated with a did
   * @param publicProfile - Verifiable credential containing public claims (e.g. name, website)
   * @example `const identity = Identity.fromDidDocument({didDocument, publicProfile})`
   */

  public static fromDidDocument({
    didDocument,
    publicProfile,
  }: IIdentityCreateArgs): Identity {
    const identity = new Identity()
    identity.didDocument = didDocument
    if (publicProfile) {
      identity.publicProfile = publicProfile
    }

    return identity
  }

  /**
   * Serializes the {@link Identity}
   */

  public toJSON(): IdentityAttributes {
    return classToPlain(this) as IdentityAttributes
  }

  /**
   * Instantiates an {@link Identity} from it's JSON form
   * @param json - JSON containing {link @Identity} members
   */
  public static fromJSON(json: IdentityAttributes): Identity {
    return plainToClass(Identity, json)
  }
}
