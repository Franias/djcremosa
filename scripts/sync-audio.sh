#!/usr/bin/env bash
#
# sync-audio.sh — copy SoundCloud tracks from the local backup into
# public/audio/ before a static-export build. Idempotent: only copies
# files that are new or changed. Source paths are absolute and
# machine-specific; if your backup lives somewhere else, override
# AUDIO_SRC below.
#
# Why this script exists:
#   - /public/audio/*.mp3 is .gitignored so the repo stays small
#   - But the static export needs the audio at build time
#   - Before `npm run build` (and before the deploy workflow), this
#     script restores the files from your local backup.
#
# Usage:
#   ./scripts/sync-audio.sh                 # sync from default source
#   AUDIO_SRC=/path/to/other ./scripts/sync-audio.sh
#
# Filename mapping — source (as MediaHuman names them) → destination:
#   "20 minutinhos na maldade.mp3"      →  20-minutinhos.mp3
#   "Baguncinha #1.mp3"                 →  baguncinha-1.mp3
#   "Baguncinha [frita] #2.mp3"         →  baguncinha-frita-2.mp3
#   "baguncinha #3 tranquila em casa.mp3" → baguncinha-tranquila-em-casa.mp3
#   "bora dançar estilo cachorro.mp3"   →  bora-dancar-estilo-cachorro.mp3
#   "dance potranca dance com emoção.mp3" → dance-potranca-dance-com-emocao.mp3
#   "Destination Of Tamborzao.mp3"       →  destination-of-tamborzao.mp3
#

set -euo pipefail

# ──────────────── config ────────────────

AUDIO_SRC="${AUDIO_SRC:-$HOME/Music/Downloaded by MediaHuman/soundcloudtracks}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DEST="$PROJECT_DIR/public/audio"

# Each entry: "source filename|destination slug"
# Add new tracks here as you download them.
TRACKS=(
  "20 minutinhos na maldade.mp3|20-minutinhos"
  "Baguncinha #1.mp3|baguncinha-1"
  "Baguncinha [frita] #2.mp3|baguncinha-frita-2"
  "baguncinha #3 tranquila em casa.mp3|baguncinha-tranquila-em-casa"
  "bora dançar estilo cachorro.mp3|bora-dancar-estilo-cachorro"
  "dance potranca dance com emoção.mp3|dance-potranca-dance-com-emocao"
  "Destination Of Tamborzao.mp3|destination-of-tamborzao"
)

# ──────────────── guards ────────────────

if [[ ! -d "$AUDIO_SRC" ]]; then
  echo "❌ Source directory not found: $AUDIO_SRC"
  echo "   Set AUDIO_SRC=/path/to/your/backup to override." >&2
  exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
  echo "❌ rsync not found in PATH. Install with: brew install rsync" >&2
  exit 1
fi

mkdir -p "$DEST"
touch "$DEST/.gitkeep"

# ──────────────── sync ────────────────

echo "🎵 syncing audio: $AUDIO_SRC → $DEST"
echo ""

copied=0
skipped=0
missing=0

for entry in "${TRACKS[@]}"; do
  IFS='|' read -r src_name dst_slug <<< "$entry"
  src_path="$AUDIO_SRC/$src_name"
  dst_path="$DEST/${dst_slug}.mp3"

  if [[ ! -f "$src_path" ]]; then
    printf "  ❌ %-40s (not in source, skipped)\n" "$src_name"
    missing=$((missing + 1))
    continue
  fi

  size=$(du -h "$src_path" | awk '{print $1}')

  # Decide copy vs skip by comparing mtime + size.
  if [[ -f "$dst_path" ]] && \
     [[ "$(stat -f %m "$src_path" 2>/dev/null || stat -c %Y "$src_path")" \
        -le "$(stat -f %m "$dst_path" 2>/dev/null || stat -c %Y "$dst_path")" ]] && \
     [[ "$(stat -f %z "$src_path" 2>/dev/null || stat -c %s "$src_path")" \
        -eq "$(stat -f %z "$dst_path" 2>/dev/null || stat -c %s "$dst_path")" ]]; then
    printf "  = %-40s → %s.mp3 (%s) [up to date]\n" "$src_name" "$dst_slug" "$size"
    skipped=$((skipped + 1))
    continue
  fi

  # Copy with rsync (preserves mtime so subsequent runs skip cleanly).
  rsync -a --no-perms --chmod=u+rw "$src_path" "$dst_path"
  printf "  ✓ %-40s → %s.mp3 (%s) [copied]\n" "$src_name" "$dst_slug" "$size"
  copied=$((copied + 1))
done

echo ""
total=$(du -sh "$DEST" | awk '{print $1}')
echo "✅ $copied copied, $skipped up to date, $missing missing — $total total in $DEST"