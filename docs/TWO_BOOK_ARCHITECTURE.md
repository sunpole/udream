# Two-book product architecture

## Scope

This document defines the D1.4 architecture for working with two source books in uDream. It is architecture-only.

It does not:

- create or extract a second dataset;
- change the current 4,086 records;
- change the runtime, PWA, Service Worker or package metadata;
- add a user-facing dataset selector;
- begin AI-assisted translation.

The machine-readable companion is `docs/two-book-architecture.json`.

## Verified current facts

### Registered data

The current registry contains:

```text
source-divinity-code-en
  canonical physical: data/bd2.json
  retained equivalent: data/db.json

ru-current-v1
  active runtime: data/divinity_code_ru.json
```

`ru-current-v1` remains the stable default dataset until a separate functional release explicitly changes the runtime contract.

### Retained source documents

The repository retains two PDF documents:

1. `_archive/source-files/The_Divinity_Code_to_Understanding_Your_Dreams_and_Visions_PDF_Room.pdf`;
2. `_archive/source-files/Unlocking-Your-Dream-Student-Ma.pdf`.

The first work is connected to the registered Divinity Code datasets. The second document is evidence that source material is retained, but there is no verified extracted logical dataset for it.

Presence of a PDF is not evidence that a complete, validated or publishable dataset exists.

### Unknown or incomplete evidence

The repository does not currently prove:

- the exact source edition for either retained PDF;
- the original download URLs;
- archived distribution permission wording;
- a complete extraction pipeline for the second book;
- stable second-book record IDs;
- reviewed cross-book record relationships.

These unknowns must remain visible and must not be replaced by assumptions.

## Stable source-work and document identities

### Source works

```text
work-divinity-code
work-unlocking-your-dreams
```

### Retained documents

```text
document-divinity-code-pdf
document-unlocking-your-dreams-student-material-pdf
```

The document IDs identify retained files. They do not by themselves create logical datasets.

### Dataset identities

Current:

```text
source-divinity-code-en
ru-current-v1
```

Reserved future identity:

```text
future-unlocking-your-dreams-source
```

The reserved ID is an architectural placeholder. It must not be treated as an existing dataset, loaded by runtime code or listed to users before extraction, validation and registration are complete.

## Global record identity

Local numeric record IDs are scoped to one logical dataset.

The global identity tuple is:

```text
(dataset_id, record_id)
```

Examples:

```text
(ru-current-v1, 125)
(future-unlocking-your-dreams-source, 125)
```

These two examples are different records even when the numeric part matches.

Cross-book identity must never be inferred from numeric equality.

## Product modes

### 1. Separate dataset switching

Users choose one registered dataset and search only within it.

Advantages:

- simplest mental model;
- clearest provenance;
- lowest ranking ambiguity;
- easiest validation and fallback;
- safest first functional implementation.

Risks:

- users may need to repeat a search in the other dataset;
- current history and links must become dataset-aware.

**Decision:** implement this first, but only after the second dataset is extracted, validated, registered and approved in a separate functional release.

### 2. Federated combined search

The application queries independent indexes and combines the returned results at presentation time.

Required rule:

```text
separate datasets + separate indexes + federated ranking
```

Forbidden approach:

```text
destructively merge both books into one source JSON
```

Each combined result must retain its dataset and source-work identity. Ranking must define how exact matches, aliases and distant matches from different datasets are interleaved.

**Decision:** add only after separate mode is stable and ranking rules have dedicated tests.

### 3. Side-by-side comparison

The application displays explicitly related records from two datasets.

Comparison must use a reviewed relation map. It cannot pair records merely because they share a numeric ID or similar text.

**Decision:** add only after a relation-map format exists and reviewed relationships are available.

## Recommended staged architecture

### Stage A — source and rights evidence

- identify exact works and editions as far as evidence permits;
- archive known source URLs and distribution statements;
- keep unknowns explicit.

### Stage B — second dataset creation

- extract to a new physical file;
- assign a new logical dataset ID;
- preserve raw extraction separately from normalized output;
- validate schema, required fields, local IDs and source references;
- create hashes, provenance and rollback;
- do not modify `ru-current-v1`.

### Stage C — separate mode

- add a dataset-aware loader;
- expose only registered and validated datasets;
- keep `ru-current-v1` as automatic fallback;
- make routes, history and sharing dataset-aware;
- publish as a functional release.

