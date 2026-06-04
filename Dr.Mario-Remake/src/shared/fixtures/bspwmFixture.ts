import {LeafNode, SplitNode, type SplitType } from "../components/Tile/bspwm.ts";

export const createLeaf = (appName: string): LeafNode => {
    return new LeafNode(appName);
};

export const createSplit = (splitType: SplitType): SplitNode => {
    return new SplitNode(splitType);
};
