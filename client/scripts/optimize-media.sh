#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# CORN — media optimization pipeline (macOS, no ffmpeg required)
#
# Masters (high-resolution originals) live in  ./media-masters  (repo root) and
# are copied/derived into  client/public/media/images  for the site.
#
# The site serves ONE responsive set per image:
#   • AVIF + JPG at several widths (mobile → desktop → 4K)
#   • the 5000×5000 masters stay as the largest srcset entry (5000w), so
#     large/4K displays get true 4K imagery while phones download ~40 KB.
#
# To re-run after adding images:
#   bash client/scripts/optimize-media.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
IMG_DIR="$ROOT/client/public/media/images"

# ── 1. Master masters (5000×5000, 4K+) ─────────────────────────────────────
# cob-sky-4k.jpg        — sunlit corn cob against blue sky (hero)
# cob-woven-mat-4k.jpg  — corn cob on woven mat (origin / harvest scene)
# (byte-duplicate of cob-sky-4k.jpg previously shipped as corn-closeup-02.jpg
#  has been removed — the gallery showed the same photo twice.)
# ── 2. Small field photos (real photos, 417–626 px native) ─────────────────
SMALL_FILES="corn-harvest.jpg corn-varieties.jpg nutrition-banner.jpg recipe-01.jpg recipe-02.jpg recipe-03.jpg"

# Widths for the 4K masters (derived on top of the 5000w master)
MEGA_WIDTHS="640 1080 1920 3840"
# Widths for small photos (never upscale beyond native width)
SMALL_WIDTHS="320 480"

have_sips() { command -v sips >/dev/null 2>&1; }

if ! have_sips; then
  echo "error: sips is required (macOS). Aborting." >&2
  exit 1
fi

# native width of an image (px)
native_width() { sips -g pixelWidth "$1" | awk '/pixelWidth/{print $2}'; }

gen() { # gen <src> <width>
  local src="$1" w="$2" stem="${1%.jpg}"
  local jpg="${stem}-${w}.jpg" avif="${stem}-${w}.avif"
  sips -s format jpeg -s formatOptions 82 --resampleWidth "$w" --out "$jpg" "$src" >/dev/null
  sips -s format avif --out "$avif" "$jpg" >/dev/null
  echo "  ${jpg##*/} + ${avif##*/}"
}

echo "▸ Deriving responsive sets in $IMG_DIR"
for f in cob-sky-4k.jpg cob-woven-mat-4k.jpg; do
  echo "  $f (master $(native_width "$IMG_DIR/$f")px)"
  for w in $MEGA_WIDTHS; do gen "$IMG_DIR/$f" "$w"; done
done

for f in $SMALL_FILES; do
  nw="$(native_width "$IMG_DIR/$f")"
  echo "  $f (native ${nw}px)"
  for w in $SMALL_WIDTHS; do
    if [ "$w" -lt "$nw" ]; then gen "$IMG_DIR/$f" "$w"; fi
  done
  # native-width AVIF so desktop browsers can still pick AVIF
  stem="${f%.jpg}"
  sips -s format avif --out "$IMG_DIR/${stem}-${nw}.avif" "$IMG_DIR/$f" >/dev/null
  echo "  ${stem}-${nw}.avif"
done

echo "✔ done. Long-term cache headers for /media/* are set in netlify.toml."
echo ""
echo "── Adding licensed 4K VIDEO (optional) ──────────────────────────────"
echo "  The shipped stock previews are watermarked Shutterstock files, so the"
echo "  site uses watermark-free 4K imagery with cinematic motion instead."
echo "  When you have licensed footage, drop it in as:"
echo "    client/public/media/videos/harvest-4k.mp4   (3840×2160, faststart)"
echo "  then replace <CinematicScene> with <VideoScene src=... poster=... />"
echo "  (VideoScene already handles play-on-scroll + posters + metadata preload)."
