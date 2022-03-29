import { JolocomLib, CredentialVerifier, IdentityWallet } from 'jolocom-lib'
import { randomBytes } from 'crypto'
import { case1 } from './demoCases/case1'
import { case2 } from './demoCases/case2'
import { case3 } from './demoCases/case3'
import { dataModelTest } from './dataModel/data_model'
import {
  roundTripTest1,
  roundTripTest2,
  roundTripTest3,
} from './dataModel/serialize_deserialize'

const runTests = async () => {
  const renderReport = !!process.env.REPORTS
  const PASS = 'pass'
  const localDidMethod = JolocomLib.didMethods.jun

  const { identityWallet: alice } = await localDidMethod.recoverFromSeed(
    Buffer.from(randomBytes(32).toString('hex'), 'hex'),
    PASS
  )

  const { identityWallet: bob } = await localDidMethod.recoverFromSeed(
    Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex'),
    PASS
  )

  const verifier = new CredentialVerifier([alice, bob])

  console.log(
    'Case 1. A new VC is created from scratch, using this library. Two signatures are added. Both signatures are verifiable. Verification should fail in case VC is modified.'
  )
  await case1(alice, PASS, verifier, renderReport)

  console.log(
    'Case 2. A VC without proofs is received as JSON. Two proofs are added. All signatures are verifiable. Verification should fail in case VC is modified.'
  )
  await case2(alice, bob, PASS, verifier, renderReport)

  console.log(
    'Case 3. A VC with existing proofs is received as JSON, new signatures are added. All signatures are verifiable. Verification should fail in case VC is modified.'
  )
  await case3(alice, PASS, verifier, renderReport)

  console.log(
    'Case 4. Data model compliance tests. An example credential is generated using this library. We ensure that when serialized to JSON, the output complies with the data model.'
  )
  await runDataComplianceTests(alice, PASS)

  console.log(
    'Case 5. Data model compliance tests. A set of example VC data structures are parsed from JSON and serialized back. The outputs are compared with the initial test vectors.'
  )
  return runRoundTripTests()
}

const runDataComplianceTests = async (signer: IdentityWallet, pass: string) => {
  return await dataModelTest(signer, pass)
}
const runRoundTripTests = () => {
  console.group()
  roundTripTest1()
  roundTripTest2()
  roundTripTest3()
  console.groupEnd()
}

runTests()
