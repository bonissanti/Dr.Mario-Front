import { describe, it, expect, beforeEach } from 'vitest';
import {BSPWM} from "../../../shared/components/Tile/bspwm.ts";
import {createLeaf} from "../../../shared/fixtures/bspwmFixture.ts";

describe('BSPWM - findLeaf', () => {
    let bspwm: BSPWM;

    beforeEach(() => {
        bspwm = new BSPWM();
    });

    it('should return null for empty tree', () => {
        expect(bspwm.findLeaf(null, 'any-id')).toBeNull();
    });

    it('should find root node if it matches ID and is a LeafNode', () => {
        const node = createLeaf('firefox');
        bspwm.insert(createLeaf('ignored'), node, 'horizontal');
        
        const found = bspwm.findLeaf(bspwm.root, node.id);
        expect(found).toBe(node);
        expect(found?.appName).toBe('firefox');
    });

    it('should return null if ID matches a SplitNode', () => {
        const rootNode = createLeaf('firefox');
        bspwm.insert(createLeaf('ignored'), rootNode, 'horizontal');
        bspwm.insert(rootNode, createLeaf('chrome'), 'horizontal');

        // root is now a SplitNode
        const rootId = bspwm.root!.id;
        const found = bspwm.findLeaf(bspwm.root, rootId);
        expect(found).toBeNull();
    });

    it('should find leaf node in a nested tree', () => {
        const firefox = createLeaf('firefox');
        const chrome = createLeaf('chrome');
        const spotify = createLeaf('spotify');
        const vscode = createLeaf('vscode');

        bspwm.insert(createLeaf('ignored'), firefox, 'horizontal');
        bspwm.insert(firefox, chrome, 'horizontal');
        bspwm.insert(chrome, spotify, 'vertical');
        bspwm.insert(spotify, vscode, 'horizontal');

        // Tree structure is roughly:
        // Split(firefox, Split(chrome, Split(spotify, vscode)))
        
        expect(bspwm.findLeaf(bspwm.root, firefox.id)).toBe(firefox);
        expect(bspwm.findLeaf(bspwm.root, chrome.id)).toBe(chrome);
        expect(bspwm.findLeaf(bspwm.root, spotify.id)).toBe(spotify);
        expect(bspwm.findLeaf(bspwm.root, vscode.id)).toBe(vscode);
    });

    it('should return null if leaf is not in the tree', () => {
        const firefox = createLeaf('firefox');
        bspwm.insert(createLeaf('ignored'), firefox, 'horizontal');
        
        expect(bspwm.findLeaf(bspwm.root, 'some-random-id')).toBeNull();
    });
});
