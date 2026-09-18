#!/bin/bash
# Regenera public/og-image.png (1200x630): SVG -> rsvg-convert -> PNG.
# Requiere: librsvg, imagemagick, woff2 (brew install librsvg imagemagick woff2).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# IBM Plex Mono vive como woff2 en node_modules; fontconfig solo lee sfnt.
mkdir -p "$TMP/fonts"
for w in 400 500 600; do
  cp "$ROOT/node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-$w-normal.woff2" "$TMP/fonts/"
  woff2_decompress "$TMP/fonts/ibm-plex-mono-latin-$w-normal.woff2"
done
cat > "$TMP/fonts.conf" <<CONF
<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig><dir>$TMP/fonts</dir><dir>/System/Library/Fonts</dir><cachedir>$TMP/fccache</cachedir></fontconfig>
CONF

# La captura trae alpha y una franja vacia abajo: se recorta la ventana y se aplana.
magick "$ROOT/public/shots/charge.png" -crop 883x445+55+37 +repage \
  -background '#1e1e1f' -alpha remove -alpha off "$TMP/shot.png" 2>/dev/null
SHOT=$(base64 -i "$TMP/shot.png")

cat > "$TMP/og-image.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="icon-base" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b3747"/><stop offset="0.55" stop-color="#18202b"/><stop offset="1" stop-color="#0c1117"/>
    </linearGradient>
    <linearGradient id="icon-green" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6ee08a"/><stop offset="1" stop-color="#2eae5e"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#43cd72" stop-opacity="0.15"/><stop offset="1" stop-color="#43cd72" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="shot-clip"><rect x="570" y="164" width="600" height="302" rx="14"/></clipPath>
    <filter id="shot-shadow" x="-25%" y="-25%" width="150%" height="170%">
      <feDropShadow dx="0" dy="20" stdDeviation="28" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="#0a0f15"/>
  <ellipse cx="880" cy="310" rx="470" ry="340" fill="url(#glow)"/>
  <rect width="1200" height="5" fill="#43cd72"/>

  <svg x="72" y="92" width="104" height="104" viewBox="0 0 1024 1024">
    <rect width="1024" height="1024" rx="230" fill="url(#icon-base)"/>
    <rect x="4" y="4" width="1016" height="1016" rx="228" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="8"/>
    <rect x="180" y="330" width="600" height="364" rx="78" fill="rgba(0,0,0,0.32)" stroke="#eef2f6" stroke-width="40"/>
    <rect x="800" y="436" width="54" height="152" rx="27" fill="#eef2f6"/>
    <rect x="224" y="374" width="317.44" height="276" rx="36" fill="url(#icon-green)"/>
    <g stroke="rgba(238,242,246,0.30)" stroke-width="14" stroke-linecap="round">
      <line x1="572" y1="424" x2="572" y2="600"/><line x1="628" y1="452" x2="628" y2="572"/><line x1="684" y1="424" x2="684" y2="600"/>
    </g>
    <rect x="224" y="374" width="512" height="276" rx="36" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="6"/>
  </svg>

  <text x="72" y="282" font-family="IBM Plex Mono SemiBold" font-size="54" fill="#f2f5f8">OpenBattery</text>
  <text x="74" y="336" font-family="IBM Plex Mono" font-size="24" fill="#a7b2bf">See what your battery</text>
  <text x="74" y="372" font-family="IBM Plex Mono" font-size="24" fill="#a7b2bf">is actually doing.</text>

  <g font-family="IBM Plex Mono Medium" font-size="26">
    <text x="74" y="458" fill="#c5cfda">97%</text>
    <text x="150" y="458" fill="#43cd72">+8.6 W</text>
    <text x="274" y="458" fill="#c5cfda">4,991 mAh</text>
  </g>

  <line x1="74" y1="496" x2="470" y2="496" stroke="rgba(238,242,246,0.14)" stroke-width="1"/>
  <text x="74" y="532" font-family="IBM Plex Mono" font-size="17" fill="#8f9cab">macOS 14+  ·  Apple Silicon</text>

  <rect x="570" y="164" width="600" height="302" rx="14" fill="#1e1e1f" filter="url(#shot-shadow)"/>
  <image x="570" y="164" width="600" height="302" clip-path="url(#shot-clip)" preserveAspectRatio="xMidYMin slice"
         xlink:href="data:image/png;base64,$SHOT"/>
  <rect x="570.5" y="164.5" width="599" height="301" rx="13.5" fill="none" stroke="rgba(238,242,246,0.16)" stroke-width="1"/>
</svg>
SVG

# PANGOCAIRO_BACKEND=fc: en macOS pango usa CoreText por defecto e ignora fonts.conf.
PANGOCAIRO_BACKEND=fc FONTCONFIG_FILE="$TMP/fonts.conf" \
  rsvg-convert -w 1200 -h 630 -o "$TMP/og-image.png" "$TMP/og-image.svg"
magick "$TMP/og-image.png" -strip -define png:color-type=2 "$ROOT/public/og-image.png"
echo "public/og-image.png regenerado"
