# Contributing to pic-compressor

Thank you for taking the time to contribute.

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). All project interactions should be respectful,
constructive, and focused on improving the library for its users.

## Quick Links

- [README.md](README.md) - usage, compatibility, and build overview
- [API reference](docs/api.md) - public options, return values, and exported types
- [Security policy](SECURITY.md) - private vulnerability reporting and security guidance
- [Agent guide](AGENTS.md) - repository instructions for maintainers and coding agents
- [Changelog](CHANGELOG.md) - published release history

## Project Overview

`pic-compressor` is a zero-runtime-dependency TypeScript library for browser image compression. It accepts `File`,
`Blob`, and `FileList` input and supports presets, target-size iteration, long-image handling, batch concurrency,
progress reporting, and cancellation.

The package publishes ESM, CommonJS, UMD, and TypeScript declaration artifacts. Browser behavior is the public runtime
contract; Node.js is used only for development, testing, and packaging.

## Before Opening an Issue

- Search existing issues and pull requests for the same behavior.
- Confirm the problem with the latest published version or the current default branch.
- For browser-specific issues, include the browser or WebView name and version, operating system, input format, source
  dimensions, relevant options, and the actual output MIME type.
- Do not attach private or sensitive images. Prefer a generated or safely redacted reproduction file.
- Report vulnerabilities privately according to [SECURITY.md](SECURITY.md), not in a public issue.

Feature requests should describe the use case and expected behavior. A proposed API is welcome, but it should not
assume that a new dependency or breaking change is required.

## Development Setup

Requirements:

- Node.js `>=16`; use an active LTS release when possible
- npm, using the committed `package-lock.json`
- A browser-like environment for manual validation when changing decoding, Canvas, or MIME behavior

```bash
git clone https://github.com/chandq/pic-compressor.git
cd pic-compressor
npm ci
npm run verify
```

Use `npm ci` for reproducible installs. Do not mix package managers in the same contribution or rewrite unrelated
lockfiles.

## Useful Commands

| Command                 | Purpose                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `npm run dev`           | Watch the library build during development                    |
| `npm run lint`          | Run Oxlint across the repository                              |
| `npm run format`        | Format supported files with Oxfmt                             |
| `npm run format:check`  | Check formatting without modifying files                      |
| `npm run typecheck`     | Run TypeScript validation without emitting files              |
| `npm test`              | Run the Vitest suite once                                     |
| `npm run test:watch`    | Run Vitest in watch mode                                      |
| `npm run test:coverage` | Run tests with V8 coverage thresholds                         |
| `npm run build`         | Build ESM, CommonJS, declarations, and the UMD bundle         |
| `npm run publint`       | Validate the published package structure                      |
| `npm run verify`        | Run lint, format, types, tests, build, and package validation |

## Recommended Workflow

1. Create a focused branch from the default branch.
2. Read the relevant implementation, neighboring tests, and public documentation.
3. Make the smallest coherent change that solves the problem.
4. Add or update tests for success, failure, fallback, cancellation, and resource-limit behavior as applicable.
5. Update the README, API reference, changelog notes, or examples when the public contract changes.
6. Run the narrowest relevant checks, followed by `npm run verify`.
7. Review the final diff for generated files, unrelated formatting, secrets, or private test data.

## Repository Layout

| Path                 | Purpose                                                          |
| -------------------- | ---------------------------------------------------------------- |
| `src/index.ts`       | Public types, presets, compression pipeline, and package exports |
| `test/*.test.ts`     | Vitest/jsdom unit and compatibility tests                        |
| `docs/api.md`        | Public API reference                                             |
| `tsdown.config.ts`   | ESM, CommonJS, UMD, declaration, minification, and source maps   |
| `vitest.config.ts`   | Test environment and coverage thresholds                         |
| `.github/workflows/` | CI and maintainer-owned release automation                       |
| `dist/`, `coverage/` | Generated outputs; do not edit or commit them                    |

## Contribution Guidelines

### Public API and Compatibility

- Preserve existing exports, option defaults, result fields, preset behavior, and error semantics unless a breaking
  change is explicitly approved and documented.
- Keep the package usable in browsers and WebViews. Do not introduce Node.js runtime APIs into `src/`.
- Maintain zero runtime dependencies unless there is a compelling, reviewed reason to change that contract.
- Feature-detect optional browser APIs and provide conservative fallbacks where practical.
- Treat Canvas MIME fallback as observable behavior: use the MIME type returned by Canvas, not only the requested type.
- Protect memory-constrained environments by retaining pixel, dimension, iteration, and batch-concurrency limits.
- Avoid retaining Data URLs, buffers, decoded bitmaps, object URLs, or Canvas backing stores longer than necessary.

### Code Style

- Use TypeScript and ES modules.
- Follow the existing Oxfmt and Oxlint configuration: single quotes, semicolons, and no unrelated reformatting.
- Keep exported types explicit and stable. Validate untrusted option values at the public boundary.
- Prefer small helpers and descriptive errors over implicit coercion.
- Write comments for non-obvious compatibility, memory, or security decisions rather than restating the code.

### Tests

Tests use Vitest with jsdom. Mock browser APIs at the narrowest boundary and restore global state after every test.

Changes to compression behavior should consider coverage for:

- `File`, `Blob`, and `FileList` input
- Small-file bypass and keep-original behavior
- Landscape, portrait, square, long-image, and pixel-budget sizing
- JPEG, PNG, WebP, AVIF, and Canvas MIME fallback
- `createImageBitmap` and `HTMLImageElement` decoding paths
- `canvas.toBlob` and Data URL encoding paths
- Target-size quality search and dimension reduction
- Progress callbacks, abort signals, batch order, and concurrency
- Invalid input, unsupported browser features, decoding errors, and encoding errors

Coverage thresholds are defined in `vitest.config.ts`. New code should not merely satisfy the global percentage; tests
should assert the behavior and regression being protected.

## Commit and Pull Request Guidelines

Use Conventional Commits for commits and pull request titles:

```text
<type>(<scope>): <summary>
```

Common types are `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, and `chore`.

Examples:

```text
fix(encoding): preserve canvas fallback mime
test(batch): cover aggregated progress callbacks
docs(security): document untrusted image limits
```

A pull request should:

- Explain the problem, solution, and user-visible effects
- Link related issues when applicable
- Describe the browsers or WebViews tested for runtime-sensitive changes
- List the verification commands that were run
- Include tests and documentation appropriate to the change
- Avoid generated output and unrelated cleanup

Keep pull requests reviewable. Separate broad refactors from behavior changes when practical.

## Releases

Publishing, versioning, tags, and GitHub Releases are maintainer and CI responsibilities. Contributors must not run
`npm publish`, create release tags, hand-edit package versions, or commit generated `dist/` artifacts as part of a
normal pull request.

Lockfile changes should be intentional and limited to dependency changes. Changes to exports, build configuration,
documentation packaging, or release files require careful review by a maintainer.

## License

By contributing, you agree that your contributions are licensed under the project's [MIT License](LICENSE).
