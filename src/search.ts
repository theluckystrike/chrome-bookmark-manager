/**
 * Bookmark Search — Advanced bookmark search and filtering
 */

export class BookmarkSearchError extends Error {
    constructor(
        message: string,
        public code: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'BookmarkSearchError';
        if (originalError?.stack) {
            this.stack = originalError.stack;
        }
    }
}

export const BookmarkSearchErrorCode = {
    SEARCH_FAILED: 'SEARCH_FAILED',
    INVALID_PARAMS: 'INVALID_PARAMS',
    BROKEN_CHECK_FAILED: 'BROKEN_CHECK_FAILED',
} as const;

export class BookmarkSearch {
    /** Search by query */
    static async search(query: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        if (!query || query.trim() === '') {
            throw new BookmarkSearchError(
                'Search query cannot be empty.',
                BookmarkSearchErrorCode.INVALID_PARAMS
            );
        }
        try {
            return await chrome.bookmarks.search(query);
        } catch (error) {
            const err = error as Error;
            throw new BookmarkSearchError(
                `Search failed for "${query}": ${err.message}.`,
                BookmarkSearchErrorCode.SEARCH_FAILED,
                err
            );
        }
    }

    /** Search by URL pattern */
    static async searchByUrl(urlPattern: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        if (!urlPattern || urlPattern.trim() === '') {
            throw new BookmarkSearchError(
                'URL pattern cannot be empty.',
                BookmarkSearchErrorCode.INVALID_PARAMS
            );
        }
        try {
            return await chrome.bookmarks.search({ url: urlPattern });
        } catch (error) {
            const err = error as Error;
            throw new BookmarkSearchError(
                `URL search failed for pattern "${urlPattern}": ${err.message}.`,
                BookmarkSearchErrorCode.SEARCH_FAILED,
                err
            );
        }
    }

    /** Search by title */
    static async searchByTitle(title: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        if (!title || title.trim() === '') {
            throw new BookmarkSearchError(
                'Title cannot be empty.',
                BookmarkSearchErrorCode.INVALID_PARAMS
            );
        }
        try {
            return await chrome.bookmarks.search({ title });
        } catch (error) {
            const err = error as Error;
            throw new BookmarkSearchError(
                `Title search failed for "${title}": ${err.message}.`,
                BookmarkSearchErrorCode.SEARCH_FAILED,
                err
            );
        }
    }

    /** Get bookmarks added in last N days */
    static async getAddedSince(days: number): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        if (days < 1) {
            throw new BookmarkSearchError(
                `Invalid days parameter: ${days}. Must be at least 1.`,
                BookmarkSearchErrorCode.INVALID_PARAMS
            );
        }
        try {
            const all = await chrome.bookmarks.getRecent(1000);
            const cutoff = Date.now() - (days * 86400000);
            return all.filter((b) => b.dateAdded && b.dateAdded >= cutoff);
        } catch (error) {
            const err = error as Error;
            throw new BookmarkSearchError(
                `Failed to get bookmarks from last ${days} days: ${err.message}.`,
                BookmarkSearchErrorCode.SEARCH_FAILED,
                err
            );
        }
    }

    /** Find broken bookmarks (HTTP check) */
    static async findBroken(bookmarks: chrome.bookmarks.BookmarkTreeNode[]): Promise<{
        broken: chrome.bookmarks.BookmarkTreeNode[];
        errors: Array<{ bookmark: chrome.bookmarks.BookmarkTreeNode; error: string }>
    }> {
        const broken: chrome.bookmarks.BookmarkTreeNode[] = [];
        const errors: Array<{ bookmark: chrome.bookmarks.BookmarkTreeNode; error: string }> = [];
        
        for (const bookmark of bookmarks.slice(0, 50)) {
            if (!bookmark.url) continue;
            try {
                const resp = await fetch(bookmark.url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
                if (!resp.ok) broken.push(bookmark);
            } catch (error) {
                const err = error as Error;
                broken.push(bookmark);
                errors.push({ 
                    bookmark, 
                    error: err.message || 'Network request failed (timeout, CORS, or invalid URL)' 
                });
            }
        }
        return { broken, errors };
    }
}
