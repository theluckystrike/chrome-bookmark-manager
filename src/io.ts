/**
 * Bookmark IO — Import/export bookmarks as JSON
 */
export class BookmarkIO {
    /** Export all bookmarks as JSON */
    static async exportJSON(filename: string = 'bookmarks.json'): Promise<void> {
        const tree = await chrome.bookmarks.getTree();
        const blob = new Blob([JSON.stringify(tree, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
    }

    /** Export as flat URL list */
    static async exportURLList(): Promise<string> {
        const tree = await chrome.bookmarks.getTree();
        const urls: string[] = [];
        const walk = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
            for (const node of nodes) { if (node.url) urls.push(node.url); if (node.children) walk(node.children); }
        };
        walk(tree);
        return urls.join('\n');
    }

    /** Listen for bookmark changes */
    static onChange(callback: (type: 'created' | 'removed' | 'changed' | 'moved', id: string) => void): void {
        chrome.bookmarks.onCreated.addListener((id) => callback('created', id));
        chrome.bookmarks.onRemoved.addListener((id) => callback('removed', id));
        chrome.bookmarks.onChanged.addListener((id) => callback('changed', id));
        chrome.bookmarks.onMoved.addListener((id) => callback('moved', id));
    }
}
