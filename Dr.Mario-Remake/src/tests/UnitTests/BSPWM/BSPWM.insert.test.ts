import { describe, it, expect, beforeEach } from 'vitest';
import {BSPWM, LeafNode, SplitNode} from "../../../app/utils/Tile/bspwm.ts";
import {createLeaf} from "../../../shared/fixtures/bspwmFixture.ts";

describe('BSPWM - Insert', () => {
    let bspwm: BSPWM;

    beforeEach(() => {
        bspwm = new BSPWM();
    });

    describe('insert into empty tree', () => {
        it('should set root to the inserted leaf when tree is empty', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(firefox);

            expect(bspwm.root).not.toBeNull();
            expect(bspwm.root?.type).toBe('LeafNode');
            expect((bspwm.root as LeafNode).appName).toBe('firefox');
        });

        it('should not have splitType on root when only one window is open', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(firefox);

            // Single window — root is a plain LeafNode, no split
            expect(bspwm.root!.type).toBe('LeafNode');
            expect((bspwm.root as any).splitType).toBeUndefined();
        });

        it('should have no parent on root leaf', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(firefox);

            expect(bspwm.root!.parent).toBeNull();
        });
    });

    describe('insert into non-empty tree (second window splits)', () => {
        it('should create a SplitNode as root when second window is inserted horizontally', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(firefox);

            bspwm.insert(firefox, createLeaf('chrome'), 'horizontal');

            expect(bspwm.root!.type).toBe('SplitNode');
            expect((bspwm.root as SplitNode).splitType).toBe('horizontal');
            expect((bspwm.root as SplitNode).splitRatio).toBe(0.5);
        });

        it('should create a SplitNode as root when second window is inserted vertically', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(firefox);

            bspwm.insert(firefox, createLeaf('chrome'), 'vertical');

            expect(bspwm.root!.type).toBe('SplitNode');
            expect((bspwm.root as SplitNode).splitType).toBe('vertical');
        });

        it('should preserve original window as left child after split', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(firefox);

            bspwm.insert(firefox, createLeaf('chrome'), 'horizontal');

            const root = bspwm.root as SplitNode;
            expect(root.leftChild).not.toBeNull();
            expect((root.leftChild as LeafNode).appName).toBe('firefox');
            expect(root.leftChild!.id).toBe(firefox.id);
        });

        it('should place new window as right child after split', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(firefox);

            const chrome = createLeaf('chrome');
            bspwm.insert(firefox, chrome, 'horizontal');

            const root = bspwm.root as SplitNode;
            expect(root.rightChild).not.toBeNull();
            expect((root.rightChild as LeafNode).appName).toBe('chrome');
            expect(root.rightChild!.id).toBe(chrome.id);
        });

        it('should set parent references correctly on both children', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(firefox);

            bspwm.insert(firefox, createLeaf('chrome'), 'horizontal');

            const root = bspwm.root as SplitNode;
            expect(root.leftChild!.parent).toBe(root);
            expect(root.rightChild!.parent).toBe(root);
        });

        it('should handle multiple insertions building a deeper tree', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(firefox);

            bspwm.insert(firefox, createLeaf('chrome'), 'horizontal');
            // root = SplitNode(firefox, chrome)
            // Insert spotify next to chrome
            const chrome = (bspwm.root as SplitNode).rightChild as LeafNode;
            bspwm.insert(chrome, createLeaf('spotify'), 'vertical');

            const rightChild = (bspwm.root as SplitNode).rightChild as SplitNode;
            expect(rightChild.type).toBe('SplitNode');
            expect((rightChild.rightChild as LeafNode).appName).toBe('spotify');
        });

        it('should allow inserting next to any leaf node in the tree', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(firefox);
            bspwm.insert(firefox, createLeaf('chrome'), 'horizontal');

            const leftChild = (bspwm.root as SplitNode).leftChild as LeafNode;
            bspwm.insert(leftChild, createLeaf('spotify'), 'vertical');

            expect(leftChild.parent!.type).toBe('SplitNode');
            const newSplit = leftChild.parent as SplitNode;
            expect(newSplit.splitType).toBe('vertical');
            expect((newSplit.leftChild as LeafNode).appName).toBe('firefox');
            expect((newSplit.rightChild as LeafNode).appName).toBe('spotify');
        });

        it('should log error and not change tree when called with only newLeaf on a non-empty tree', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(firefox);

            const rootBefore = bspwm.root;
            // Calling the single-arg overload on a non-empty tree should be a no-op with error
            bspwm.insert(createLeaf('chrome'));

            // root must remain unchanged — chrome was not inserted as a sibling
            expect(bspwm.root).toBe(rootBefore);
        });
    });
});
