# Release Checklist — AKRA Web Apps

## Before Syncing to GitHub

1. **Test core flows in browser** (VS Code Live Server):
   - [ ] Portal login with a valid Employee ID
   - [ ] Target app loads and data renders
   - [ ] Any modified workflow completes end-to-end

2. **Verify no debug artifacts**:
   - [ ] No `console.log` left in modified files
   - [ ] No hardcoded test data or test Employee IDs
   - [ ] No `alert()` calls used for temporary debugging

3. **Check CLAUDE.md / PROJECT_STATE.md are updated**:
   - [ ] `PROJECT_STATE.md` reflects completed tasks and current phase
   - [ ] Any new domain rules or schema gotchas added to `CLAUDE.md`

## Sync via `t2c`

Use `t2c ตรวจสอบงาน` in PowerShell to trigger full audit, commit message generation, and GitHub push.

## Post-Sync

- Verify the push landed on the correct branch at https://github.com/AKRA-WEB/ProjectWEBAPP
- If Supabase schema changed, paste updated `_sql_migration/schema.sql` into the Supabase SQL Editor
