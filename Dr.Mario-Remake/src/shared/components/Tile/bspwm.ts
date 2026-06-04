export type SplitType = 'horizontal' | 'vertical';
type BSPWMType = LeafNode | SplitNode;

abstract class BSPWMNode {
    id: string
    parent: SplitNode | null = null;
    abstract type: 'LeafNode' | 'SplitNode';

    protected constructor() {
        this.id = crypto.randomUUID();
    }
}

export class SplitNode extends BSPWMNode{
    type = 'SplitNode' as const;
    leftChild: BSPWMType | null = null;
    rightChild: BSPWMType | null = null;
    splitType: SplitType | null = null;
    splitRatio: number;

    constructor(splitType: SplitType | null = null) {
        super();
        this.splitType = splitType;
        this.splitRatio = 0.5;
    }
}

export class LeafNode extends BSPWMNode{
    type = 'LeafNode' as const;
    appName: string;

    constructor(appName: string) {
        super();
        this.appName = appName;
    }
}

export class BSPWM
{
    root: BSPWMType | null = null;

    public insert(target: LeafNode, newLeaf: LeafNode, split: SplitType): void
    {
        if (!this.root) {
            this.root = newLeaf;
            return;
        }

        const parent = target.parent;
        const newSplit: SplitNode = new SplitNode(split);

        newSplit.leftChild = target;
        newSplit.rightChild = newLeaf;
        target.parent = newSplit;
        newLeaf.parent = newSplit;

        if (parent) {
            newSplit.parent = parent;

            if (parent.leftChild === target) {
                parent.leftChild = newSplit;
            }
            else {
                parent.rightChild = newSplit;
            }
            return;
        }

        newSplit.parent = null;
        this.root = newSplit;
    }

    public remove(id: string): void {
        if (!this.root)
            return;

        const targetNode: BSPWMType | null = this.findLeaf(this.root, id);

        if (!targetNode) {
            console.error(`Node ${id} not found`);
            return;
        }

        if (targetNode === this.root) {
            this.root = null;
            return;
        }

        const targetParent: SplitNode | null = targetNode.parent;
        if (!targetParent)
            return;

        const remainingChild: BSPWMType | null = targetParent.leftChild === targetNode ? targetParent.rightChild : targetParent.leftChild;

        if (!targetParent.parent) {
            this.root = remainingChild;
            if (remainingChild) {
                remainingChild.parent = null;
            }
            return;
        }

        const grandParent: SplitNode | null = targetParent.parent;
        if (grandParent.leftChild === targetParent) {
            grandParent.leftChild = remainingChild;
        } else {
            grandParent.rightChild = remainingChild;
        }

        if (remainingChild) {
            remainingChild.parent = grandParent;
        }
    }

    public findLeaf(root: BSPWMType | null, id: string): LeafNode | null {
        if (!root)
            return null;

        if (root.id === id && root instanceof LeafNode)
            return root;

        if (root instanceof SplitNode) {
            const left = this.findLeaf(root.leftChild, id);
            if (left)
                return left;

            return this.findLeaf(root.rightChild, id);
        }

        return null;
    }
}