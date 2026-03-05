/**
 * chrome-bookmark-manager - Quick Start Example
 * 
 * NOTE: All methods are STATIC - use BookmarkManager directly, not an instance!
 * Requires "bookmarks" permission in manifest.json.
 */

import { BookmarkManager, BookmarkSearch, BookmarkIO } from 'chrome-bookmark-manager';

// ============================================================================
// BASIC CRUD OPERATIONS
// ============================================================================

// Get all bookmarks
const tree = await BookmarkManager.getTree();
console.log('Root folders:', tree.map(n => n.title));

// Create a bookmark
const bookmark = await BookmarkManager.create('Zovo', 'https://zovo.one');
console.log('Created:', bookmark.id);

// Create a folder
const folder = await BookmarkManager.createFolder('My Projects');
console.log('Created folder:', folder.id);

// Update bookmark
await BookmarkManager.update(bookmark.id, { title: 'Zovo Developer Tools' });

// Move to folder
if (folder.id) await BookmarkManager.move(bookmark.id, folder.id);

// Delete bookmark
await BookmarkManager.remove(bookmark.id);

// Delete folder with contents
await BookmarkManager.remove(folder.id, true);

// ============================================================================
// SEARCH & QUERY
// ============================================================================

// Search by text (matches title and URL)
const results = await BookmarkSearch.query('github');
console.log('Found:', results.length);

// Get recent bookmarks
const recent = await BookmarkManager.getRecent(5);

// Get folder children
if (folder.id) {
  const children = await BookmarkManager.getChildren(folder.id);
}

// ============================================================================
// EXPORT / IMPORT
// ============================================================================

// Export to JSON
const jsonData = await BookmarkIO.exportJSON();
const data = JSON.parse(jsonData);

// Export to HTML (browser-importable)
const htmlData = await BookmarkIO.exportHTML();

// Import from JSON
const imported = await BookmarkIO.importJSON(jsonData);

// ============================================================================
// UTILITIES
// ============================================================================

// Find duplicate URLs
const duplicates = await BookmarkManager.findDuplicates();

// Count total bookmarks
const total = await BookmarkManager.count();
console.log('Total bookmarks:', total);

export { tree, bookmark, folder, results, recent, jsonData, htmlData, total };
