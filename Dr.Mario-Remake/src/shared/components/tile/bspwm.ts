type Direction = 'horizontal' | 'vertical';
type Rect = { x: number, y: number, width: number, height: number };
type Node = LeafNode | SplitNode;

class LeafNode {
    type = "leaf" as const;
    windowId: string;

    constructor(windowId: string) {
        this.windowId = windowId;
    }
}

class SplitNode {
    type = "split" as const;
    direction: Direction;
    ratio: number;
    left: Node;
    right: Node;

    constructor(direction: Direction, ratio: number, left: Node, right: Node) {
        this.direction = direction;
        this.ratio = ratio;
        this.left = left;
        this.right = right;
    }
}

export class Tree {
    root: Node | null = null;
    windowQueue: string[] = [];

    public insertWindow(windowId: string): void
    {
        if (this.root === null)
        {
            this.root = new LeafNode(windowId);
            return;
        }

        if (this.windowQueue.length > 4)
        {
            this.removeOldestWindow();
        }

        target = pickInsertTarget();

        newSplit = new SplitNode(
            this.chooseDirection(target.rect),
            0.5,
            new LeafNode(target.windowId),
            new LeafNode(windowId)
        )
    }

    public removeOldestWindow(): void
    {
        this.removeWindow(this.windowQueue[0]);
    }

    private removeWindow(windowId: string): void
    {
        leaf = findLeaf(windowId);
    }

    private findLeaf(windowId: string, node: Node| null): LeafNode | undefined
    {
        if (node == null)
            return undefined;

        if (node.type === "leaf")
            return node.windowId === windowId ? node : undefined;

        return this.findLeaf(windowId, node.left) || this.findLeaf(windowId, node.right);
    }

    public chooseDirection(rect: Rect): Direction
    {
        if (rect.width > rect.height)
            return 'horizontal';
        return 'vertical';
    }
}



