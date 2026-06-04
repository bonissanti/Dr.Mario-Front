class LRUNode<K, V> {
    public previous: LRUNode<K, V> | null = null;
    public next: LRUNode<K, V> | null = null;

    constructor(public key: K, public value: V) {}
}

export class LRUHistory<K, V> {
    private readonly map = new Map<K, LRUNode<K, V>>();
    private head: LRUNode<K, V> | null = null;
    private tail: LRUNode<K, V> | null = null;

    public get size(): number {
        return this.map.size;
    }

    public get(key: K): V | undefined {
        return this.map.get(key)?.value;
    }

    public getFirst(): K | undefined {
        return this.head?.key;
    }

    public has(key: K): boolean {
        return this.map.has(key);
    }

    public set(key: K, value: V): void {
        if (this.map.has(key)) {
            const node = this.map.get(key)!;
            node.value = value;
            return;
        }

        const newNode = new LRUNode(key, value);
        this.map.set(key, newNode);
        this.appendNode(newNode);
    }

    public delete(key: K): boolean
    {
        const node = this.map.get(key);
        if (node) {
            this.removeNode(node);
            this.map.delete(key);
            return true;
        }
        return false;
    }

    public promote(key: K): boolean {
        const node = this.map.get(key);
        if (!node || node === this.head)
            return !!node;

        if (node.previous) {
            node.previous.next = node.next;
        }

        if (node.next) {
            node.next.previous = node.previous;
        }
        node.previous = null;
        node.next = this.head;

        if (this.head) {
            this.head.previous = node;
        }
        this.head = node;
        return true;
    }

    public get evictionCandidate(): K | null {
        return this.tail ? this.tail.key : null;
    }

    private appendNode(node: LRUNode<K, V>): void {
        if (!this.head) {
            this.head = node;
            this.tail = node;
            return;
        }

        if (this.tail) {
            this.tail.next = node;
            node.previous = this.tail;
        }
        this.tail = node;
    }

    private removeNode(node: LRUNode<K, V>): void {
        if (node.previous) {
            node.previous.next = node.next;
        }
        if (node.next) {
            node.next.previous = node.previous;
        }
        if (node === this.head) {
            this.head = node.next;
        }
        if (node === this.tail) {
            this.tail = node.previous;
        }
    }
}
