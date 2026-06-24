"""
The Dynamic Table — FIFA World Cup 26 live knockout bracket.
Renders the self-contained bracket (inline flags + Wikipedia refresh button) inside Streamlit.
Deploy: push this folder to GitHub, then create an app on https://share.streamlit.io
with app.py as the entry point. Run locally: streamlit run app.py
"""
from pathlib import Path
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="The Dynamic Table ⚽", page_icon="⚽", layout="wide")

# strip Streamlit's default chrome/padding so the bracket gets the full width
st.markdown(
    """
    <style>
      .block-container{padding:0.4rem 0.6rem 1rem;max-width:100%;}
      header[data-testid="stHeader"]{height:0;background:transparent;}
      #MainMenu, footer{visibility:hidden;}
      .stApp{background:#e9edf3;}
    </style>
    """,
    unsafe_allow_html=True,
)

html = Path(__file__).with_name("wc26_bracket.html").read_text(encoding="utf-8")

# The bracket scrolls sideways on its own; this iframe handles vertical scroll.
# Adjust `height` if you see too much or too little blank space below.
components.html(html, height=2100, scrolling=True)
