/**
 * Bookmark Manager — CRUD operations on Chrome bookmarks
 */

export class BookmarkError extends Error {
    constructor(
        message: string,
        public code: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'BookmarkError';
        if (originalError?.stack) {
            this.stack = originalError.stack;
        }
    }
}

export const BookmarkErrorCode = {
    CREATE_FAILED: 'CREATE_FAILED',
    MOVE_FAILED: 'MOVE_FAILED',
    UPDATE_FAILED: 'UPDATE_FAILED',
    REMOVE_FAILED: 'REMOVE_FAILED',
    NOT_FOUND: 'NOT_FOUND',
    INVALID_PARAMS: 'INVALID_PARAMS',
} as const;

/**
 * Bookmark Manager — CRUD operations on Chrome bookmarks
 */
export class BookmarkManager {
    /** Create a bookmark */
    static async create(title: string, url: string, parentId?: string): Promise<chrome.bookmarks.BookmarkTreeNode> {
        try {
            return await chrome.bookmarks.create({ title, url, parentId });
        } catch (error) {
            const err = error as Error;
            throw new BookmarkError(
                `Failed to create bookmark "${title}": ${err.message}. ` +
                `Verify that the URL is valid and you have permission to create bookmarks.`,
                BookmarkErrorCode.CREATE_FAILED,
                err
            );
        }
    }

    /** Create a folder */
    static async createFolder(title: string, parentId?: string): Promise<chrome.bookmarks.BookmarkTreeNode> {
        try {
            return await chrome.bookmarks.create({ title, parentId });
        } catch (error) {
            const err = error as Error;
            throw new BookmarkError(
                `Failed to create folder "${title}": ${err.message}. ` +
                `Check if you have permission to create bookmarks.`,
                BookmarkErrorCode.CREATE_FAILED,
                err
            );
        }
    }

    /** Move bookmark to folder */
    static async move(id: string, parentId: string, index?: number): Promise<void> {
        try {
            await chrome.bookmarks.move(id, { parentId, index });
        } catch (error) {
            const err = error as Error;
            throw new BookmarkError(
                `Failed to move bookmark ${id} to folder ${parentId}: ${err.message}. ` +
                `Ensure the bookmark and destination folder exist.`,
                BookmarkErrorCode.MOVE_FAILED,
                err
            );
        }
    }

    /** Update title or URL */
    static async update(id: string, changes: { title?: string; url?: string }): Promise<void> {
        try {
            await chrome.bookmarks.update(id, changes);
        } catch (error) {
            const err = error as Error;
            throw new BookmarkError(
                `Failed to update bookmark ${id}: ${err.message}. ` +
                `Ensure the bookmark exists and the changes are valid.`,
                BookmarkErrorCode.UPDATE_FAILED,
                err
            );
        }
    }

    /** Delete bookmark or folder */
    static async remove(id: string, recursive: boolean = false): Promise<void> {
        try {
            if (recursive) {
                await chrome.bookmarks.removeTree(id);
            } else {
                await chrome.bookmarks.remove(id);
            }
        } catch (error) {
            const err = error as Error;
            throw new BookmarkError(
                `Failed to remove bookmark/folder ${id}: ${err.message}. ` +
                `If removing a folder with children, use recursive=true.`,
                BookmarkErrorCode.REMOVE_FAILED,
                err
            );
        }
    }

    /** Get full bookmark tree */
    static async getTree(): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        try {
            return await chrome.bookmarks.getTree();
        } catch (error) {
            const err = error as Error;
            throw new BookmarkError(
                `Failed to get bookmark tree: ${err.message}. ` +
                `Check if the extension has bookmark permissions.`,
                BookmarkErrorCode.NOT_FOUND,
                err
            );
        }
    }

    /** Get children of a folder */
    static async getChildren(folderId: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        try {
            return await chrome.bookmarks.getChildren(folderId);
        } catch (error) {
            const err = error as Error;
            throw new BookmarkError(
                `Failed to get children of folder ${folderId}: ${err.message}. ` +
                `Ensure the folder exists.`,
                BookmarkErrorCode.NOT_FOUND,
                err
            );
        }
    }

    /** Get recent bookmarks */
    static async getRecent(count: number = 20): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        if (count < 1 || count > 100) {
            throw new BookmarkError(
                `Invalid count: ${count}. Must be between 1 and 100.`,
                BookmarkErrorCode.INVALID_PARAMS
            );
        }
        try {
            return await chrome.bookmarks.getRecent(count);
        } catch (error) {
            const err = error as Error;
            throw new BookmarkError(
                `Failed to get recent bookmarks: ${err.message}.`,
                BookmarkErrorCode.NOT_FOUND,
                err
            );
        }
    }

    /** Find duplicate URLs */
    static async findDuplicates(): Promise<Map<string, chrome.bookmarks.BookmarkTreeNode[]>> {
        const tree = await this.getTree();
        const urlMap = new Map<string, chrome.bookmarks.BookmarkTreeNode[]>();
        const walk = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
            for (const node of nodes) {
                if (node.url) {
                    const list = urlMap.get(node.url) || [];
                    list.push(node);
                    urlMap.set(node.url, list);
                }
                if (node.children) walk(node.children);
            }
        };
        walk(tree);
        return new Map([...urlMap].filter(([, nodes]) => nodes.length > 1));
    }

    /** Count all bookmarks */
    static async count(): Promise<number> {
        const tree = await this.getTree();
        let count = 0;
        const walk = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
            for (const node of nodes) { if (node.url) count++; if (node.children) walk(node.children); }
        };
        walk(tree);
        return count;
    }
}
