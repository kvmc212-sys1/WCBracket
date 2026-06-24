# The Dynamic Table — FIFA World Cup 26 bracket

A self-contained, Panini-style knockout bracket with inlined country flags and a
"Refresh from Wikipedia" button that pulls live group standings client-side
(no backend, no API key).

## Run locally
```bash
pip install -r requirements.txt
streamlit run app.py
```

## Deploy on Streamlit Community Cloud
1. Push these three files to a public GitHub repo:
   - `app.py`
   - `requirements.txt`
   - `wc26_bracket.html`
2. Go to https://share.streamlit.io , click **New app**, pick the repo/branch,
   set **Main file path** to `app.py`, and deploy.

## Notes
- `app.py` embeds the bracket via `st.components.v1.html`, which renders it in a
  sandboxed iframe. The Wikipedia fetch uses `origin=*` CORS, so it works from
  that iframe with no proxy.
- If there is too much or too little blank space under the bracket, change the
  `height=` value in `app.py`.
- The bracket itself can also be opened directly as a plain `.html` file or
  hosted on any static host (e.g. Cloudflare Pages) without Streamlit.