### Stage D — federated combined mode

- maintain separate indexes;
- query each enabled dataset independently;
- combine ranked result descriptors, not source records;
- show provenance in every result;
- test ranking and fallback independently.

### Stage E — comparison mode

- create a reviewed relation map;
- expose explicit comparison links;
- show relation type, evidence and review status;
- never infer accepted relations from numeric IDs.

## Visible provenance contract

Every result and record card in future multi-dataset modes must show or make directly accessible:

- source work;
- dataset ID or understandable dataset label;
- translation/editorial variant;
- source reference when known;
- an explicit unknown state when provenance is incomplete.

Combined results must never hide which dataset produced a match.

## URL, history and sharing contract

### Record links

Future record links must preserve:

```text
dataset=<dataset_id>
record=<local_record_id>
```

Conceptual example:

```text
?dataset=ru-current-v1&record=125
```

### Search links

Search state should preserve:

```text
mode=<separate|combined>
dataset=<dataset_id when separate>
q=<query>
```

### Comparison links

Comparison links should use:

```text
mode=comparison
relation=<relation_id>
```

They should not encode an unreviewed assumption by pairing two numbers directly.

### Legacy links

Links created before dataset-aware routing fall back to `ru-current-v1`.

### Browser history and local history

Each history entry must store the dataset ID with the local record ID. Existing legacy entries without dataset identity must be interpreted as `ru-current-v1` during migration.

### Sharing

Shared text and URLs must preserve dataset identity and visible source-work provenance.

## Loading and activation contract

A dataset can become selectable only when all required checks pass:

- registered logical dataset entry;
- registered physical file entry;
- schema validation;
- required-field validation;
- unique local IDs;
- declared record-count policy;
- declared raw and canonical hashes;
- source-work/document relationship;
- approved status for runtime activation.

Activation must be atomic. Partial loading must not replace the current working dataset.

## Cache and Service Worker contract

Future dataset cache keys must include dataset ID and dataset version/hash.

Rules:

- new dataset failure cannot corrupt the stable current cache;
- only uDream dataset-scoped caches may be cleaned;
- unrelated caches on the same origin must remain untouched;
- a functional release is required before changing runtime cache behavior;
- rollback must be able to disable new modes and restore `ru-current-v1` without clearing user preferences.

D1.4 itself makes no Service Worker changes.

## Stable fallback contract

The stable fallback remains:

```text
ru-current-v1
```

Automatic fallback is required on:

- load failure;
- schema or registry validation failure;
- hash mismatch;
- partial cache state;
- activation failure.

Fallback should preserve user preferences. The application should record a non-secret recovery reason for diagnostics and show a clear user message rather than silently presenting mixed data.

## Relation-map contract

A future reviewed relation entry requires:

```text
relation_id
left_dataset_id
left_record_id
right_dataset_id
right_record_id
relation_type
evidence
review_status
```

Initial relation types:

- `same-symbol`;
- `related-symbol`;
- `contrast`;
- `source-cross-reference`.

Human review is required before a relation is presented as established. Automated similarity may propose candidates but cannot mark them accepted.

## Migration and rollback

Before the first functional multi-dataset release:

1. create an immutable checkpoint;
2. preserve the current default and all current data hashes;
3. add the new dataset without replacing current files;
4. add dataset-aware routing/history migration;
5. validate loading, offline behavior and fallback;
6. publish a separate functional patchnote;
7. verify the public site and installed PWA.

Rollback must:

1. restore `ru-current-v1` as the only enabled dataset;
2. disable new mode flags;
3. remove only newly introduced dataset-scoped caches;
4. preserve history and preferences;
5. interpret dataset-aware historical entries safely;
6. re-run runtime, data and PWA validation.

## Explicit non-decisions

D1.4 does not decide:

- the final filename or record count of the second dataset;
- the exact second-book extraction tool;
- whether a second Russian translation will use DeepSeek;
- final cross-book ranking weights;
- final UI layout;
- any content correction from D1.3 review candidates.

Those require separate evidence and separate phases.

## Completion boundary

D1.4 is complete when the architecture, machine-readable contract and validator are merged while existing data, runtime, PWA, package metadata, saved versions and archive remain unchanged.
