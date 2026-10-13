"""Optional Streamlit host for The Dynamic Table portfolio demo."""
from pathlib import Path
import streamlit as st

st.set_page_config(page_title="The Dynamic Table | Kevin Cardoso", page_icon="⚽", layout="wide")

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

# The repository-owned HTML is trusted; never replace it with user-supplied HTML.
st.iframe(
    Path(__file__).with_name("wc26_bracket.html"),
    height="content",
    alt="The Dynamic Table tournament simulator",
)
