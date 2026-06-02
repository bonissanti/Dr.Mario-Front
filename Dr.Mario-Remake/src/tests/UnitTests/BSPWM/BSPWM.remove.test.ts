import { describe, it, expect, beforeEach, vi } from 'vitest';
import {BSPWM, Node} from "../../../shared/components/Tile/bspwm.ts";

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
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');

            bspwm.remove(rootNode.id);

            expect(bspwm.root).toBeNull();
        });
    });

    describe('remove leaf node', () => {
        it('should remove leaf node and promote sibling', () => {
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');

            const chrome = new Node('chrome');
            bspwm.insert(bspwm.root!, chrome, 'horizontal');

            // Remove the right child (leaf)
            bspwm.remove(chrome.id);

            // The left child (copy of firefox) should become the new root
            expect(bspwm.root).not.toBeNull();
            expect(bspwm.root!.appName).toBe('firefox');
            expect(bspwm.root!.id).toBe(rootNode.id);
        });

        it('should maintain tree structure after leaf removal', () => {
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');
            bspwm.insert(bspwm.root!, new Node('chrome'), 'horizontal');

            const spotify = new Node('spotify');
            bspwm.insert(bspwm.root!, spotify, 'vertical');

            bspwm.remove(spotify.id);

            expect(bspwm.root).not.toBeNull();
        });
    });

    describe('remove internal node', () => {
        it('should handle removing node with children by promoting sibling', () => {
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');
            bspwm.insert(bspwm.root!, new Node('chrome'), 'horizontal');

            // root is now an internal container — remove it
            bspwm.remove(bspwm.root!.id);

            expect(bspwm.root).not.toBeNull();
        });
    });

    describe('remove non-existent node', () => {
        it('should log error when node is not found', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');

            bspwm.remove('non-existent-id');

            expect(consoleSpy).toHaveBeenCalledWith('Node non-existent-id not found');
            consoleSpy.mockRestore();
        });

        it('should not modify tree when node is not found', () => {
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');
            bspwm.insert(bspwm.root!, new Node('chrome'), 'horizontal');

            const rootBefore = bspwm.root;
            bspwm.remove('non-existent-id');

            expect(bspwm.root).toBe(rootBefore);
        });
    });

    describe('parent reference updates', () => {
        it('should update parent reference of promoted sibling', () => {
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');

            const chrome = new Node('chrome');
            bspwm.insert(bspwm.root!, chrome, 'horizontal');

            const leftChild = bspwm.root!.leftChild!;
            bspwm.remove(chrome.id);

            expect(bspwm.root).toBe(leftChild);
            expect(bspwm.root!.parent).toBeNull();
        });
    });
});