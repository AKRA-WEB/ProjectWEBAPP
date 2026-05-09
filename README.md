# AKRA Web Apps — Supabase Edition

Internal web application suite for AKRA-TRD, migrated from Google Apps Script + Google Sheets to Supabase (PostgreSQL) + Vanilla JS / Tailwind CSS.

## Quick Start

Open `index.html` in a browser, or use the VS Code Live Server extension. No build step required.

## Applications

| File | Description |
|---|---|
| `index.html` | Portal / SSO login |
| `PR.html` | Purchase Requests |
| `PO.html` | Purchase Orders |
| `GR.html` | Goods Receipts |
| `AKRA W5.html` | W5 Warehouse Inventory |
| `Tranfers W2-W1.html` | Inter-warehouse Transfers |
| `KPI.html` | KPI Tracker |
| `Return&Claim.html` | Returns, Claims & Audit Counting |

## Key Files

- `supabase-client.js` — Shared Supabase client and `AKRA_API` object (loaded by every page)
- `CLAUDE.md` — AI assistant instructions and domain knowledge
- `PROJECT_STATE.md` — Current project status and task log

## Project Links

- **GitHub:** https://github.com/AKRA-WEB/ProjectWEBAPP
- **Supabase Project:** `deboelqdfpxayzqnrnjb`

## Directory Structure

```
├── docs/              Architecture docs, decisions, and runbooks
├── tools/scripts/     Diagnostic and migration scripts (Node.js)
├── _sql_migration/    Database schema and seed SQL files
├── src/               API and persistence layer documentation
└── .claude/           Claude Code skills and hooks
```
