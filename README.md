# chrome-bookmark-manager

A typed wrapper around the Chrome Bookmarks API for Manifest V3 extensions. Covers CRUD, search, deduplication, export, and change monitoring with zero runtime dependencies.

All methods are static. Import the class you need and call it directly.

INSTALLATION

```bash
npm install chrome-bookmark-manager
```

Add the bookmarks permission to your manifest.json.

```json
{
  "permissions": ["bookmarks"]
}
```

USAGE

```typescript
import { BookmarkManager, BookmarkSearch, BookmarkIO } from 'chrome-bookmark-manager';
```

BOOKMARKMANAGER

Handles creation, updates, deletion, tree traversal, and deduplication.

```typescript
// Create a bookmark
const bm = await BookmarkManager.create('Zovo', 'https://zovo.one');

// Create a bookmark inside a specific folder
const bm2 = await BookmarkManager.create('Docs', 'https://docs.example.com', folderId);

// Create a folder
const folder = await BookmarkManager.createFolder('Reading List');

// Update title or URL
await BookmarkManager.update(bm.id, { title: 'New Title' });

// Move bookmark into a folder
await BookmarkManager.move(bm.id, folder.id);

// Delete a single bookmark
await BookmarkManager.remove(bm.id);

// Delete a folder and everything inside it
await BookmarkManager.remove(folder.id, true);

// Get the full bookmark tree
const tree = await BookmarkManager.getTree();

// Get children of a folder
const children = await BookmarkManager.getChildren(folder.id);

// Get recent bookmarks (defaults to 20)
const recent = await BookmarkManager.getRecent(10);

// Find duplicate URLs across all bookmarks
const dupes = await BookmarkManager.findDuplicates();
// Returns Map<string, BookmarkTreeNode[]> keyed by URL

// Count all bookmarks
const total = await BookmarkManager.count();
```

BOOKMARKSEARCH

Search and filter bookmarks by text, URL, title, or date range.

```typescript
// Full text search across titles and URLs
const results = await BookmarkSearch.search('typescript');

// Match by exact URL pattern
const github = await BookmarkSearch.searchByUrl('https://github.com/*');

// Match by title
const docs = await BookmarkSearch.searchByTitle('Documentation');

// Get bookmarks added in the last 7 days
const recent = await BookmarkSearch.getAddedSince(7);

// Check a list of bookmarks for broken links (HEAD request, 5s timeout, max 50)
const broken = await BookmarkSearch.findBroken(results);
```

BOOKMARKIO

Export bookmarks and listen for changes.

```typescript
// Download the full tree as a JSON file (defaults to bookmarks.json)
await BookmarkIO.exportJSON('my-bookmarks.json');

// Get all URLs as a newline-separated string
const urls = await BookmarkIO.exportURLList();

// Listen for bookmark events
BookmarkIO.onChange((type, id) => {
  // type is 'created' | 'removed' | 'changed' | 'moved'
  console.log(type, id);
});
```

TYPESCRIPT

The package ships type declarations. All return types use the standard chrome.bookmarks.BookmarkTreeNode from @types/chrome.

BUILD FROM SOURCE

```bash
git clone https://github.com/theluckystrike/chrome-bookmark-manager.git
cd chrome-bookmark-manager
npm install
npm run build
```

Output lands in dist/.

LICENSE

MIT. See LICENSE file.

---

Built at zovo.one
