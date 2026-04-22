# MR Links Extension

A lightweight browser extension that makes reading Marginal Revolution's assorted links posts easier by showing the referenced link above each comment.

## Installation

### Option 1: Install from Chrome Web Store (Recommended)

1. Visit the [MR Links extension on Chrome Web Store](https://chrome.google.com/webstore)
2. Click "Add to Chrome"
3. Confirm the permission prompt
4. Done! The extension is now active on all Marginal Revolution assorted links posts

### Option 2: Clone & Run Your Own Fork

If you want to modify the extension or run a custom version:

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mr-links-all.git
   cd mr-links-all/mr-links
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked"

5. Select the `mr-links/` directory from your cloned repo

6. The extension is now loaded. Any changes to `content.js` or `content.css` will take effect after a page refresh.

### Development Notes

- Manifest V3 requires reloading the extension after code changes
- To reload: Go to `chrome://extensions/`, find "MR Links", and click the refresh icon
- Test on: https://marginalrevolution.com/marginalrevolution/ (any assorted links post)

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

1. Navigate to any Marginal Revolution "Assorted Links" post (e.g., https://marginalrevolution.com/marginalrevolution/2026/04/tuesday-assorted-links-565.html)

2. Scroll to the comments section

3. Look for comments that reference a link number, such as:
   - `#2 – This is interesting...`
   - `4. Why leave out...`
   - `Following up on 7)`

4. You should see a blue banner above each comment showing the title and URL of the referenced link

5. Click the banner to open the link in a new tab

## Design

- **URL guard:** Only activates on assorted-links posts (not every MR page)
- **Link parsing:** Handles both `<ol>` lists and numbered paragraphs
- **Reference detection:** Regex-based, finds `#X`, `X.`, `X)` patterns
- **Non-intrusive:** Light styling, inserted between author line and comment text
- **Performance:** Vanilla JS, no dependencies, minimal DOM overhead

## Privacy

MR Links does not collect, store, or transmit any user data. The extension only operates on marginalrevolution.com and performs all processing locally in your browser.
