# Two-book product architecture

## Scope

D1.4 defines how uDream can safely evolve from one active logical dataset to a product that supports two source works, multiple datasets and translation variants.

This milestone is architecture-only. It does not:

- extract a second-book dataset;
- change any existing data record;
- change the current runtime or PWA;
- add a user-facing selector;
- call a translation API;
- perform a physical data migration.

Machine-readable sources:

```text
data/source-works.json
data/two-book-architecture.json
```

Permanent validation:

```text
scripts/validate-two-book-architecture.mjs
```

## Verified current evidence

### Registered datasets belong to one source work

The current dataset registry contains:

```text
source-divinity-code-en
ru-current-v1
```

The D1.3 audit confirms that all 4,086 records in both logical datasets use:

```text
source: DivinityCode
```

Therefore the current data does not represent two extracted books.

### Two retained PDF documents exist

The runtime menu links two retained PDFs:

| Source work ID | Retained document | Evidence status |
|---|---|---|
| `divinity-code` | `_archive/source-files/The_Divinity_Code_to_Understanding_Your_Dreams_and_Visions_PDF_Room.pdf` | document and registered datasets |
| `unlocking-your-dreams-student-material` | `_archive/source-files/Unlocking-Your-Dream-Student-Ma.pdf` | retained-document-only |

The second work is labelled in maintained project documentation as *Unlocking Your Dreams / related student material*. Its exact edition, complete author/publisher metadata, original URL and precise distribution statement are not archived in the maintained evidence.

The presence of its PDF does **not** mean that a second logical dataset exists. Current status:

```text
retained-document-only
not-extracted-not-validated-not-registered
```

## Source-work registry

`data/source-works.json` distinguishes three layers:

1. **Source work** — a book or related source material.
2. **Source document** — a retained PDF file that is evidence for a source work.
3. **Logical dataset** — structured records derived from a source work and registered separately.

This prevents a PDF, a translation and a JSON serialization from being treated as the same thing.

Unknown authors, editions, source URLs and licenses remain explicitly unknown. Third-party content is not declared MIT-licensed.

## Global record identity

A numeric record ID is local to its logical dataset.

Global identity is:

```text
dataset_id:record_id
```

Examples:

```text
ru-current-v1:123
source-divinity-code-en:123
future-second-book-en-v1:123
```

Equal numeric IDs across datasets do not imply equal meaning, origin or relationship.

Every future internal reference, URL, history entry, shared link and relation must include `dataset_id` and `record_id`.

## Recommended product modes

### 1. Single dataset

Current mode.

- One validated dataset is active.
- Default and stable fallback: `ru-current-v1`.
- Existing behavior remains unchanged until a separate functional release.

### 2. Dataset switching

Future mode.

- User chooses one registered and fully validated dataset or translation variant.
- Selection is stored only after successful activation.
- Invalid or unavailable datasets do not replace the active dataset.
- The user is returned to `ru-current-v1` on activation failure.

### 3. Federated combined search

Recommended combined mode.

**Federated combined search** means:

- keep one search index per dataset;
- run the same query against each eligible dataset;
- normalize relevance within each dataset;
- merge result references, not source records;
- keep `dataset_id:record_id` on every result;
- visibly show source work and translation/variant;
- isolate failures so one unavailable dataset does not hide valid results from another.

A destructive merged JSON file is forbidden as the default architecture. Cross-dataset results must not be collapsed merely because symbols or numeric IDs match.

### 4. Side-by-side comparison

Comparison uses an explicit relation map, not guessed ID equality.

Planned path:

```text
data/record-relations.json
```

Planned relation identity:

```text
left.dataset_id + left.record_id
right.dataset_id + right.record_id
```

Allowed relation types:

- `equivalent`;
- `related`;
- `contrast`;
- `redirect`;
- `ambiguous`.

Review statuses:

- `candidate`;
- `reviewed`;
- `rejected`.

Only reviewed relations are visible by default. Automatic numeric-ID linking is forbidden.

## Visible provenance contract

Every future search result, card, comparison panel and shared preview must show enough information to answer: “Which book and dataset did this come from?”

Required fields:

```text
source_work_id
dataset_id
record_id
dataset_label
language_or_variant
source_reference_status
```

When known, also show:

```text
source_document_id
source_page
source_section
translation_variant_id
relation_review_status
```

When an exact page/section is not verified, the UI must say:

```text
Source location not yet verified
```

The interface must not invent page numbers or imply a verified source location that is not stored.

## URL and deep-link contract

Planned query parameters:

| Parameter | Purpose |
|---|---|
| `mode` | `single`, `switch`, `combined` or `compare` |
| `dataset` | primary dataset ID |
| `record` | primary local record ID |
| `compare_dataset` | secondary dataset ID in comparison mode |
| `compare_record` | secondary local record ID |
| `q` | search query when no record is selected |

Example future links:

