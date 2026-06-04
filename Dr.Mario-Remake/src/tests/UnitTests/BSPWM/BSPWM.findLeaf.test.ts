import { describe, it, expect, beforeEach } from 'vitest';
import {BSPWM, LeafNode, SplitNode} from "../../../app/utils/Tile/bspwm.ts";
import {createLeaf} from "../../../shared/fixtures/bspwmFixture.ts";

describe('BSPWM - findLeaf', () => {
    let bspwm: BSPWM;

    beforeEach(() => {
        bspwm = new BSPWM();
    });

    it('should return null for empty tree', () => {
        expect(bspwm.findLeaf(null, 'any-id')).toBeNull();
    });

    it('should find root node when it is a single LeafNode', () => {
        const firefox = createLeaf('firefox');
        bspwm.insert(firefox);

        const found = bspwm.findLeaf(bspwm.root, firefox.id);
        expect(found).toBe(firefox);
        expect(found?.appName).toBe('firefox');
    });

    it('should return null if ID matches a SplitNode (not a leaf)', () => {
        const firefox = createLeaf('firefox');
        bspwm.insert(firefox);
        bspwm.insert(firefox, createLeaf('chrome'), 'horizontal');

        // root is now a SplitNode — findLeaf should not return it
        const rootId = bspwm.root!.id;
        const found = bspwm.findLeaf(bspwm.root, rootId);
        expect(found).toBeNull();
    });

    it('should find any leaf node in a nested tree', () => {
        const firefox = createLeaf('firefox');
        const chrome = createLeaf('chrome');
        const spotify = createLeaf('spotify');
        const vscode = createLeaf('vscode');

        bspwm.insert(firefox);
        bspwm.insert(firefox, chrome, 'horizontal');
        // root = SplitNode(firefox, chrome)
        bspwm.insert(chrome, spotify, 'vertical');
        // right subtree = SplitNode(chrome, spotify)
        bspwm.insert(spotify, vscode, 'horizontal');
        // right-right subtree = SplitNode(spotify, vscode)

        expect(bspwm.findLeaf(bspwm.root, firefox.id)).toBe(firefox);
        expect(bspwm.findLeaf(bspwm.root, chrome.id)).toBe(chrome);
        expect(bspwm.findLeaf(bspwm.root, spotify.id)).toBe(spotify);
        expect(bspwm.findLeaf(bspwm.root, vscode.id)).toBe(vscode);
    });

    it('should return null if leaf is not present in the tree', () => {
        const firefox = createLeaf('firefox');
        bspwm.insert(firefox);

        expect(bspwm.findLeaf(bspwm.root, 'some-random-id')).toBeNull();
    });

    it('should find left and right children correctly after a split', () => {
        const firefox = createLeaf('firefox');
        const chrome = createLeaf('chrome');
        bspwm.insert(firefox);
        bspwm.insert(firefox, chrome, 'horizontal');

        const root = bspwm.root as SplitNode;
        expect(bspwm.findLeaf(root.leftChild, firefox.id)).toBe(firefox);
        expect(bspwm.findLeaf(root.rightChild, chrome.id)).toBe(chrome);
    });
});
