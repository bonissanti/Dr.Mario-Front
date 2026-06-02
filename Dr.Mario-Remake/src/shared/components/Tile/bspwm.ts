type SplitType = 'horizontal' | 'vertical';
type BSPWMNode = 'LeafNode' | 'InternalNode';

export class InternalNode{
    id: string;
    type: BSPWMNode = 'InternalNode';
    parent: InternalNode | null = null;
    leftChild: LeafNode | InternalNode | null = null;
    rightChild: LeafNode | InternalNode | null= null;
    splitType: SplitType | null = null;
    splitRatio: number;

    constructor(splitType: SplitType | null = null) {
        this.id = crypto.randomUUID();
        this.parent = null;
        this.leftChild = null;
        this.rightChild = null;
        this.splitType = splitType;
        this.splitRatio = 0.5;
    }
}

export class LeafNode{
    id: string;
    appName: string;
    type: BSPWMNode = 'LeafNode';
    parent: InternalNode | null = null;

    constructor(appName: string) {
        this.id = crypto.randomUUID();
        this.parent = null;
        this.appName = appName;
    }
}

export class BSPWM {
    root: LeafNode | InternalNode | null = null;

    public insert(targetNodeId: string, newAppName: string, split: SplitType): void
    {
        const newLeaf = new LeafNode(newAppName);

        if (!this.root) {
            this.root = newLeaf;
            return;
        }

        const target = this.findNode(this.root, targetNodeId);
        if (!target) {
            console.error(`Node ${targetNodeId} not found`);
            return;
        }

        if (target === this.root && target.type === 'LeafNode')
        {
            const newInternal = new InternalNode(split);

            newInternal.leftChild = target;
            newInternal.rightChild = newLeaf;

            target.parent = newInternal;
            newInternal.parent = newInternal;

            this.root = newInternal;
            return;
        }

        const parent = target.parent;
        if (!parent)
            return;

        const newInternal = new InternalNode(split);
        newInternal.parent = parent;

        if (parent.leftChild === target) {
            parent.leftChild = newInternal;
        }
        else {
            parent.rightChild = newInternal;
        }

        newInternal.leftChild = target;
        newInternal.rightChild = newLeaf;

        target.parent = newInternal;
        newLeaf.parent = newInternal;
    }

    public remove(id: string): void {
        if (!this.root)
            return;

        const nodeToRemove = this.findNode(this.root, id);
        if (!nodeToRemove) {
            console.error(`Node ${id} not found`);
            return;
        }

        const parentNode = nodeToRemove.parent;
        if (!parentNode) {
            this.root = null;
            return;
        }

        const siblingNode = parentNode.leftChild === nodeToRemove ? parentNode.rightChild : parentNode.leftChild;
        const newNode = parentNode.parent;
        if (!newNode) {
            this.root = siblingNode;
            return;
        }

        if (newNode.leftChild === parentNode)
            newNode.leftChild = siblingNode;
        else
            newNode.rightChild = siblingNode;
    }

    public findNode(root: LeafNode | InternalNode | null, id: string): LeafNode | InternalNode | null {
        if (!root)
            return null;

        if (root instanceof InternalNode)
            return root.id === id ? root : null;

        if (root instanceof InternalNode) {
            if (root.id === id)
                return root;

            const left = this.findNode(root?.leftChild, id);

            if (left)
                return left;

            return this.findNode(root?.rightChild, id);
        }
        return null;
    }
}

// remove(nodeId: string): void {
//     if (!this.root) return;
//
// // 1. Find the node to remove
// const targetNode = this.findNode(this.root, nodeId);
// if (!targetNode) throw new Error("Node to remove not found");
//
// // Case 1: Target is the root node itself
// if (targetNode === this.root) {
//     this.root = null;
//     return;
// }
//
// // Fetch parent and determine sibling
// const parent = targetNode.parent;
// if (!parent) return; // Safety check
//
// // Identify the sibling node (the node left behind)
// const sibling = parent.leftChild === targetNode ? parent.rightChild : parent.leftChild;
//
// // Case 2: Parent has no grand-parent (Parent is the root of the tree)
// if (!parent.parent) {
//     this.root = sibling;
//     if (sibling) {
//         sibling.parent = null; // Sibling is now the new root
//     }
//     return;
// }
//
// // Case 3: Standard removal under a grand-parent
// const grandParent = parent.parent;
//
// // Connect the sibling directly to the grand-parent, bypassing the deleted parent
// if (grandParent.leftChild === parent) {
//     grandParent.leftChild = sibling;
// } else {
//     grandParent.rightChild = sibling;
// }
//
// if (sibling) {
//     sibling.parent = grandParent;
// }
// }