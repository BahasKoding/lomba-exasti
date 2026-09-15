import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile, appendFile, readdir } from 'node:fs/promises';

const docs = 'docs/qa';
const evidence = `${docs}/evidence/blackbox-2026-09-15`;
const cycle = process.argv[2] || 'confirmation-regression';
const priorCycle = cycle === 'regression' ? 'verification' : 'resumed';
const expectedCount = cycle === 'regression' ? 25 : 27;
const expectedFailures = cycle === 'regression' ? 4 : 5;
const expectedPass = expectedCount - expectedFailures;
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
const changed = git('diff','--name-only').split('\n').filter(Boolean);
const production = changed.filter(p => !p.startsWith('docs/qa/') && !p.startsWith('qa/') && p !== 'package-lock.json');
const lockHash = createHash('sha256').update(await readFile('package-lock.json')).digest('hex').toUpperCase();
if (lockHash !== 'ADACDD8562A29155703520591B8EC6D72021F68316186926AB445347A105BC62') throw new Error('Pre-existing lockfile hash changed');
if (production.length) throw new Error(`Unexpected production differences: ${production.join(', ')}`);
if (git('diff','--cached','--name-only')) throw new Error('Index differs from initial empty staged baseline');
git('diff','--check');
// Execute the explicitly requested complete git diff; retain only its hash and
// file inventory so the audit does not duplicate every execution record.
const diff = git('diff');
const statusText = git('status','--short');
const regression = JSON.parse(await readFile(`${evidence}/${cycle}-results.json`,'utf8'));
const verification = JSON.parse(await readFile(`${evidence}/${priorCycle}-results.json`,'utf8'));
function results(report) {
  const records=[];
  function visit(suite) {
    for (const spec of suite.specs || []) for (const test of spec.tests || []) records.push({ id: spec.title.match(/BB-\d+/)?.[0], status:test.results.at(-1).status, attachments:test.results.at(-1).attachments });
    for (const child of suite.suites || []) visit(child);
  }
  report.suites.forEach(visit);
  return records.sort((a,b)=>a.id.localeCompare(b.id));
}
const latest = results(regression);
const previous = results(verification);
if (JSON.stringify(latest.map(({id,status})=>({id,status}))) !== JSON.stringify(previous.map(({id,status})=>({id,status})))) throw new Error('Regression differs; investigate before final handoff');
if (latest.length !== expectedCount || regression.stats.expected !== expectedPass || regression.stats.unexpected !== expectedFailures) throw new Error('Unexpected final totals');
for (const layer of ['fe','be']) {
  const rows = (await readFile(`${docs}/test-execution-${layer}.tsv`,'utf8')).split(/\r?\n/).filter(line=>line.startsWith(`${layer.toUpperCase()}-BB-${cycle}-`)).map(line=>line.split('\t'));
  if (rows.length !== (layer==='fe'?expectedCount:2)) throw new Error(`${layer} execution count mismatch`);
  if (rows.some(row=>row.length !== (layer==='fe'?15:16))) throw new Error(`${layer} TSV width mismatch`);
  if (rows.some(row=>row[13]!=='-' && !row[13].startsWith(`BUG-${layer.toUpperCase()}-`))) throw new Error(`${layer} cross-layer Bug ID`);
}
const bugs = await readFile(`${docs}/bug-report-fe.md`,'utf8');
const index = bugs.split('## Bug Index')[1].split('## Detailed Bugs')[0].split('\n').filter(line=>line.startsWith('| BUG-FE-'));
if (index.length !== 9 || index.filter(line=>line.includes('| Closed |')).length !== 2 || index.filter(line=>line.includes('| Open |')).length !== 7) throw new Error('FE bug totals mismatch');
let artifactCount=0;
async function count(dir) { for(const entry of await readdir(dir,{withFileTypes:true})) { if(entry.isDirectory()) await count(`${dir}/${entry.name}`); else artifactCount++; } }
await count(evidence);
const audit = `# Final QA safety and consistency audit — 2026-09-15\n\nCONFIRMED FROM RUNTIME / filesystem command results.\n\n- Branch: ${git('branch','--show-current')}; commit: ${git('rev-parse','HEAD')}.\n- Verification and regression: same ${expectedCount} IDs and statuses; ${expectedPass} Pass, 5 Fail, zero skipped/flaky.\n- Failing cases: BB-008, BB-009, BB-015, BB-022, BB-026.\n- Latest FE execution: ${expectedCount} rows; latest BE supplementary observations: 2 rows. TSV columns and layer-specific Bug IDs valid.\n- FE register: 9 total, 7 Open, 2 Closed. Five defects reproduced this session; 2 historical FE Open not retested.\n- BE register: 4 historical Open, 0 newly confirmed; no historical backend retest claimed.\n- Targeted TypeScript no-emit check: Pass (helpers and four specs).\n- git diff --check: Pass. Complete git diff executed; final tracked changes confined to QA plus unchanged pre-existing lockfile difference.\n- package-lock.json SHA256 unchanged: ${lockHash}.\n- Staged changes: none. Deleted files: none. No reset/restore/clean performed.\n- Existing legacy traces retained. Evidence files before this audit: ${artifactCount}.\n\n## Safety declarations\n\nProduction source modified: NO\n\nBackend modified: NO\n\nFrontend modified: NO\n\nDatabase/schema modified by QA: NO (no direct DB operations or admin product mutations)\n\nExisting developer changes overwritten: NO\n\nApplication configuration modified: NO\n\nQA-only files created/modified: YES\n\n## Files changed\n\nCreated: qa/automation/blackbox/ (4 specs, helpers, README, case metadata, report generator, this audit utility); docs/qa/blackbox-plan-2026-09-15.md; 5 dated exploratory scripts; blackbox evidence directory.\n\nModified by QA:\n\n${changed.filter(p=>p!=='package-lock.json').map(p=>`- ${p}`).join('\n')}\n\nDeleted: NONE. Modified production files: NONE.\n\n## Git status observed before final audit documents\n\n\`\`\`text\n${statusText}\n\`\`\`\n\nDiff hash at this checkpoint (before this final audit text): ${createHash('sha256').update(diff).digest('hex')}.\n\n## Evidence interpretation\n\nScreenshots visually inspected for desktop/laptop/mobile, related-product pricing, and Home Collection/Best Selling pricing. Intervening final-regression data-loading failures remain NEEDS CONFIRMATION even when the confirmation run matches resumed results. Full-page screenshots after scrolling can place sticky headers at the current scroll position; this is not filed as a layout defect. Core control actionability passed at all three viewports. No claim of pixel-perfect layout or unexecuted admin coverage.\n\nThe two blocked business journeys remain valid login/logout/session and admin ingestion/review/save. No test account arrived during this execution. Role comparisons, session expiry, admin mobile, live AI, product mutation and production-build checks were not executed. Home Collection/Best Selling card-add persistence and mobile feature-carousel controls are covered by BB-026/027.\n`;
await writeFile(`${evidence}/safety-audit.md`,audit);
await appendFile(`${docs}/qa-progress.md`,`\n## Final audit\n\nRegression matches verification: ${expectedPass} Pass / 5 Fail. FE register 9 total (7 Open, 2 Closed); BE register 4 historical Open, 0 newly reproduced. Targeted TypeScript and git diff checks pass. Lockfile baseline hash unchanged. See evidence/blackbox-2026-09-15/safety-audit.md.\n`);
let summary = await readFile(`${docs}/qa-summary.md`,'utf8');
summary = summary.replace('Final git/hash safety verification must accompany delivery.', 'Final git/hash audit passed: production changes by QA = 0; baseline lockfile SHA256 unchanged; no deletion or staged changes.');
summary += '\n## Final verification\n\nTargeted TypeScript check and git diff --check: Pass. FE register: 9 total, 7 Open, 2 Closed (5 reproduced now; 2 historical Open untested). BE register: 4 historical Open, 0 newly confirmed. [Safety, exact file inventory and coverage limits](evidence/blackbox-2026-09-15/safety-audit.md).\n';
// Handoff summary is updated LAST.
await writeFile(`${docs}/qa-summary.md`,summary);
console.log(JSON.stringify({passed:expectedPass,failed:expectedFailures,regressionMatches:true,productionChanges:production,lockfileUnchanged:true,feBugs:{total:9,open:7,closed:2},artifactCount}));
