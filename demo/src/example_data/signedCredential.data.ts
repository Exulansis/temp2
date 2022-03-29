// Example data structures extracted from here - https://github.com/w3c/vc-test-suite/tree/gh-pages/test/vc-data-model-1.0/input
// Examples 009, 010, 011

export const example1 = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.edu/credentials/3732",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "https://example.edu/issuers/14",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "expirationDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science in Mechanical Engineering"
    }
  },
  "credentialSchema": {
    "id": "https://example.org/examples/degree.json",
    "type": "JsonSchemaValidator2018"
  },
  "proof": []
}

export const example2 = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.edu/credentials/3732",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "https://example.edu/issuers/14",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science in Mechanical Engineering"
    }
  },
  "credentialSchema": [
    {
      "id": "https://example.org/examples/degree.json",
      "type": "JsonSchemaValidator2018"
    },
    {
      "id": "https://example.org/examples/degree.zkp",
      "type": "ZkpExampleSchema2018"
    }
  ],
  "proof": {
    "type": "RsaSignature2018"
  }
}

export const example3 = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.edu/credentials/58473",
  "type": ["VerifiableCredential", "AlumniCredential"],
  "issuer": "https://example.edu/issuers/14",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": [
    {
      "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
      "alumniOf": "Example University"
    },
    {
      "id": "did:example:abcd123",
      "alumniOf": "Second Example University"
    }
  ],
  "proof": {
    "type": "RsaSignature2018"
  }
}