```text
?mode=single&dataset=ru-current-v1&record=123
?mode=combined&q=water
?mode=compare&dataset=ru-current-v1&record=123&compare_dataset=future-second-book-ru-v1&compare_record=87
```

Invalid deep links must show a safe error and offer the stable fallback. They must not silently open a different record with the same numeric ID.

## History and sharing

A future history entry must include:

```text
mode
dataset_id
record_id
label
visited_at
```

A share payload must include:

```text
mode
dataset_id
record_id
canonical_url
```

History from an unavailable dataset is preserved. It may be displayed as temporarily unavailable, but it must not be remapped silently to another dataset.

## Dataset activation contract

A dataset can become selectable only when all conditions pass:

1. stable logical dataset ID exists;
2. stable physical file ID exists;
3. source work is registered;
4. JSON parses successfully;
5. schema and required fields pass;
6. IDs are valid and unique;
7. declared count and hashes match;
8. deterministic audit has no structural errors;
9. provenance is available for display;
10. stable fallback remains available.

Activation sequence:

1. load registry/version metadata without trusting stale runtime cache;
2. fetch candidate into isolated memory or staging cache;
3. validate the complete candidate;
4. build a dataset-scoped search index;
5. atomically switch in-memory state;
6. persist the selection only after success;
7. preserve the fallback and previous valid selection.

Failure behavior:

- keep the existing active dataset;
- discard invalid staging state;
- return to `ru-current-v1`;
- show a non-destructive error;
- preserve history and preferences;
- record safe diagnostics without secrets or bulk source dumps.

## Cache and offline contract

Future dataset cache keys include:

```text
dataset_id
content_hash
```

Rules:

- cache ownership remains under `udream-`;
- staging and active caches are separate;
- unrelated origin caches are never cleared;
- other valid uDream dataset caches are not removed automatically;
- the stable fallback remains available when offline support is claimed;
- registry/version metadata uses network-first or no-store with a safe offline copy;
- a failed candidate never replaces the active cache.

These rules extend the existing safe Service Worker principle that only uDream-owned caches may be managed.

## Partial failures

Federated search must isolate dataset failures.

When one dataset is unavailable:

- show valid results from available datasets;
- label unavailable datasets explicitly;
- do not convert partial results into a total failure;
- do not hide provenance;
- keep the stable fallback operational.

## Second-book readiness gate

Before a dataset can be registered for `unlocking-your-dreams-student-material`:

1. verify document identity and edition as far as retained evidence permits;
2. archive original source URL and distribution statement when recoverable;
3. define a reproducible extraction schema and tooling;
4. extract into a new non-runtime candidate file;
5. preserve page/section references when available;
6. assign new stable logical and physical IDs;
7. validate schema, IDs, counts, hashes and source links;
8. run deterministic quality audit;
9. perform human/source review;
10. create a separate data release and rollback point.

The second-book dataset must not reuse `source-divinity-code-en` IDs as global identity and must not overwrite `ru-current-v1`.

## Implementation sequence

### D1.4 — architecture and source-work registry

Current milestone.

- source-work/document evidence registry;
- architecture contract;
- no runtime or data-content change.

### D1.5 — second-book provenance and extraction specification

Next milestone.

- inspect the retained PDF and historical evidence;
- define extraction schema, page/section provenance and reproducible tooling;
- do not publish a dataset until the extraction result is validated.

### D1.6 — AI-assisted translation candidate experiment

Later milestone.

- optional DeepSeek-assisted candidate only;
- no overwrite of current data;
- checkpointed generation, hashes, diff, audit and human review.

### D2.1 — multi-dataset loading core

Future functional milestone behind a disabled feature flag.

- registry-aware loader;
- activation validation;
- scoped caches;
- stable fallback;
- no public selector yet.

### D2.2 — user-facing modes

Future functional milestone.

- selector;
- federated search;
- comparison UI;
- dataset-aware history/sharing/deep links;
- separate release and device/PWA verification.

## Rollback

D1.4 rollback is documentation/metadata-only: revert its commit.

Future runtime rollback must:

1. disable the multi-dataset feature flag;
2. restore `ru-current-v1` as the only active dataset;
3. restore the previous Service Worker/cache contract from an immutable release;
4. preserve history entries and mark unavailable targets;
5. retain registered datasets rather than deleting them.

## Approved decision

uDream will not create one destructive “all books” database.

The approved direction is:

- separate registered source datasets;
- a stable current default;
- future safe switching;
- Federated combined search over independent indexes;
- Side-by-side comparison through reviewed relations;
- visible provenance everywhere;
- dataset-aware identity and navigation;
- validation and stable fallback before activation.

## Current hard boundary

```text
runtime changed by D1.4: false
existing data changed by D1.4: false
second-book dataset created by D1.4: false
selector implemented by D1.4: false
DeepSeek used by D1.4: false
```

The next approved step is D1.5. Functional implementation begins only after data readiness and a separately approved phase.
