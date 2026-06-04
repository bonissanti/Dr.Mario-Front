import {type BSPWM, LeafNode, type SplitType} from "../Tile/bspwm.ts";
import type {LRUHistory} from "../LRU/lruHistory.ts";
import type {EventBus} from "../EventBus/Concrete/EventBus.ts";
import {WindowManagerEventsEnum} from "../../domain/enum/WindowManagerEventsEnum.ts";

export class WindowManager {
    bspwm: BSPWM
    lru: LRUHistory<string, string>
    lastFocusedWindow: LeafNode | null = null
    nextSplit: SplitType = 'vertical'
    private readonly eventBus: EventBus<WindowManagerEventsEnum>

    constructor(bspwm: BSPWM, lru: LRUHistory<string, string>, eventBus: EventBus<WindowManagerEventsEnum>) {
        this.bspwm = bspwm
        this.lru = lru
        this.eventBus = eventBus
    }

    public openWindow(appName: string)
    {
        if (this.lru.size === 0 && this.lastFocusedWindow === null)
        {
            this.createNewWindow(appName);
            return;
        }

        if (this.lru.size >= 5)
        {
            const lastNodeId: string | null = this.lru.evictionCandidate;

            if (lastNodeId === null)
            {
                this.eventBus.publish(WindowManagerEventsEnum.Warn, {
                    message: "LRU is empty, can't evict anything."
                });
                return;
            }

            this.eventBus.publish(WindowManagerEventsEnum.WindowLimitReached, {
                message:
                    "You reached the maximum number of windows. Opening a new one will close the oldest one. " +
                    "Do you want to continue?",
                onConfirm: (confirmed: boolean) => {
                    if (confirmed)
                    {
                        this.bspwm.remove(lastNodeId);
                        this.lru.delete(lastNodeId);
                        this.createNewWindow(appName);
                    }
                }
            });
            return;
        }

        this.createNewWindow(appName);
    }

    private createNewWindow(appName: string)
    {
        const newLeaf = new LeafNode(appName);

        if (this.lastFocusedWindow !== null)
            this.bspwm.insert(this.lastFocusedWindow, newLeaf, this.nextSplit);
        else
            this.bspwm.insert(newLeaf);

        this.lru.set(newLeaf.id, appName);
        this.lastFocusedWindow = newLeaf;
        this.nextSplit = this.nextSplit === 'horizontal' ? 'vertical' : 'horizontal';
    }
}
