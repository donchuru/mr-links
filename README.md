# MRU Links Extension

A lightweight browser extension that makes reading Marginal Revolution's assorted links posts easier by showing the referenced link above each comment.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `/Users/donchuru/programming/projects/mru-links/` directory

## How It Works

When you visit a Marginal Revolution "assorted links" post:

1. The extension parses the numbered links from the post (1-10 links)
2. It scans each comment for references: `#X`, `X.`, or `X)`
3. For each reference, it injects a small banner above the comment showing the link's title and URL
4. Click the banner to open the link in a new tab

## Files

- `manifest.json` — Extension configuration (Manifest V3)
- `content.js` — Main logic: parses links, finds references, injects banners
- `content.css` — Styles for the injected banners
- `icons/` — Extension icons (16x48x128 px)

## Testing

Visit: https://marginalrevolution.com/marginalrevolution/2026/04/tuesday-assorted-links-565.html

Look for comments that reference a link number (like "4. Why leave out..." or "#2 – This is...") — you should see a blue banner above the comment with the original link.

## Design

- **URL guard:** Only activates on assorted-links posts (not every MR page)
- **Link parsing:** Handles both `<ol>` lists and numbered paragraphs
- **Reference detection:** Regex-based, finds `#X`, `X.`, `X)` patterns
- **Non-intrusive:** Light styling, inserted between author line and comment text
- **Performance:** Vanilla JS, no dependencies, minimal DOM overhead
