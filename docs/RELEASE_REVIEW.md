# Portfolio release review

Reviewed 2026-10-13 against original main commit `e399eab`.

**Release position:** suitable for review as an interactive scenario-simulation portfolio piece. It should not be described as an authoritative live results service.

## Findings addressed

| Original issue | Change |
| --- | --- |
| Old sample content presented as a live tournament | Persistent sample-scenario framing, explanatory introduction, source notes, explicit optional imports. |
| Default Round of 16 view hid the first playable round | Open at Round of 32, with a short interaction guide. |
| Mobile bracket used tiny scaled cards | Stacked rounds with full team names and 44px selection targets. |
| Picks were lost unless explicitly saved | Autosave on selection, plus JSON export. |
| Save action swallowed storage errors | Return save status and show a blocked-storage message. |
| Arbitrary saved fixture arrays could break rendering | Validate fixture identity, score types/ranges, and fixture count. |
| User picks could create false later-round import matches | Require confirmed feeder results before matching later-round external scores. |
| Group score edits left imported knockout results attached to a changed scenario | Clear imported results when group scores change. |
| Reset preserved imported outcomes | A confirmed restart restores the bundled scenario and clears imports/picks. |
| Finalist rendering could expose escaped SVG text | Render plain finalist names. |
| Sorting was mouse-only | Native buttons with keyboard operation and sort semantics. |
| API calls had no reliable bounded body read | A timeout covers fetch and JSON parsing; no background polling. |
| README and package metadata still described a template | Rewrite the case study, architecture, limits, run/publish steps, and test commands. |
| Two duplicated Streamlit entry points and inconsistent dependency floors | One implementation, a compatibility entry point, Streamlit 1.65.0 pinned consistently with a regenerated lock. |
| Deprecated fixed-height Streamlit embedding | Use `st.iframe` with content sizing. |
| Old prototypes mixed with the deployable app | Move prototypes to `archive/`; build a one-file static deployment. |
| No automated release check | Add engine regressions, browser smoke checks, and artifact-building CI. |

## Validation completed locally

- Seven engine regression tests pass, including all 495 third-place group combinations, full tournament progression, invalidation, and shootouts.
- Browser smoke checks pass at 1440px, 768px, and 390px widths with no document-level horizontal overflow. Local browser validation used headless Chromium 133 because the runtime's default browser download was unavailable.
- Verified offline initial rendering with zero external requests, keyboard picks, reload persistence, export, reset, group edits, sorting, rejected/corrupt storage, and network failure handling.
- Streamlit `AppTest` passes for both entry points with Streamlit 1.65.0.
- `uv lock --check`, JavaScript syntax checks, static build, and `git diff --check` pass.

The optional ESPN/Wikipedia integrations have not been validated against a complete live tournament dataset in this review. Passing UI and engine tests does not certify the accuracy or availability of those sources. Native Safari and Firefox were not exercised.

## Publication

Review the draft PR, then merge the chosen version. Deploy only `dist/index.html` after running `python scripts/build_static.py`, or point an existing Streamlit deployment at `app.py`. CI builds an artifact but does not change hosting or publish automatically. Add the resulting live URL to the repository description and your portfolio after deployment.

No new production deployment or change to the public main branch is part of this review.
