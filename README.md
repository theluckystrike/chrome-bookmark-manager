# chrome-bookmark-manager — Bookmarks API Wrapper for Chrome Extensions

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Built by [Zovo](https://zovo.one)**

**Chrome bookmarks API wrapper** — CRUD, search, duplicate detection, broken link finder, import/export, and change monitoring.

## 🚀 Quick Start
```typescript
import { BookmarkManager, BookmarkSearch, BookmarkIO } from 'chrome-bookmark-manager';
await BookmarkManager.create('My Page', 'https://example.com');
const dupes = await BookmarkManager.findDuplicates();
const recent = await BookmarkSearch.getAddedSince(7); // last 7 days
BookmarkIO.onChange((type, id) => console.log(type, id));
```

## 📄 License
MIT — [Zovo](https://zovo.one)
