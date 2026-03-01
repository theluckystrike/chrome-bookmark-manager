/**
 * Bookmark Manager — CRUD operations on Chrome bookmarks
 */
export class BookmarkManager {
    /** Create a bookmark */
    static async create(title: string, url: string, parentId?: string): Promise<chrome.bookmarks.BookmarkTreeNode> {
        return chrome.bookmarks.create({ title, url, parentId });
    }

    /** Create a folder */
    static async createFolder(title: string, parentId?: string): Promise<chrome.bookmarks.BookmarkTreeNode> {
        return chrome.bookmarks.create({ title, parentId });
    }

    /** Move bookmark to folder */
    static async move(id: string, parentId: string, index?: number): Promise<void> {
        await chrome.bookmarks.move(id, { parentId, index });
    }

    /** Update title or URL */
    static async update(id: string, changes: { title?: string; url?: string }): Promise<void> {
        await chrome.bookmarks.update(id, changes);
    }

    /** Delete bookmark or folder */
    static async remove(id: string, recursive: boolean = false): Promise<void> {
        if (recursive) await chrome.bookmarks.removeTree(id);
        else await chrome.bookmarks.remove(id);
    }

    /** Get full bookmark tree */
    static async getTree(): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        return chrome.bookmarks.getTree();
    }

    /** Get children of a folder */
    static async getChildren(folderId: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        return chrome.bookmarks.getChildren(folderId);
    }

    /** Get recent bookmarks */
    static async getRecent(count: number = 20): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
        return chrome.bookmarks.getRecent(count);
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
