# The Dynamic Table

**A 48-team tournament simulator by Kevin Cardoso.**

Explore how group standings become a knockout bracket, choose winners, and follow a path to the trophy. The interface takes its visual cue from a football sticker album, while the underlying problem is a dependency graph: changing an early result can invalidate later choices.

> **Portfolio demo:** bundled scores are an illustrative scenario, not verified historical results. The demo works without external services. Experimental result imports are optional and off by default.

## Try it

Open `wc26_bracket.html` in a modern browser, or serve it locally:

```bash
python -m http.server 8000
# Open http://localhost:8000/wc26_bracket.html
```

1. Start with **From R32** and choose a winner in each match.
2. Continue through the later rounds to select your champion.
3. Change an early pick: incompatible later picks clear automatically.
4. Use **Show all fixtures** to change a group score and explore qualification.
5. Export your scenario as JSON, or restart the demo.

Picks save to browser storage when available. Export provides a portable copy; importing exported scenario files is not currently implemented.

## What this demonstrates

- **Product design:** an accessible entry point into a complicated competition, with a full bracket on desktop and readable round-by-round cards on mobile.
- **State modeling:** recursive winner/loser dependencies, downstream pick invalidation, and a third-place match built from semi-final losers.
- **Data integrity:** explicit separation between scenario scores, user picks, and externally imported results. Later-round imports cannot use hypothetical feeder winners.
- **Resilience:** an offline-first core, validated saved fixtures, bounded external requests, and honest storage/network error states.
- **Delivery:** a zero-build static application with an optional Streamlit wrapper and regression tests.

## Architecture

`wc26_bracket.html` contains the styles, artwork, seed data, and browser logic. It has no runtime JavaScript dependencies. Keeping this small prototype self-contained makes it easy to host or open locally; extracting the bracket engine into modules would be the next step if the feature set grows.

| Component | Responsibility |
| --- | --- |
| Standings engine | Rebuild group tables from the 72 sample fixtures; resolve tied groups and rank third-place teams. |
| Bracket graph | Resolve round-of-32 seeds, propagate winners and losers, clear invalid picks. |
| Browser state | Persist one local scenario; reset to bundled data; export JSON. |
| Optional adapters | Request ESPN knockout scores or Wikipedia player reference data on explicit user action. |
| `app.py` | Embed the same HTML in Streamlit; `streamlit_app.py` is a compatibility entry point. |

## Scope and limitations

- This is a **scenario explorer**, not an official results service or calibrated prediction model.
- The dataset and group membership are inherited from the prototype and are not certified as a historical tournament record.
- Only three third-place allocation rows are bundled. Other combinations receive a prominently labeled provisional compatible assignment; a valid assignment is not necessarily the official one.
- Missing conduct/ranking inputs use deterministic fallback ordering. Tiebreak decisions involving those inputs should not be represented as authoritative.
- Team statistics describe the scenario and imported scores, not hypothetical picks. Shootout advancement is currently counted as a win/loss in that table.
- Result imports are experimental, may be incomplete, and depend on provider schemas and browser CORS policies. The sample qualifiers may differ from real qualifiers. There is no automatic polling.
- Player reference data is separate from the scenario; the Wikipedia parser may be unavailable after page layout changes.
- Browser storage is local to an origin/profile. No account sync, analytics, or application backend is included.

## Validation

Node.js 22+ runs the dependency-free engine regression suite:

```bash
node --test tests/bracket.test.cjs
```

It covers unique qualifiers, a full tournament path, downstream invalidation, shootouts, rejection of speculative imported results, saved fixture validation, and all 495 third-place combinations. These tests verify internal behavior, not official tournament data.

Browser smoke tests use Playwright:

```bash
npm ci
npx playwright install chromium
npm run test:browser
```

## Publish as a static site

```bash
python scripts/build_static.py
# Deploy the contents of dist/ to your static host.
```

The build contains only `index.html`; old prototypes, Python files, and tests are excluded. The CI workflow runs regression checks and produces a downloadable static-site artifact. It does not publish automatically.

## Optional Streamlit hosting

The wrapper is pinned to Streamlit 1.65.0, with Python 3.14+ and a committed `uv.lock`:

```bash
uv sync --locked
uv run streamlit run app.py
```

Alternatively: `pip install -r requirements.txt`, then `streamlit run app.py`. For Streamlit Community Cloud, use `app.py` as the entry point. The static version is the preferred portfolio experience because it avoids a server startup and nested page scrolling.

## Sources and credits

The original prototype used public [ESPN scoreboards](https://www.espn.com/soccer/) and [Wikipedia tournament pages](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup), with the [FIFA tournament](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026) as the format reference. Links and inherited source labels are not evidence that the bundled scenario is verified. Wikipedia material is subject to its applicable attribution/share-alike terms. Existing inline flag illustrations and flipbook artwork are retained from the original project.

Independent portfolio project; no affiliation with FIFA, ESPN, or Panini. Repository code is under the existing Apache 2.0 license; that license does not grant rights to third-party marks or source material.
