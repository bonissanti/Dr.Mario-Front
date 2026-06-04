import { describe, it, expect, beforeEach } from 'vitest';
import {BSPWM, LeafNode, SplitNode} from "../../../shared/components/Tile/bspwm.ts";
import {createLeaf} from "../../../shared/fixtures/bspwmFixture.ts";

describe('BSPWM - Insert', () => {
    let bspwm: BSPWM;

    beforeEach(() => {
        bspwm = new BSPWM();
    });

    describe('insert into empty tree', () => {
        it('should set root when inserting first node', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), firefox, 'horizontal');

            expect(bspwm.root).not.toBeNull();
            expect(bspwm.root?.type).toBe('LeafNode');
            expect((bspwm.root as LeafNode).appName).toBe('firefox');
        });

        it('should not have splitType on root when tree was empty', () => {
            const firefox = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), firefox, 'horizontal');

            // When tree is empty, the first node becomes root (LeafNode) without splitting
            expect(bspwm.root!.type).toBe('LeafNode');
            expect((bspwm.root as any).splitType).toBeUndefined();
        });
    });

    describe('insert into non-empty tree', () => {
        it('should split target node horizontally', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');

            bspwm.insert(rootNode, createLeaf('chrome'), 'horizontal');

            expect(bspwm.root!.type).toBe('SplitNode');
            expect((bspwm.root as SplitNode).splitType).toBe('horizontal');
            expect((bspwm.root as SplitNode).splitRatio).toBe(0.5);
        });

        it('should split target node vertically', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'vertical');

            bspwm.insert(rootNode, createLeaf('chrome'), 'vertical');

            expect((bspwm.root as SplitNode).splitType).toBe('vertical');
        });

        it('should preserve original window as left child', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');

            bspwm.insert(rootNode, createLeaf('chrome'), 'horizontal');

            const root = bspwm.root as SplitNode;
            expect(root.leftChild).not.toBeNull();
            expect((root.leftChild as LeafNode).appName).toBe('firefox');
            expect(root.leftChild!.id).toBe(rootNode.id);
        });

        it('should place new window as right child', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');

            const chrome = createLeaf('chrome');
            bspwm.insert(rootNode, chrome, 'horizontal');

            const root = bspwm.root as SplitNode;
            expect(root.rightChild).not.toBeNull();
            expect((root.rightChild as LeafNode).appName).toBe('chrome');
            expect(root.rightChild!.id).toBe(chrome.id);
        });

        it('should set parent references correctly', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');

            bspwm.insert(rootNode, createLeaf('chrome'), 'horizontal');

            const root = bspwm.root as SplitNode;
            expect(root.leftChild!.parent).toBe(root);
            expect(root.rightChild!.parent).toBe(root);
        });

        it('should handle multiple insertions', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');

            bspwm.insert(rootNode, createLeaf('chrome'), 'horizontal');
            // root is now a SplitNode with firefox (left) and chrome (right)
            // Now insert spotify into the right child (chrome)
            const chrome = (bspwm.root as SplitNode).rightChild as LeafNode;
            bspwm.insert(chrome, createLeaf('spotify'), 'vertical');

            const rightChild = (bspwm.root as SplitNode).rightChild as SplitNode;
            expect(rightChild.type).toBe('SplitNode');
            expect((rightChild.rightChild as LeafNode).appName).toBe('spotify');
        });

        it('should allow inserting into any target node', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');
            bspwm.insert(rootNode, createLeaf('chrome'), 'horizontal');

            const leftChild = (bspwm.root as SplitNode).leftChild as LeafNode;
            bspwm.insert(leftChild, createLeaf('spotify'), 'vertical');

            expect(leftChild.parent!.type).toBe('SplitNode');
            const newSplit = leftChild.parent as SplitNode;
            expect(newSplit.splitType).toBe('vertical');
            expect((newSplit.leftChild as LeafNode).appName).toBe('firefox');
            expect((newSplit.rightChild as LeafNode).appName).toBe('spotify');
        });
    });
});