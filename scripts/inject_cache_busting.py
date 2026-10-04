#!/usr/bin/env python3
"""
Automatically injects cache-busting version query params (?v=<sha>)
into relative .css and .js references in all HTML files within a directory.
Usage:
    python3 scripts/inject_cache_busting.py [directory] [version_string]
"""

import sys
import os
import re
import glob


def inject_cache_busting(target_dir="dist", version=None):
    if not version:
        version = os.environ.get("GITHUB_SHA", "")[:8] or "dev"
    else:
        version = version[:8]

    pattern = re.compile(
        r'((?:href|src)=["\'])([^"\':]+?\.(?:css|js))(?:\?[^"\']*)?(["\'])'
    )

    count = 0
    for root, _, files in os.walk(target_dir):
        for f in files:
            if f.endswith(".html"):
                file_path = os.path.join(root, f)
                with open(file_path, "r", encoding="utf-8") as fp:
                    content = fp.read()

                updated, n = pattern.subn(rf"\1\2?v={version}\3", content)
                if n > 0:
                    with open(file_path, "w", encoding="utf-8") as fp:
                        fp.write(updated)
                    print(f"[{f}] injected version ?v={version} ({n} references)")
                    count += n

    print(f"Cache-busting complete: {count} references updated in '{target_dir}'.")


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "dist"
    ver = sys.argv[2] if len(sys.argv) > 2 else None
    inject_cache_busting(target, ver)
