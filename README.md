# Versa Protocol Schema

**Warning: While the Versa schema is considered stable, certain down-stream artifacts such as the Rust crate may not be.**

There are broadly two kinds of types represented in this repository: Protocol Bindings and Purchase Details

This repository contains the root JSON schema files, which are in turn referenced by the JS monorepo. **Note therefore: NPM packages, including the TypeScript bindings, are maintained here: https://github.com/versa-protocol/js**

## Protocol Bindings
Protocol Bindings represent the types of requests, responses, and error codes to be expected when developing client implementations according to the specifications of the Versa Protocol. These types are defined in the `protocol_bindings` directory.

## Purchase Details
Purchase Details represent the receipt and invoice data schemas to be handled  when developing client implementations according to the specifications of the Versa Protocol. These types are defined in the `purchase_details` directory.

Versa uses [semantic versioning](https://semver.org/) to ensure the stability of its data model. The current schema version **1.5.0**

Previous schema versions will be maintained in this repo under their version tag after the first major version release (1.0.0)

## TODO

- [ ] Rust stable crate
- [ ] Complete protocol bindings
