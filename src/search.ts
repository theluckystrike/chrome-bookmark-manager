/**
 * Bookmark Search — Advanced bookmark search and filtering
 */
export class BookmarkSearch {
    /** Search by query */
    static async search(query: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        return chrome.bookmarks.search(query);
    }

    /** Search by URL pattern */
    static async searchByUrl(urlPattern: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        return chrome.bookmarks.search({ url: urlPattern });
    }

    /** Search by title */
    static async searchByTitle(title: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        return chrome.bookmarks.search({ title });
    }

    /** Get bookmarks added in last N days */
    static async getAddedSince(days: number): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        const all = await chrome.bookmarks.getRecent(1000);
        const cutoff = Date.now() - (days * 86400000);
        return all.filter((b) => b.dateAdded && b.dateAdded >= cutoff);
    }

    /** Find broken bookmarks (HTTP check) */
    static async findBroken(bookmarks: chrome.bookmarks.BookmarkTreeNode[]): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        const broken: chrome.bookmarks.BookmarkTreeNode[] = [];
        for (const bookmark of bookmarks.slice(0, 50)) {
            if (!bookmark.url) continue;
            try {
                const resp = await fetch(bookmark.url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
                if (!resp.ok) broken.push(bookmark);
            } catch { broken.push(bookmark); }
        }
        return broken;
    }
}
