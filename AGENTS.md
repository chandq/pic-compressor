# AGENTS.md

## Scope and Precedence

This file is the canonical repository instruction guide for maintainers and coding agents. Read it before planning or
editing. A more specific `AGENTS.md` in a descendant directory overrides this file for that subtree.

Preserve user changes already present in the working tree. Do not reset, discard, or broadly reformat unrelated work.

## Project Facts

`pic-compressor` is a zero-runtime-dependency TypeScript library for client-side image compression. It targets modern
browsers and WebViews and publishes ESM, CommonJS, UMD, and TypeScript declaration artifacts.

The public API supports `File`, `Blob`, and `FileList` inputs, presets, target-file-size iteration, long-image sizing,
batch concurrency, progress reporting, cancellation, and browser API fallbacks. Browser behavior is the runtime source
of truth; Node.js is only a development and build environment.

Repository map:

- `src/index.ts`: public types, presets, validation, decoding, sizing, encoding, batching, and exports.
- `test/`: Vitest tests running in jsdom with mocked browser image and Canvas APIs.
- `docs/api.md`: public API reference.
- `tsdown.config.ts`: ESM, CommonJS, UMD, declarations, UMD minification, and source maps.
- `vitest.config.ts`: test environment, coverage collection, and thresholds.
- `.github/workflows/`: CI and release automation.
- `dist/` and `coverage/`: generated output; never hand-edit or commit.

## Development Workflow

Before editing:

1. Inspect `git status` and the relevant diff.
2. Read the affected source, neighboring tests, README/API docs, and configuration.
3. Identify affected contracts: exports, option defaults, MIME behavior, dimensions, memory limits, progress, errors,
   cancellation, or package formats.
4. Decide whether the change needs browser-specific or resource-limit coverage.

After editing:

1. Add focused tests for the changed behavior and important failures or fallbacks.
2. Run the narrowest relevant test or check first.
3. Run formatting, lint, types, tests, and build checks in proportion to the change.
4. Update public documentation when behavior, types, defaults, compatibility, or packaging changes.
5. Inspect the final diff and leave only intentional changes.

Standard commands:

```bash
npm ci
npm run lint
npm run format:check
npm run typecheck
npm test
npm run test:coverage
npm run build
npm run publint
npm run verify
```

`npm run verify` is the primary pre-merge check. It runs lint, format checking, type checking, tests, builds, and
Publint. Run `npm run test:coverage` separately when source or tests change because coverage is not part of `verify`.

## Code Rules

- Keep source in TypeScript using ES modules. Do not add Node.js-only runtime APIs to `src/`.
- Preserve zero runtime dependencies unless a dependency addition is explicitly justified and reviewed.
- Follow `.oxfmtrc.json` and `.oxlintrc.json`: single quotes, semicolons, a 120-column print width, and no unrelated
  formatting changes.
- Keep public exports and types explicit. Avoid exposing internal implementation types accidentally.
- Validate external input and option values at the public boundary. Use descriptive, stable errors.
- Feature-detect browser APIs such as Canvas, `createImageBitmap`, object URLs, and `toBlob`; keep fallbacks testable.
- Use the actual MIME type returned by Canvas. Do not assume the requested format was honored.
- Preserve aspect ratio and enforce pixel and Canvas-dimension limits before allocating large buffers.
- Release `ImageBitmap`, object URL, Canvas backing-store, Data URL, and byte-array resources as early as practical.
- Keep batch processing bounded by `concurrency` and preserve input order.
- Progress callback failures must not break compression. Abort signals must stop work with an `AbortError`.
- Keep comments concise and reserve them for non-obvious compatibility, memory, security, or algorithmic invariants.

## Public API and Compatibility

Treat these as public contracts:

- Named and default exports
- `ICompressOptions`, `ICompressImgResult`, preset types, and supported MIME types
- Preset values and option precedence
- Default output mode and result fields
- File naming and extension replacement
- Small-file bypass and `keepOriginalIfLarger`
- Actual Canvas MIME fallback and `strictMime`
- Progress range, cancellation behavior, batch ordering, and concurrency
- ESM, CommonJS, UMD global name (`PicCompressor`), and declaration paths

Do not introduce a breaking change silently. If a contract intentionally changes, update tests, README, API docs, and
the changelog or release notes as appropriate.

## Testing Rules

Use Vitest and the patterns in `test/*.test.ts`.

- Prefer behavior-driven tests through exported APIs over exporting internals solely for tests.
- Mock Canvas, `createImageBitmap`, `Image`, `FileReader`, object URLs, and timers at the narrowest useful boundary.
- Restore spies, globals, DOM nodes, and asynchronous resources after each test.
- Use generated byte arrays or synthetic files; never commit private or copyrighted sample images without permission.
- Cover both normal behavior and failures for decoding, context creation, encoding, MIME fallback, and cancellation.
- For target-size logic, test quality search and dimension reduction independently when applicable.
- For batch logic, verify concurrency limits, stable ordering, progress aggregation, and failure propagation.
- Keep coverage above the thresholds in `vitest.config.ts`: branches 70%, functions 80%, lines 80%, statements 80%.
  Prefer meaningful assertions over tests written only to increase percentages.

When adding browser-specific behavior that jsdom cannot represent faithfully, document the manual environment and steps
used for validation in the pull request.

## Security and Resource Safety

Treat filenames, MIME types, Blob contents, dimensions, option objects, callbacks, and browser API results as
untrusted.

- Do not add implicit uploads, telemetry, logging of image data, or network requests.
- Keep allocation guards (`maxPixels`, `maxCanvasDimension`, iteration limits, and concurrency) conservative.
- Avoid multiplying in-memory image copies. Prefer compact output for internal paths unless compatibility requires
  legacy fields.
- Do not claim the compressor sanitizes hostile images; decoding security remains the browser's responsibility.
- Validate returned MIME types and preserve strict-mode rejection behavior.
- Never place real secrets, tokens, personal images, or private URLs in source, tests, fixtures, documentation, or logs.

Consult `SECURITY.md` for vulnerability reporting and user-facing security guidance.

## Documentation Rules

Update `README.md` or `docs/api.md` when changing exports, options, defaults, presets, output fields, supported formats,
compatibility, examples, or resource behavior. Keep code examples executable and aligned with the package exports.

Community-facing changes may also require updates to `CONTRIBUTING.md`, `SECURITY.md`, or `CODE_OF_CONDUCT.md`.

## Git and Release Rules

- Use Conventional Commits: `type(scope): summary`.
- Do not commit `node_modules/`, `dist/`, `coverage/`, tarballs, local environment files, or incidental generated output.
- Do not run release or publish commands during routine work.
- Do not create tags, GitHub Releases, or npm releases unless the user explicitly requests a maintainer release task.
- Do not hand-edit versions solely to prepare an ordinary contribution.
- Treat `.github/workflows/release.yml`, npm provenance, package exports, and lockfile changes as release-sensitive.
- CI/release branch rules may differ while the repository is being initialized; follow the checked-in workflow and the
  maintainer's explicit instructions rather than assuming a branch triggers publishing.

## Definition of Done

- The change is implemented at the correct boundary and preserves browser/runtime constraints.
- Focused success, failure, fallback, cancellation, and resource-limit tests exist where relevant.
- Relevant checks pass, including coverage for source/test changes, or limitations are reported clearly.
- Public and community documentation is current.
- The final diff contains no generated artifacts, secrets, private fixtures, or unrelated changes.
