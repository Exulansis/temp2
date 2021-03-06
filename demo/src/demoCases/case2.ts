import { CredentialSigner, CredentialVerifier, IdentityWallet, JolocomLib } from 'jolocom-lib'
import assert from 'assert'

// Example data structure from -- https://github.com/w3c/vc-test-suite/blob/gh-pages/test/vc-data-model-1.0/input/example-009.jsonld
const JSON_CREDENTIAL = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://www.w3.org/2018/credentials/examples/v1',
  ],
  id: 'http://example.edu/credentials/3732',
  type: ['VerifiableCredential', 'UniversityDegreeCredential'],
  issuer: 'https://example.edu/issuers/14',
  issuanceDate: '2010-01-01T19:23:24Z',
  credentialSubject: {
    id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
    degree: {
      type: 'BachelorDegree',
      name: 'Bachelor of Science in Mechanical Engineering',
    },
  },
  credentialSchema: {
    id: 'https://example.org/examples/degree.json',
    type: 'JsonSchemaValidator2018',
  },
  proof: [],
}

// Case 2. A VC without proofs is received as JSON. Two proofs are added. All signatures are verifiable.
export const case2 = async (alice: IdentityWallet, bob: IdentityWallet, pass: string, verifier: CredentialVerifier, renderReports = false) => {
  console.group()
  const credentialSigner = CredentialSigner.fromSignedCredential(
    JSON_CREDENTIAL
  )

  // Generate and add a Ed25519Signature2018 node to the document
  const p1 = await credentialSigner.generateProof(
    JolocomLib.LinkedDataProofTypes.Ed25519Signature2018,
    {
      proofOptions: {
        verificationMethod: alice.publicKeyMetadata.signingKeyId,
      },
      proofSpecificOptions: {},
    },
    alice,
    pass
  )

  // Add a ChainedProof2021 proof node to the Verifiable Credential, referencing an existing proof.
  await credentialSigner.generateProof(
    JolocomLib.LinkedDataProofTypes.ChainedProof2021,
    {
      proofOptions: {
        verificationMethod: bob.publicKeyMetadata.signingKeyId,
      },
      proofSpecificOptions: {
        chainSignatureSuite: JolocomLib.LinkedDataProofTypes.Ed25519Signature2018,
        // Reference a proof node which was created at an earlier point and included in the received credential.
        previousProof: {
          verificationMethod: p1.verificationMethod,
          created: p1.created,
          proofPurpose: p1.proofPurpose,
          type: p1.proofType,
        },
      },
    },
    bob,
    pass
  )

  // Render the assembled VC, should contain the original VC body, and the two newly created proofs.
  const finalCredential = credentialSigner.toSignedCredential()
  const {proof, ...rest} = finalCredential.toJSON()
  console.log('Signed Credential with newly added proofs:')
  console.group()
  console.log(rest)
  console.groupEnd()
  console.log('Proofs associated with the credential:')
  console.group()
  console.log(proof)
  console.groupEnd()

  // Verify all proofs on the VC, the returned report should mark all proofs as valid
  const verificationResults = await verifier.generateVerificationReport(finalCredential)

  if (renderReports) {
    console.log('Verification results, if the signed contents are not modified:')
    console.group()
    Object.values(verificationResults).forEach((v, i) => {
      console.log(`Signature at index ${i}`)
      console.log(v)
    })
    console.groupEnd()
  }

  assert(await verifier.verifyProofs(finalCredential), 'All proofs should verify correctly')

  // Assert all proofs are valid
  assert(verificationResults[0].valid)
  assert(verificationResults[1].valid)
  assert(verificationResults[1].proofMetadata.referencedProofValid)
  console.groupEnd()
}