import { describe, it, expect, beforeEach } from 'vitest';
import {BSPWM, Node} from "../../../shared/components/Tile/bspwm.ts";

describe('BSPWM - Insert', () => {
    let bspwm: BSPWM;

    beforeEach(() => {
        bspwm = new BSPWM();
    });

    describe('insert into empty tree', () => {
        it('should set root when inserting first node', () => {
            const node = new Node('firefox');
            bspwm.insert(node, new Node('ignored'), 'horizontal');

            expect(bspwm.root).not.toBeNull();
            expect(bspwm.root?.appName).toBe('firefox');
        });

        it('should not set splitType on root when tree was empty', () => {
            const node = new Node('firefox');
            bspwm.insert(node, new Node('ignored'), 'horizontal');

            // When tree is empty, the first node becomes root without splitting
            expect(bspwm.root!.splitType).toBeNull();
        });
    });

    describe('insert into non-empty tree', () => {
        it('should split target node horizontally', () => {
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');

            bspwm.insert(bspwm.root!, new Node('chrome'), 'horizontal');

            expect(bspwm.root!.splitType).toBe('horizontal');
            expect(bspwm.root!.splitRatio).toBe(0.5);
        });

        it('should split target node vertically', () => {
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'vertical');

            bspwm.insert(bspwm.root!, new Node('chrome'), 'vertical');

            expect(bspwm.root!.splitType).toBe('vertical');
        });

        it('should preserve original window as left child', () => {
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');

            bspwm.insert(bspwm.root!, new Node('chrome'), 'horizontal');

            expect(bspwm.root!.leftChild).not.toBeNull();
            expect(bspwm.root!.leftChild!.appName).toBe('firefox');
            expect(bspwm.root!.leftChild!.id).toBe(rootNode.id);
        });

        it('should place new window as right child', () => {
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');

            const chrome = new Node('chrome');
            bspwm.insert(bspwm.root!, chrome, 'horizontal');

            expect(bspwm.root!.rightChild).not.toBeNull();
            expect(bspwm.root!.rightChild!.appName).toBe('chrome');
        });

        it('should set parent references correctly', () => {
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');

            bspwm.insert(bspwm.root!, new Node('chrome'), 'horizontal');

            expect(bspwm.root!.leftChild!.parent).toBe(bspwm.root);
            expect(bspwm.root!.rightChild!.parent).toBe(bspwm.root);
        });

        it('should handle multiple insertions', () => {
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');

            bspwm.insert(bspwm.root!, new Node('chrome'), 'horizontal');
            bspwm.insert(bspwm.root!, new Node('spotify'), 'vertical');

            expect(bspwm.root!.rightChild!.appName).toBe('spotify');
        });

        it('should allow inserting into any target node', () => {
            const rootNode = new Node('firefox');
            bspwm.insert(rootNode, new Node('ignored'), 'horizontal');
            bspwm.insert(bspwm.root!, new Node('chrome'), 'horizontal');

            const leftChild = bspwm.root!.leftChild!;
            bspwm.insert(leftChild, new Node('spotify'), 'vertical');

            expect(leftChild.splitType).toBe('vertical');
            expect(leftChild.leftChild!.appName).toBe('firefox');
            expect(leftChild.rightChild!.appName).toBe('spotify');
        });
    });
});