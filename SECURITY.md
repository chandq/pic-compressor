# Security Policy

## Supported Versions

Security fixes are provided for the latest published version of `pic-compressor`. Older releases do not receive
backports; users should upgrade before reporting or validating an issue.

| Version                     | Supported   |
| --------------------------- | ----------- |
| Latest release              | Yes         |
| Older releases              | No          |
| Unreleased development code | Best effort |

## Reporting a Vulnerability

Do not open a public issue for a suspected vulnerability.

Use GitHub's private vulnerability reporting flow:

1. Open <https://github.com/chandq/pic-compressor/security/advisories/new>.
2. Describe the affected package version and browser or WebView environment.
3. Include a minimal reproduction that does not contain private user images or other sensitive data.
4. Explain the expected impact, required user interaction, and any known mitigations.
5. If available, include a suggested fix or regression test.

If private vulnerability reporting is unavailable, contact the maintainer through their GitHub profile at
<https://github.com/chandq> and request a private channel. Do not disclose exploit details publicly while a report is
being evaluated.

Reports will be acknowledged and triaged as soon as practical. The maintainer may request additional information,
coordinate a fix and release, and credit the reporter unless anonymity is requested. Please allow a reasonable period
for remediation before public disclosure.

## Security Scope

This policy covers:

- The source code in this repository
- The `pic-compressor` package published by the project to npm
- The ESM, CommonJS, UMD, and TypeScript declaration artifacts produced by the official release workflow

Issues in browsers, WebViews, package managers, build tools, CDNs, or other third-party software should be reported to
their respective maintainers. A third-party issue may still be reported here when the library exposes or amplifies it
in a way that can be mitigated by this project.

## Security and Privacy Notes for Users

`pic-compressor` performs image decoding and Canvas encoding in the caller's browser or WebView. The library does not
upload images or make network requests by itself. Applications remain responsible for how input and output files are
stored, logged, transmitted, and authorized.

Treat image input as untrusted:

- Enforce application-level limits on source file size, dimensions, count, and accepted MIME types before compression.
- Use conservative `maxPixels`, `maxCanvasDimension`, and `concurrency` values on memory-constrained devices.
- Prefer `outputMode: 'compact'` when Data URLs and byte arrays are not required; legacy output retains additional
  in-memory copies of image data.
- Use `AbortSignal` to cancel work when users navigate away or resource limits are reached.
- Set `strictMime: true` when the output format is security- or protocol-sensitive. Canvas implementations may
  otherwise fall back to another supported format.
- Validate the returned `file.type` and file extension before upload. Client-provided MIME types and names are not a
  substitute for server-side validation.

Compressed output may not preserve metadata, color profiles, animation, or every format-specific property. Do not use
the library as a sanitizer for hostile files or as the sole validation layer for an upload pipeline. Servers should
decode, inspect, and validate uploaded content independently.

## Dependency and Release Integrity

The runtime package is intended to have zero runtime dependencies. Development and build dependencies still affect
the release supply chain. Maintainers should review lockfile changes, run the verification and package checks, and use
npm provenance for official releases. Consumers that require stronger guarantees should pin versions and verify npm
provenance and integrity metadata.
