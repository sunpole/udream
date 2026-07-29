# Second-book extraction contract

## Purpose

This contract defines how uDream may turn the retained second-book PDF into a separate, reviewable dataset without changing the current application, the active `ru-current-v1` dataset or any existing data file.

The retained document is:

```text
_archive/source-files/Unlocking-Your-Dream-Student-Ma.pdf
```

Its verified evidence is recorded in:

```text
docs/second-book-evidence.json
docs/SECOND_BOOK_EVIDENCE.md
```

D1.4a proves that direct text extraction is technically viable. It does **not** create a dataset and does not prove semantic record boundaries or publication rights.

## Current evidence baseline

- PDF bytes: `740193`;
- SHA-256: `edb4127915bf720ee56c96612f825ea4e0ef2f5fc15192a56fb96e5c7ec4745a`;
- pages: `55`;
- pages with substantial extracted text: `55`;
- searchable ratio: `1.0`;
- extracted text characters: `85103`;
- extracted words: `12479`;
- technical strategy: `direct-text-extraction-viable`;
- current status: retained evidence, not a registered dataset.

## Non-destructive principles

1. The source PDF is immutable input.
2. Existing files under `data/` are not edited by extraction work.
3. A second-book dataset receives its own logical dataset ID and local record IDs.
4. Numeric IDs from the first book are never reused as cross-book identity.
5. Full extracted book text is not committed publicly until rights and distribution evidence are reviewed.
6. A candidate dataset never replaces `ru-current-v1` in place.
7. Combined search later federates separate indexes; it never destructively merges source JSON files.
8. Any published result must retain source-work, dataset, record and page/reference provenance.

## Staged extraction pipeline

### Stage E0 — source lock

Before every extraction run:

- verify the exact PDF path;
- verify bytes and SHA-256 against `docs/second-book-evidence.json`;
- record the Git commit containing the input;
- stop immediately when the source hash differs;
- preserve the existing PDF unchanged.

### Stage E1 — immutable raw extraction

The preferred method is direct text extraction with page boundaries preserved.

A run ID uses this format:

```text
second-book-en-YYYYMMDD-NNN
```

The raw run must produce, outside the public runtime:

```text
<run-id>/
├── manifest.json
├── pages/
│   ├── page-0001.txt
│   ├── page-0002.txt
│   └── ...
├── page-metrics.json
└── extraction.log
```

Requirements:

- one UTF-8 text file per physical PDF page;
- normalized line endings only; wording is not corrected at raw stage;
- each page file has its own SHA-256 in the manifest;
- command, tool version, OS, UTC time and source hash are recorded;
- output is immutable after the manifest is finalized;
- a changed extraction creates a new run ID instead of overwriting the old run;
- public repository storage is not approved until rights review permits it.

### Stage E2 — limited OCR fallback

OCR is not the default because all 55 pages have a usable text layer.

OCR may be used only for explicitly flagged pages or graphical regions when direct extraction loses meaningful content. Every OCR fragment must record:

- physical page number;
- bounding region when applicable;
- OCR engine and version;
- language configuration;
- confidence or warning state;
- original direct-text fragment hash;
- human-review status.

OCR output never silently replaces direct text. Both variants remain traceable.

### Stage E3 — candidate segmentation

Segmentation converts immutable page text into candidate records. It is a new derived layer, not raw extraction.

Proposed candidate record shape:

```json
{
  "local_id": 1,
  "symbol_raw": "...",
  "interpretation_raw": "...",
  "aliases_raw": [],
  "source_work_id": "unlocking-your-dreams-retained-work",
  "document_id": "unlocking-your-dreams-student-material-pdf",
  "source_pdf_sha256": "edb4127915bf720ee56c96612f825ea4e0ef2f5fc15192a56fb96e5c7ec4745a",
  "page_start": 1,
  "page_end": 1,
  "source_anchor": "page:0001:block:001",
  "extraction_run_id": "second-book-en-YYYYMMDD-NNN",
  "extraction_method": "direct-text",
  "segmentation_confidence": "review",
  "review_status": "unreviewed"
}
```

Rules:

