# Merge reconciliation plan — rer3d-map → TerriaJS monorepo (terriajs 8.12.4)

> **On approval**: copy this file verbatim to `terriajs/plan.md` (git repo root) as Step 0 of
> execution, per merge-reconciliation-plan skill ("Output: plan.md at repo root").
> Plan mode forbids writing it there directly.

## Context

A fork-to-upstream merge is **already in progress** (do not re-run `git merge`) in the git
repo at `e:/Download/claude_skills_rermap/terriajs`:

- **Legacy (HEAD, "ours")**: `rer3d-map_to_8.12.4` on `origin` = `bioretics/rer3d-map` — a
  TerriaMap fork customized for Regione Emilia-Romagna ("Geoportale 3D": Italian i18n, RER
  branding/basemaps, emiro catalog inits, custom search). HEAD commit `dd32727` already moved
  the app `root → apps/terriamap/` (346 renames, ~0 content change) and deleted ckanext junk.
- **Incoming (MERGE_HEAD, "theirs")**: `ad6ebb8` from `upstream` = `TerriaJS/terriajs`
  monorepo — new TerriaMap (`terriajs-map` 0.4.6, React 18, webpack 5) at `apps/terriamap/`,
  **terriajs 8.12.4** vendored at `packages/terriajs/`, yarn-1 workspaces + turbo, Node ≥ 22.
- **Merge base**: `4d2ac71` (old TerriaMap).

Goal: land on the incoming monorepo structure with every legacy **asset** and **localized
string** preserved (two-track policy in `.claude/rules/merge-conflicts.md`). 130 unmerged
paths; 2 217 staged adds (2 180 = `packages/terriajs` arriving verbatim); 17 auto-merged
files to skim for silent conflicts.

## Fill-in variables

```
UPSTREAM_REMOTE:  upstream (TerriaJS/terriajs)
UPSTREAM_BRANCH:  main @ ad6ebb82 (contains terriajs 8.12.4 at packages/terriajs)
LEGACY_BRANCH:    rer3d-map_to_8.12.4 (origin = bioretics/rer3d-map)
BUILD_COMMAND:    yarn install (repo root) → yarn build   (turbo; scoped: yarn workspace terriajs-map build)
TEST_COMMAND:     yarn test (turbo → packages/terriajs karma suite; see Verification scope)
LINT_COMMAND:     yarn lint (turbo; scoped: yarn workspace terriajs-map lint) + yarn prettier-check
ASSET_PATHS:      apps/terriamap/wwwroot/images/, apps/terriamap/wwwroot/favicons/,
                  apps/terriamap/wwwroot/*.ico, apps/terriamap/bioretics_logo.jpg
LOCALE_PATHS:     apps/terriamap/wwwroot/languages/  (dedicated catalogs)
                  + inline strings in apps/terriamap/lib/Views/*.jsx, wwwroot/*.html,
                    wwwroot/index.ejs, wwwroot/config.json (appName, disclaimers, helpContent)
KNOWN_LOCALES:    en, it   (it/translation.json + it/languageOverrides.json are legacy-only)
```

Toolchain on this machine: Node v24.18.0 ✓ (incoming needs ≥ 22), yarn 1.22.22 ✓.

## Reconnaissance facts (verified)

1. **Fork-only custom content is already silently merged** at index stage 0 (not shown by
   `git status`): `wwwroot/init/{0_emiro_init,1_emiro_rapido,basemaps,sample_emiro*}.json`,
   `wwwroot/languages/it/*`, RER images (`logo_rer*`, `logo_emiro*`, `rer_*` basemap thumbs,
   `ortoimmagini*`, `cartaStorica1853`, `dbtr*`, `ctr250k`, …), `devserverconfig.json`
   (RER proxy whitelist), `bioretics_logo.jpg`. **No action except inventory-logging.**
