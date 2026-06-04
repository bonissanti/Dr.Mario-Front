import { describe, it, expect, beforeEach, vi } from 'vitest';
import {BSPWM, LeafNode, SplitNode} from "../../../shared/components/Tile/bspwm.ts";
import {createLeaf} from "../../../shared/fixtures/bspwmFixture.ts";

describe('BSPWM - Remove', () => {
    let bspwm: BSPWM;

    beforeEach(() => {
        bspwm = new BSPWM();
    });

    describe('remove from empty tree', () => {
        it('should handle removal from empty tree gracefully', () => {
            expect(() => bspwm.remove('non-existent')).not.toThrow();
        });

        it('should not set root when removing from empty tree', () => {
            bspwm.remove('anything');
            expect(bspwm.root).toBeNull();
        });
    });

    describe('remove root node', () => {
        it('should set root to null when removing the only node', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');

            bspwm.remove(rootNode.id);

            expect(bspwm.root).toBeNull();
        });
    });

    describe('remove leaf node', () => {
        it('should remove leaf node and promote sibling', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');

            const chrome = createLeaf('chrome');
            bspwm.insert(rootNode, chrome, 'horizontal');

            // Remove the right child (leaf)
            bspwm.remove(chrome.id);

            // The left child (firefox) should become the new root
            expect(bspwm.root).not.toBeNull();
            expect((bspwm.root as LeafNode).appName).toBe('firefox');
            expect(bspwm.root!.id).toBe(rootNode.id);
        });

        it('should maintain tree structure after leaf removal', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');
            bspwm.insert(rootNode, createLeaf('chrome'), 'horizontal');

            const spotify = createLeaf('spotify');
            // root is SplitNode(firefox, chrome)
            // Insert spotify into the chrome node
            const chrome = (bspwm.root as SplitNode).rightChild as LeafNode;
            bspwm.insert(chrome, spotify, 'vertical');

            bspwm.remove(spotify.id);

            expect(bspwm.root).not.toBeNull();
            expect(bspwm.root!.type).toBe('SplitNode');
        });
    });

    describe('remove internal node', () => {
        it('should NOT handle removing ID of a SplitNode since remove uses findLeaf which only finds LeafNodes', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');
            bspwm.insert(rootNode, createLeaf('chrome'), 'horizontal');

            // root is now an internal container (SplitNode)
            const rootId = bspwm.root!.id;
            bspwm.remove(rootId);

            // It should still be there because findLeaf only returns LeafNodes
            expect(bspwm.root).not.toBeNull();
            expect(bspwm.root!.id).toBe(rootId);
        });
    });

    describe('remove non-existent node', () => {
        it('should log error when node is not found', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');

            bspwm.remove('non-existent-id');

            expect(consoleSpy).toHaveBeenCalledWith('Node non-existent-id not found');
            consoleSpy.mockRestore();
        });

        it('should not modify tree when node is not found', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');
            bspwm.insert(rootNode, createLeaf('chrome'), 'horizontal');

            const rootBefore = bspwm.root;
            bspwm.remove('non-existent-id');

            expect(bspwm.root).toBe(rootBefore);
        });
    });

    describe('parent reference updates', () => {
        it('should update parent reference of promoted sibling', () => {
            const rootNode = createLeaf('firefox');
            bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');

            const chrome = createLeaf('chrome');
            bspwm.insert(rootNode, chrome, 'horizontal');

            const leftChild = (bspwm.root as SplitNode).leftChild!;
            bspwm.remove(chrome.id);

            expect(bspwm.root).toBe(leftChild);
            expect(bspwm.root!.parent).toBeNull();
        });
    });
});