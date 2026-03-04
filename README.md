# chrome-bookmark-manager

[![npm version](https://img.shields.io/npm/v/chrome-bookmark-manager)](https://npmjs.com/package/chrome-bookmark-manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Web%20Extension-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![CI Status](https://github.com/theluckystrike/chrome-bookmark-manager/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/chrome-bookmark-manager/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/chrome-bookmark-manager?style=social)](https://github.com/theluckystrike/chrome-bookmark-manager)

> **Built by [Zovo](https://zovo.one)** — Chrome extension bookmark utilities

A comprehensive Chrome Bookmarks API wrapper for extensions with search, deduplication, export, and folder management.

Part of the [Zovo](https://zovo.one) family of Chrome extension utilities.

## Features

- **Search Bookmarks**: Full-text search across titles and URLs
- **Deduplication**: Find and remove duplicate bookmarks
- **Export/Import**: JSON and HTML export formats
- **Folder Management**: Create, move, and organize folders
- **TypeScript Support**: Full type definitions included

## Installation

```bash
npm install chrome-bookmark-manager
```

## Quick Start

```typescript
import { BookmarkManager } from 'chrome-bookmark-manager';

const manager = new BookmarkManager();

// Get full bookmark tree
const tree = await manager.getTree();

// Search bookmarks
const results = await manager.search('typescript');

// Create bookmark
await manager.create({
  title: 'Zovo',
  url: 'https://zovo.one'
});

// Export bookmarks
const json = await manager.exportJSON();
const html = await manager.exportHTML();
```

## API Reference

### Methods

```typescript
// Get bookmark tree
getTree(): Promise<BookmarkTreeNode[]>;

// Search bookmarks
search(query: string): Promise<BookmarkNode[]>;

// Create bookmark
create(bookmark: BookmarkCreate): Promise<BookmarkNode>;

// Update bookmark
update(id: string, changes: Partial<BookmarkNode>): Promise<BookmarkNode>;

// Remove bookmark
remove(id: string): Promise<void>;

// Move bookmark
move(id: string, parentId: string, index?: number): Promise<BookmarkNode>;

// Export
exportJSON(): Promise<string>;
exportHTML(): Promise<string>;

// Import
importJSON(data: string): Promise<number>;
```

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/bookmark-improvement`
3. **Make** your changes
4. **Test** your changes
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/bookmark-improvement`
7. **Submit** a Pull Request

## See Also

### Related Zovo Repositories

- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) - Production-ready MV3 starter template
- [chrome-history-api](https://github.com/theluckystrike/chrome-history-api) - History API wrapper
- [chrome-download-manager](https://github.com/theluckystrike/chrome-download-manager) - Downloads API wrapper
- [zovo-types-webext](https://github.com/theluckystrike/zovo-types-webext) - TypeScript type definitions

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT — [Zovo](https://zovo.one)

---

Built by [Zovo](https://zovo.one)