2. **84 of 91 UD files are byte-identical to merge-base** — stale old-TerriaMap files
   (help/ subsite, wwwroot/public/, NICTA/GA branding, deploy/aws, helm registry yml,
   pm2 ecosystem configs, webpack.config.hot.js, .eslintrc, loader.css, 3 basemap thumbs,
   test CSV). Upstream deleted them; fork never touched them. Grep confirms **no live
   references** from config.json / index.ejs / lib/ / init/ to `help/`, `public/`,
   `privacy.html`, or the 3 deleted basemap thumbnails → accept deletions.
3. **7 UD files carry real fork edits** (all small, diffs reviewed): `deploy/aws/stack.json`
   (removed SSH ingress), `lib/ViewModels/PreviewLinkViewModel.js` (dead Terria-7 knockout
   code), `wwwroot/privacy.html` (Titillium font link), `wwwroot/help/data-catalogue.html`
   (Italian titles, RER logo/links), `help/css/custom.css` (logo width), `help/css/bootstrap.css`
   - `public/css/bootstrap.css` (broken `$font-mono` find-replace) → default **accept
     deletion**, decisions logged; see flag F1.
4. **`rer3d-terriajs` / `rer3d-terriajs-server` (fork's custom packages) blast radius**:
   live import in `lib/Views/AboutButton.jsx` (AA); fork-only search providers used by
   `index.js` (AA, see F3); Dockerfile (UU); helm `deployment.yaml` (**auto-merged but still
   invokes `rer3d-terriajs-server`** — silent conflict S1); README.md (AA); dying
   PreviewLinkViewModel.js. Fork's package.json has **no terriajs dep and no submodule** —
   it already committed to `packages/terriajs` from the monorepo.
5. **welcome-bg.jpg triangle** (AU/UA/DD): all three blobs identical (`30d3b7c`); zero
   references in either apps tree → accept incoming layout (keep `packages/terriajs/...`,
   drop `apps/.../images/welcome-bg.jpg` and old root path).
6. **DU (13)**: ckanext `.pyc`/egg-info ×11 (fork deleted junk; incoming carries base copy →
   keep fork's deletion), `deploy/varnish/default.vcl` (keep fork's deletion),
   `serverconfig.json` (new in incoming → take incoming), root `README.md` (take incoming).
7. **AA (21)** — per-file divergence analyzed by Explore recon (classes in Batch tables
   below). Notables: `init/simple.json` is the **stock Australian sample on both sides**
   (no RER content — incoming wins); 404/500.html are **fully RER Italian pages** (legacy
   wins); both favicon.ico differ (RER logo vs Terria default — legacy wins); theme colors
   must relink into upstream's new `variables-overrides.scss`.
8. **Auto-merged (staged M, 17)** — root dotfiles/CI, `.yarnrc`, CHANGES.md,
   `apps/terriamap/Dockerfile`, `configureWebpackForPlugins.js`, helm charts. Skim each;
   S1 (helm deployment.yaml) already caught.

## Batches (dependency-ordered, mapped to merge-conflict-priority phases)

Execution loads **merge-conflict-priority** + **merge-conflict-tracking**; MERGE_LOG.md is
created from template at repo root before Batch 1, updated after every file; `git add`
only after the batch's verification gate is green. No commit until Phase 5 human approval.

### Batch 0 — bookkeeping

Copy this plan to `terriajs/plan.md`; create `MERGE_LOG.md` from
`.claude/skills/merge-conflict-tracking/assets/MERGE_LOG_TEMPLATE.md`; seed the asset &
text inventory with the silently-merged fork content (fact 1) and the staged-M skim list.
_Gate: none (docs only)._

### Batch 1 — images & static assets (priority Phase 1; relinks before content)

| Item                                | Class | Resolution                                                                                                                                 |
| ----------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| welcome-bg.jpg triangle (AU/UA/DD)  | a     | Accept incoming layout: keep `packages/terriajs/wwwroot/images/welcome-bg.jpg`, remove apps + old-root copies (identical bytes, zero refs) |
| `wwwroot/favicon.ico` (AA)          | b     | **Legacy wins** (RER logo icon) — keep ours at incoming path                                                                               |
| `wwwroot/favicons/favicon.ico` (AA) | b     | **Legacy wins** — keep ours                                                                                                                |
| Fork-only images already staged     | a     | Inventory-log only                                                                                                                         |

_Gate: paths resolved in `git status`; inventory rows added. (Visual QA in Batch 7.)_

### Batch 2 — build system & manifests (JS/TS group, dependency cluster first)

| Item                                                    | Class | Resolution                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json` (AA)                                     | c     | **Incoming** deps/versions/scripts/engines win (React 18, webpack 5, terriajs-cesium 26, terriajs-server 5.0.0-alpha.3, plugin-api alpha.17, gulp dev/build/lint; fork's pm2/AWS scripts and custom cesium pin `1.92.0-tile-error-provider-fix-2` die with their targets). Keep RER identity: `name: rer3d-map`, description, repository. Drop legacy `workspaces` (root monorepo owns them) |
| `yarn.lock` (AA)                                        | a     | **Policy-locked**: take incoming, then regenerate via root `yarn install` — never hand-merge                                                                                                                                                                                                                                                                                                 |
| `tsconfig.json` (AA)                                    | a     | Incoming (adds `include` globs)                                                                                                                                                                                                                                                                                                                                                              |
| `gulpfile.js` (AA)                                      | a     | Incoming wholesale (HtmlPlugin renders index.ejs; new dev/version tasks)                                                                                                                                                                                                                                                                                                                     |
| `buildprocess/webpack.config.js` (AA)                   | c     | Incoming webpack-5 config wholesale — no RER strings. Note: alias now targets `lib/Styles/variables-overrides.scss` (cross-file dep for Batch 3)                                                                                                                                                                                                                                             |
| `buildprocess/configureWebpackForPlugins.js` (staged M) | skim  | Verify auto-merge sanity                                                                                                                                                                                                                                                                                                                                                                     |
| `.npmignore` (AA)                                       | a     | Incoming                                                                                                                                                                                                                                                                                                                                                                                     |
| `.yarnrc`, root dotfiles (staged M)                     | skim  | Verify                                                                                                                                                                                                                                                                                                                                                                                       |

_Gate: root `yarn install` completes clean; `yarn workspace terriajs-map build` starts
compiling (full green not expected until Batches 3–4 land)._

### Batch 3 — app code & markup (JS/JSX/TS + scss + html; renames/reshapes before content)

| Item                                                    | Class      | Resolution                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entry.js` (AA)                                         | c          | Incoming 3-line bootstrap (loader is now React `Loader.tsx` + `loader.scss`). Legacy DOM-loader visuals (globe.gif, `#383F4D`) noted in log as superseded                                                                                                                                                                       |
| `lib/Views/render.jsx` (AA)                             | c          | Incoming React-18 `createRoot` + terriaStore + lazy `TerriaUserInterface` — no RER content                                                                                                                                                                                                                                      |
| `lib/Views/UserInterface.jsx` (AA)                      | c          | Incoming named-export shape; **re-map into it**: Login/Logout MenuItem gated on `configParameters.userProfileLoginServiceUrl`, `<Nav>` MeasureTool item, RER console version banner. Mark `needs-review` if the stock components these rely on are missing (→ F3)                                                               |
| `lib/Views/AboutButton.jsx` (AA)                        | b          | Incoming `terriajs` import; re-apply caption `"Geoportale"` + `geoportale.regione.emilia-romagna.it` href (may be vestigial — incoming drives About via `aboutButtonHrefUrl` config; if so, set that key in config.json instead and log)                                                                                        |
| `index.js` (AA)                                         | **d → F3** | Incoming structure (registerSearchProviders, showGlobalDisclaimer, analytics move, `terria.start` export). RER search subsystem handled per F3 decision. Keep RER disclaimer HTML wiring if incoming's `showGlobalDisclaimer` covers `GlobalDisclaimer.html`/`DevelopmentDisclaimerPreamble.html` (both sides ship these files) |
| `lib/Styles/variables.scss` (AA)                        | c          | Incoming `@use "./variables-overrides"`; **relink RER theme values `$color-primary:#519ac2`, `$dark:#3f4854`, `$dark-with-overlay:#667080` into `variables-overrides.scss`**                                                                                                                                                    |
| `lib/Views/global.scss` (AA)                            | a          | Incoming `@use` syntax; diff is prettier noise — nothing to preserve                                                                                                                                                                                                                                                            |
| `wwwroot/index.ejs` (AA)                                | c          | Incoming HtmlPlugin structure (drop manual `build/TerriaMap.css`/`.js` tags, keep `svg-sprites` div); **re-apply**: `<title>Geoportale 3D</title>`, Italian meta description/keywords/copyright, `logo_emiro_64/32/16.png` favicon links + msapplication TileImage, Piwik/Matomo block (commented, as in legacy)                |
| `wwwroot/404.html`, `500.html` (AA)                     | b          | **Legacy wins** — full RER Italian pages (infogeoportale mailto, RER footer). Check their `public/img/logo-regione.png` refs still resolve after Batch 6 deletions; relink to a surviving logo if not                                                                                                                           |
| `lib/Styles/loader.css` (UD, unchanged)                 | a          | Accept deletion — incoming `Loader.tsx`/`loader.scss` replace it                                                                                                                                                                                                                                                                |
| `lib/ViewModels/PreviewLinkViewModel.js` (UD, modified) | b          | Accept deletion — dead Terria-7 code; log                                                                                                                                                                                                                                                                                       |
| `README.md` app (AA)                                    | b          | **Legacy RER README wins** (branding, wiki links, screenshots); append upstream's monorepo/upgrade notes section; fix stale `rer3d-terriajs` links                                                                                                                                                                              |

_Gate: `yarn workspace terriajs-map build` green; grep 0 conflict markers; grep 0
`rer3d-terriajs` outside CHANGES.md; scoped lint._

### Batch 4 — config & catalogs (JSON group)

| Item                                        | Class                  | Resolution                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wwwroot/config.json` (AA)                  | **c (search: d → F3)** | Incoming schema; **re-apply RER values**: `initializationUrls: ["basemaps","0_emiro_init","1_emiro_rapido"]`; parameters `cesiumTerrainAssetId:754445`, `useCesiumIonTerrain:false`, `useCesiumIonBingImagery:false`, `useMyLocationFromDesktop`, `mouseAsInfoDefaultValue`, `useElevationMeanSeaLevel`, `pickSize`; Italian `disclaimer`/`printDisclaimer`; `developerAttribution` (Bioretics); `appName:"Geoportale 3D"`; `supportEmail`; `brandBarElements` + `brandBarSmallElements` (RER logos); `languageConfiguration {enabled, en+it, fallback en}`; `helpContent[0]` Italian About; `showInAppGuides`. Fork-only search params (`customSearchProviderUrl:"eGeoCoding"`, `whereAmIParams`, `coordsConverterUrl`) per F3. Incoming-new keys (`searchBarConfig`, `searchProviders`, active `feedbackUrl`, storymigration help item) adopted from incoming |
| `wwwroot/init/simple.json` (AA)             | a                      | **Incoming wins** — both sides are the stock Australian sample; no RER content (verified). RER catalogs live in the separate, already-preserved init files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `serverconfig.json` (DU)                    | b                      | Take incoming (new file); confirm preserved `devserverconfig.json` still drives dev flow; production overrides were S3-side — note in log                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `wwwroot/languages/*`                       | a                      | Already merged (it/ legacy-only; en identical 3-way) — inventory-log                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `init/basemaps.json` + emiro inits (staged) | a                      | Inventory-log; verify referenced thumbnail paths exist post-merge                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

_Gate: JSON parse all touched files; build green; `gulp dev` boots and serves config
(smoke); missing-key audit logged (any legacy key without incoming home → `needs-review`)._

### Batch 5 — other files & infra

| Item                                                            | Class      | Resolution                                                                                                                                                                                                                            |
| --------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deploy/docker/Dockerfile` (UU)                                 | b          | Incoming wins (node:24, `serverconfig.json`, `NODE_ENV=production`, stock `terriajs-server`). Judgment: legacy's `/etc/config/client/config.json` symlink (external config mount) — re-add unless user says RER deploy changed (→ F4) |
| `apps/terriamap/Dockerfile` (staged M)                          | skim       | Verify auto-merge                                                                                                                                                                                                                     |
| helm charts (staged M ×5)                                       | **c → S1** | Fix `deployment.yaml` command `rer3d-terriajs-server` → `terriajs-server`; skim values/Chart; mark `needs-review` (runtime infra untestable here)                                                                                     |
| root `README.md` (DU)                                           | a          | Take incoming monorepo README                                                                                                                                                                                                         |
| `.eslintrc` (UD)                                                | a          | Accept deletion (incoming lint setup)                                                                                                                                                                                                 |
| `webpack.config.hot.js`, `ecosystem*.config.js` (UD, unchanged) | a          | Accept deletion (gulp dev / terriajs-server replace pm2+hot) — log since fork's old start flow dies                                                                                                                                   |
| `deploy/aws/*` (UD; stack.json was fork-edited)                 | b          | Accept deletion; log the dropped SSH-hardening edit                                                                                                                                                                                   |
| ckanext `.pyc`/egg-info, varnish (DU)                           | a          | Keep fork's deletion                                                                                                                                                                                                                  |
| CI workflows (staged A/M/R)                                     | skim       | Incoming CI; check fork's moved `release.yml` coherence                                                                                                                                                                               |
| `wwwroot/test/NSW_...csv` (UD)                                  | a          | Accept deletion                                                                                                                                                                                                                       |

_Gate: docker/helm files grep-clean of `rer3d-terriajs`; lint/prettier pass on touched files._

### Batch 6 — deletions land (priority Phase 3, repo-wide, after everything else)

`git rm` the accepted-deletion set (84 unchanged UD + 7 fork-edited UD per F1 + DU
keep-deleted set). Before each group: re-run reference grep on the **resolved** tree (not
HEAD) — especially `public/img/logo-regione.png` used by the kept 404/500 pages. Update
inventory: every deleted path → `accepted-deletion` (or `dropped-with-record` for the 7).
_Gate: `git status` shows zero unmerged paths; full build green._

### Batch 7 — final verification (Phase 5 gate)

1. Root `yarn install` → `yarn build` (turbo, both workspaces)
2. `yarn workspace terriajs-map lint` + root `yarn prettier-check`
3. `yarn test` scope decision: `packages/terriajs` arrives verbatim from upstream 8.12.4
   (zero conflicted files inside it) → full karma suite optional; run if env allows, else
   document as scoped-out per rules
4. Smoke run `gulp dev` → manual QA checklist: app boots; **Italian locale** renders
   (welcome text, menu labels from `it/translation.json`); RER brand bar/logos; basemap
   picker shows RER thumbnails; emiro catalog inits load; favicon is RER; 404/500 pages
   render with images; search behaves per F3 decision
5. MERGE_LOG.md completeness: index row for every status path; asset & text inventory has
   an outcome for every legacy asset/locale key/inline string; no orphaned rows
6. **STOP — human approval gate**: present summary + draft commit message via
   `/caveman-commit`. No `git commit` without explicit approval.

## Relink table (legacy anchor → incoming anchor)

| Legacy                                                                                                     | Incoming                                                          | Action                                                               |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| `apps/terriamap/wwwroot/images/welcome-bg.jpg` (+ old root path)                                           | `packages/terriajs/wwwroot/images/welcome-bg.jpg`                 | Accept theirs; delete apps/root copies (identical bytes, 0 refs)     |
| RER theme scss `$color-primary:#519ac2`, `$dark:#3f4854`, `$dark-with-overlay:#667080` in `variables.scss` | `lib/Styles/variables-overrides.scss` (new upstream file)         | Copy values into override file; keep incoming `variables.scss` shape |
| `rer3d-terriajs` import in `AboutButton.jsx`                                                               | `terriajs` (workspace pkg)                                        | Rewrite import                                                       |
| `rer3d-terriajs-server` in helm `deployment.yaml`, `deploy/docker/Dockerfile`                              | `terriajs-server` (5.0.0-alpha.3)                                 | Rewrite command/install                                              |
| Fork search registration in `index.js` (RerSearchProvider, Nominatim it)                                   | incoming `registerSearchProviders()` + config `searchProviders[]` | Per F3 decision                                                      |
| About caption/href in `AboutButton.jsx`                                                                    | config-driven `aboutButtonHrefUrl` (incoming UserInterface)       | Set config key to geoportale URL if AboutButton is vestigial         |
| pm2 `ecosystem*.config.js` start flow                                                                      | `yarn start` → `terriajs-server --config-file serverconfig.json`  | Accept incoming; devserverconfig.json preserved for dev              |
| `lib/Styles/loader.css` + entry.js DOM loader                                                              | `lib/Views/Loader.tsx` + `loader.scss`                            | Accept incoming (legacy visuals logged as superseded)                |
| RER favicon bytes                                                                                          | incoming `wwwroot/favicon.ico`, `wwwroot/favicons/favicon.ico`    | Keep legacy bytes at incoming paths                                  |
| `logo_emiro_*` favicon links, Italian meta, Piwik block in `index.ejs`                                     | incoming index.ejs (HtmlPlugin-injected assets)                   | Re-apply into incoming markup                                        |
| config.json RER keys                                                                                       | incoming config.json schema                                       | Key-by-key map (Batch 4)                                             |

## Flagged for human sign-off

- **F3 — RER search subsystem (class d, the only fundamental conflict)**: fork search
  (`RerSearchProvider` "eGeoCoding", Nominatim `countryCodes:"it"`, `whereAmIParams`,
  `coordsConverterUrl`) lives in the abandoned `rer3d-terriajs` fork; stock terriajs 8.12.4
  - new config-driven `searchProviders` don't include these providers.
    **DECIDED (user, plan review)**: defer the port. Land incoming structure + stock
    providers now; carry all RER search params into config.json (inert but preserved); mark
    `needs-review` in MERGE_LOG.md. Porting `RerSearchProvider`/Nominatim as app-level custom
    providers is a **follow-up task** after the merge is green.
- **F1 — help/ subsite & privacy.html**: upstream deleted the legacy help subsite; fork had
  localized bits (Italian titles, RER logo, Titillium font). Nothing live references it.
  Default = accept deletion with the Italian edits recorded in MERGE_LOG.md.
- **F2 — config.json key mapping**: any legacy key without an incoming schema home is
  listed `needs-review` rather than dropped — expect a short list to approve.
- **F4 — Docker external-config symlink**: legacy Dockerfile symlinked
  `/etc/config/client/config.json` over `wwwroot/config.json` (k8s-style config mount);
  incoming dropped it. Default = re-add the symlink (deployment behavior the fork relied
  on); flag `needs-review`.
- **S1 — helm runtime command**: relinked to `terriajs-server` but untestable locally.
- **R1 — rer3d-terriajs feature gap beyond search**: if fork UI relies on other APIs absent
  from stock 8.12.4 (e.g. `MenuButton` export shape, Login MenuItem deps, MeasureTool),
  Batch 3 build will surface it → becomes a class-d decision (port / drop / patch
  packages/terriajs).

## Verification scope statement

Primary gates are **build + lint + smoke run + locale/visual QA** at the terriamap app
level. The terriajs library suite is upstream's own, arriving unmodified; running it is
optional and will be documented either way in MERGE_LOG.md (rules allow explicit scoping).
No `merge --abort`, `reset --hard`, force-push, or commit without human approval.

## Effort estimate

- Batches 0–2: ~1 session (mostly mechanical + yarn install)
- Batches 3–4: the real work (21 AA manual merges, config mapping, F3 wiring) — 1–2 sessions
- Batches 5–7: ~1 session incl. QA
