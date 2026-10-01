"""Download the three existing web fonts and localize the exported CSS URLs."""

from pathlib import Path
import sys
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
FONT_DIR = ROOT / "dist" / "assets" / "fonts"
CSS_PATH = ROOT / "dist" / "style.css"
FONTS = {
    "NAMU.woff2": "https://db.onlinewebfonts.com/t/122548962e9f69bf995caeddeb2e69b0.woff2",
    "FixelText-Regular.woff2": "https://cdn.jsdelivr.net/npm/@nonsuch/component-library@0.52.0/fonts/files/FixelText-Regular.woff2",
    "FixelText-SemiBold.woff2": "https://cdn.jsdelivr.net/npm/@nonsuch/component-library@0.52.0/fonts/files/FixelText-SemiBold.woff2",
}


def main():
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    css = CSS_PATH.read_text(encoding="utf-8")
    failed = []
    for name, url in FONTS.items():
        target = FONT_DIR / name
        try:
            if target.is_file() and target.read_bytes()[:4] == b"wOF2":
                data = target.read_bytes()
            else:
                request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(request, timeout=20) as response:
                    data = response.read()
            if data[:4] != b"wOF2":
                raise ValueError("The response is not a WOFF2 font")
            temporary = target.with_suffix(".tmp")
            temporary.write_bytes(data)
            temporary.replace(target)
            css = css.replace(url, "assets/fonts/" + name)
            print("Saved:", name)
        except Exception as error:
            failed.append(name)
            print("Could not download {}: {}".format(name, error), file=sys.stderr)
    CSS_PATH.write_text(css, encoding="utf-8")
    if failed:
        print("External CSS URLs remain for: " + ", ".join(failed), file=sys.stderr)
        return 1
    print("All three fonts are local. Restart or refresh your browser.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
