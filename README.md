# Versa Protocol Schema

**Warning: While the Versa schema is considered stable, certain down-stream artifacts such as the Rust crate may not be.**

There are broadly two kinds of types that may be represented in this repository: Protocol Bindings and Receipt and Purchase Details. Currently only the Receipt schema is supported.

This repository contains the root JSON schema files, which are in turn referenced by the versa-rust repo and the versaprotocol/js monorepo.

Versa uses [semantic versioning](https://semver.org/) to ensure the stability of its data model. The current schema version is **2.0.0**

Previous schema versions are maintained in this repo under the git tag matching their version.

# Philosophy & Design Decisions

We have made a number of schema design decisions to try and optimize the user experience of our clients and developers in the Versa network.

A non-comprehensive list is below:

- All nullable fields should be optional and all optional fields should be nullable. While undefined and null are distinct in JavaScript, they should be equivalent for the purpose of compatible schema construction, serialization, and deserialization.
