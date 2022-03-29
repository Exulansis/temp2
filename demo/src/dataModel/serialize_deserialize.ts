import assert from 'assert'
import deepEqual from 'deep-equal'
import {
  example1,
  example2,
  example3,
} from '../example_data/signedCredential.data'

import { SignedCredential } from 'jolocom-lib/js/credentials/v1.1/signedCredential'
export const roundTripTest1 = () => {
  console.log('Testing: https://github.com/w3c/vc-test-suite/blob/gh-pages/test/vc-data-model-1.0/input/example-009.jsonld')
  const serialized = SignedCredential.fromJSON(example1).toJSON()
  //@ts-ignore deleting required option
  delete serialized['proof']
  const { proof, ...reference } = example1
  assert(deepEqual(serialized, reference))
}

export const roundTripTest2 = () => {
  console.log('Testing: https://github.com/w3c/vc-test-suite/blob/gh-pages/test/vc-data-model-1.0/input/example-010.jsonld')
  const serialized = SignedCredential.fromJSON(example2).toJSON()
  //@ts-ignore deleting required option
  delete serialized['proof']
  const { proof, ...reference } = example2
  assert(deepEqual(serialized, reference))
}

export const roundTripTest3 = () => {
  console.log('Testing: https://github.com/w3c/vc-test-suite/blob/gh-pages/test/vc-data-model-1.0/input/example-011.jsonld')
  const serialized = SignedCredential.fromJSON(example3).toJSON()
  //@ts-ignore deleting required option
  delete serialized['proof']
  const { proof, ...reference } = example3
  assert(deepEqual(serialized, reference))
}
