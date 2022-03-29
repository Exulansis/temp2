import {
  claimsMetadata,
  CredentialSigner,
  IdentityWallet,
  JolocomLib,
} from 'jolocom-lib'
import deepEqual from 'deep-equal'
import assert from 'assert'

export const dataModelTest = async (signer: IdentityWallet, pass: string) => {
  const credential = JolocomLib.credentials.Credential.build({
    metadata: claimsMetadata.emailAddress,
    claim: {
      email: 'example@mail.com',
    },
    subject: 'did:example:subject',
  })

  const credentialSigner = CredentialSigner.fromCredential(credential)
    .setIssuer(signer.did)
    .generateAndSetDates()

  await credentialSigner.generateProof(
    JolocomLib.LinkedDataProofTypes.Ed25519Signature2018,
    {
      proofOptions: {
        verificationMethod: signer.publicKeyMetadata.signingKeyId,
      },
      proofSpecificOptions: {},
    },
    signer,
    pass
  )

  const cred = credentialSigner.toSignedCredential()

  console.log('Testing the following normative statements:')

  console.group()
  console.log('@context MUST be present, one or more URIs')

  assert(cred.context.length === 2)
  //@ts-ignore
  assert(cred.context[0] === 'https://www.w3.org/2018/credentials/v1')

  console.log('"id" property MUST be present, must be a single URI')
  assert(cred.id.includes('urn:uuid'))
  console.log(
    '"type" property MUST be present, first entry must be "VerifiableCredential"'
  )
  assert(cred.type.length == 2)
  assert(cred.type[0] === 'VerifiableCredential')

  console.log('"credentialSubject" property MUST be present, MAY be an object')
  assert(
    deepEqual(cred.credentialSubject, {
      id: 'did:example:subject',
      email: 'example@mail.com',
    })
  )

  console.log('"issuer" property MUST be present, MUST be a single URI')
  assert(cred.issuer == signer.did)

  console.log(
    '"issuanceDate" property MUST be present, MUST be a single RFC3339 datetime'
  )
  assert(cred.issued.getFullYear() == new Date().getFullYear())

  console.log(
    '"expirationDate" property MUST be present, MUST be a single RFC3339 datetime'
  )
  assert(cred.expires.getFullYear() == new Date().getFullYear() + 1)
  console.groupEnd()
}