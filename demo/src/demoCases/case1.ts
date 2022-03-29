import {
  CredentialSigner,
  CredentialVerifier,
  IdentityWallet,
  JolocomLib,
} from 'jolocom-lib'
import { claimsMetadata } from '@jolocom/protocol-ts'
import assert from 'assert'

// Case 1. A new VC is created from scratch, using this library. Two signatures are added. Both signatures are verifiable.
export const case1 = async (
  signer: IdentityWallet,
  pass: string,
  verifier: CredentialVerifier,
  renderReports = false
) => {
  console.group()
  // Create a new instance of a verifiable credential (alternatively Credential.fromJSON can be used as well)
  const credential = JolocomLib.credentials.Credential.build({
    metadata: claimsMetadata.emailAddress,
    claim: {
      email: 'example@mail.com',
    },
    subject: 'did:example:subject',
  })

  // Instantiate a signer / proof builder based on the credential, configure relevant metadata
  const credentialSigner = CredentialSigner.fromCredential(credential)
    .setIssuer(signer.did)
    .generateAndSetDates()

  // Generate and add a Ed25519Signature2018 proof node to the Verifiable Credential
  const p1 = await credentialSigner.generateProof(
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

  // Generate and add a ChainedProof2021 proof node to the Verifiable Credential
  await credentialSigner.generateProof(
    JolocomLib.LinkedDataProofTypes.ChainedProof2021,
    {
      proofOptions: {
        verificationMethod: signer.publicKeyMetadata.signingKeyId,
      },
      proofSpecificOptions: {
        chainSignatureSuite:
          JolocomLib.LinkedDataProofTypes.Ed25519Signature2018,
        // References the previously created Ed25519Signature proof node
        previousProof: {
          verificationMethod: p1.verificationMethod,
          created: p1.created,
          proofPurpose: p1.proofPurpose,
          type: p1.proofType,
        },
      },
    },
    signer,
    pass
  )

  await credentialSigner.generateProof(
    JolocomLib.LinkedDataProofTypes.ChainedProof2021,
    {
      proofOptions: {
        verificationMethod: signer.publicKeyMetadata.signingKeyId,
      },
      proofSpecificOptions: {
        chainSignatureSuite:
          JolocomLib.LinkedDataProofTypes.EcdsaKoblitzSignature2016,
        // References the previously created Ed25519Signature proof node
        previousProof: {
          verificationMethod: p1.verificationMethod,
          created: p1.created,
          proofPurpose: p1.proofPurpose,
          type: p1.proofType,
        },
      },
    },
    signer,
    pass
  )

  // Render the assembled VC, should contain the original VC body, and the two newly created proofs.
  const finalCredential = credentialSigner.toSignedCredential()
  const {proof, ...rest} = finalCredential.toJSON()

  console.log('New Verifiable Credential created, contents are:')
  console.group()
  console.log(rest)
  console.groupEnd()
  console.log('Proofs associated with the credential:')
  console.group()
  console.log(proof)
  console.groupEnd()

  // Verify all proofs on the VC, the returned report should mark all proofs as valid
  assert(
    await verifier.verifyProofs(finalCredential),
    'All proofs should verify correctly'
  )

  if (renderReports) {
    console.log('Verification results, if the signed contents are not modified:')
    console.group()
    const verificationResults = await verifier.generateVerificationReport(
      finalCredential
    )
    Object.values(verificationResults).forEach((v, i) => {
      console.log(`Signature at index ${i}`)
      console.log(v)
    })
    console.groupEnd()
  }

  console.log()
  console.log('Modifying the VC issuer')
  console.log()
  // Alter the contents of the credential
  finalCredential.issuer = 'modifiedIssuer'

  // Verify all proofs on the modified credential, should mark certain proofs as invalid.
  const alteredVerificationResults = await verifier.generateVerificationReport(
    finalCredential
  )

  if (renderReports) {
    console.log('Verification results for each proof after the signed contents are modified:')
    console.group()
    Object.values(alteredVerificationResults).forEach((v, i) => {
      console.log(`Signature at index ${i}`)
      console.log(v)
    })
    console.groupEnd()
  }

  assert(
    (await verifier.verifyProofs(finalCredential)) === false,
    'Verification should fail'
  )

  // Content of the document was altered.
  assert(alteredVerificationResults[0].valid === false)

  // Content of P1 or P2 was not altered
  assert(alteredVerificationResults[1].valid)
  assert(
    alteredVerificationResults[1].proofMetadata.referencedProofValid === false
  )
  assert(alteredVerificationResults[2].valid)
  assert(
    alteredVerificationResults[2].proofMetadata.referencedProofValid === false
  )

  console.groupEnd()
}
