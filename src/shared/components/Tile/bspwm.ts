type SplitType = 'horizontal' | 'vertical';

// interface Split {
//     type: SplitType;
//     ratio: number;
//     focusedWindow: string | null;
// }

class Node {
    id: string;
    appName: string;
    parent: Node | null = null;
    leftChild: Node | null = null;
    rightChild: Node | null = null;
    splitType: SplitType | null = null;
    splitRatio: number;

    constructor(appName: string, id: string | null = null) {
        this.id = id ?? crypto.randomUUID();
        this.parent = null;
        this.leftChild = null;
        this.rightChild = null;
        this.splitType = null;
        this.appName = appName;
        this.splitRatio = 0.5;
    }
}

class BSPWM {
    root: Node | null = null;

    public insert(targetNode: Node, newId: string, splitType: SplitType): void {
        const newNode = new Node(newId);

        if (!this.root)
        {
            this.root = newNode;
            return ;
        }

        targetNode.splitType = splitType;
        targetNode.splitRatio = 0.5;

        const oldWindow = new Node(targetNode.appName, targetNode.id);
        oldWindow.parent = targetNode;
        targetNode.leftChild = oldWindow;

        newNode.parent = targetNode;
        targetNode.rightChild = newNode;
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

        siblingNode!.parent = newNode;
        if (newNode.leftChild === parentNode)
            newNode.leftChild = siblingNode;
        else
            newNode.rightChild = siblingNode;
    }

    public findNode(root: Node | null | undefined, id: string): Node | null {
        if (!root)
            return null;

        if (root?.id == id)
            return root;

        const nodeLeft = this.findNode(root?.leftChild, id);
        if (nodeLeft)
            return nodeLeft;

        return this.findNode(root?.rightChild, id);
    }
}