- `local_id` is unique only inside the future second-book dataset;
- IDs are assigned deterministically after segmentation order is fixed;
- page references are mandatory;
- `source_anchor` is stable inside one extraction run;
- original wording remains available for review;
- aliases and normalized symbols are separate reviewed fields;
- uncertain boundaries remain separate candidates or receive explicit warnings;
- no cross-book relation is created automatically from equal numeric IDs.

### Stage E4 — reviewed candidate dataset

A logical dataset ID may be assigned only after:

- immutable raw extraction exists;
- every candidate has a source reference;
- schema validation passes;
- local IDs are unique and ordered;
- duplicate/overlap checks are reviewed;
- extraction warnings are resolved or explicitly accepted;
- a human review report exists;
- rights/publication handling is decided;
- `data/datasets.json` is updated in a separate Pull Request.

The candidate remains non-runtime until a separate functional release approves activation.

## Provenance manifest contract

`manifest.json` for a raw extraction run must include:

```json
{
  "schema_version": 1,
  "run_id": "second-book-en-YYYYMMDD-NNN",
  "created_at": "UTC timestamp",
  "source": {
    "path": "_archive/source-files/Unlocking-Your-Dream-Student-Ma.pdf",
    "bytes": 740193,
    "sha256": "edb4127915bf720ee56c96612f825ea4e0ef2f5fc15192a56fb96e5c7ec4745a",
    "git_commit": "exact commit"
  },
  "tool": {
    "name": "pdftotext",
    "version": "exact version",
    "arguments": ["-layout"]
  },
  "page_count": 55,
  "pages": [
    {
      "physical_page": 1,
      "path": "pages/page-0001.txt",
      "sha256": "page hash",
      "characters": 365,
      "words": 0,
      "method": "direct-text",
      "warnings": []
    }
  ],
  "full_output_sha256": "deterministic aggregate hash",
  "review_status": "unreviewed"
}
```

The manifest must never contain an API key or secret.

## Validation gates

### Source gate

- exact path exists;
- bytes equal `740193`;
- SHA-256 equals the verified value;
- PDF has 55 pages;
- input commit is recorded.

### Raw extraction gate

- exactly 55 page files exist;
- page numbers are contiguous and unique;
- every page has a hash and metrics;
- aggregate hash is reproducible;
- full text is not accidentally committed to an unapproved public path;
- warnings are explicit.

### Candidate schema gate

- candidate file is valid JSON;
- required fields exist and use correct types;
- local IDs are unique and ordered;
- every record has a page range and source anchor;
- page ranges are within 1–55;
- no record claims `ru-current-v1` identity;
- no record is marked published before review.

### Review gate

- segmentation samples from the beginning, middle and end are reviewed;
- every unresolved boundary is listed;
- duplicate and alias collisions are reported;
- source references are spot-checked against the PDF;
- rights/publication status is recorded;
- review result is signed by a named project reviewer or owner decision in Git history.

### Registration gate

- extraction and candidate hashes are immutable;
- review report passes;
- a new logical dataset ID is approved;
- registry/provenance documentation is updated;
- current runtime default remains `ru-current-v1`;
- rollback steps are documented.

## Future two-book behavior

After a second dataset is registered and validated, implementation proceeds in separate functional phases:

1. separate dataset selection;
2. federated combined search over separate indexes;
3. reviewed side-by-side comparison.

Combined results must distinguish:

- materially matching interpretations;
- additions or extensions;
- content unique to one work;
- possible contradictions, shown separately without automatic harmonization.

Cross-book relationships use reviewed relation records based on normalized symbols, aliases, source evidence and human review. They never rely only on equal numeric IDs.

## Retention and rollback

- never overwrite an extraction run;
- retain source hash, run manifest and all derived hashes;
- rejected candidate datasets remain recoverable or are archived with rejection reason;
- public runtime is unchanged until a separate release;
- rollback removes only the newly activated dataset/index and restores the previous registry/runtime configuration;
- `ru-current-v1` remains the stable fallback.

## Next approved practical phase

The next bounded task is a **private or non-public raw-extraction pilot** using the contract above. It should create page-level output and a manifest, then produce a small reviewed segmentation sample before attempting the full second-book dataset.
