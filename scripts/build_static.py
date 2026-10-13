"""Build the static portfolio deployment, excluding repository and archived files."""
from pathlib import Path
from shutil import copyfile

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'dist'
DEST.mkdir(exist_ok=True)
copyfile(ROOT / 'wc26_bracket.html', DEST / 'index.html')
print(f'Built {DEST / "index.html"}')
