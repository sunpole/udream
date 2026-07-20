# Recovered historical context

This document records context recovered from an earlier DeepSeek chat. It describes the project around the `13.2` generation and must not be treated as the current architecture without verification.

## Historical goal

Replace slow PDF searching with a mobile-friendly Christian dream-symbol reference application based on two source books. The intended product included search, aliases, tags, alphabet navigation, history, themes, RU/EN interface text, JSON data, an administrative editor, and PWA installation.

## Historical version sequence

- `002`: early hamburger-menu design;
- `003`: larger typography;
- `004`: glassmorphism experiment;
- `005`: refined design;
- `admin1–admin7`: administration prototypes;
- `012`: monolithic working version;
- `013.2`: separated HTML/JavaScript generation described as current at the time.

## What remained valid

- The product purpose and static-site approach.
- The JSON record fields.
- The main search, tag, alphabet, history, localization, theme, and PWA ambitions.
- The existence of historical versions and admin prototypes.
- GitHub Pages as the deployment target.

## What became outdated

- `013.2/` is no longer the current runtime directory.
- Historical versions now live under `_archive/legacy-versions/`.
- Admin prototypes now live under `_archive/admin-versions/`.
- The current site runs from the repository root.
- The interface was historically labelled `v19`; the maintained root application now uses the unified `v23.7.0` line.
- The application currently loads `data/divinity_code_ru.json`, not the database path named in the recovered report.

Use this document to understand intent and evolution, not to decide which files to edit.
