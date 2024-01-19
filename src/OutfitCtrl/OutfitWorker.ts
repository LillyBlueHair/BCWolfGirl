import { ChatRoomAction } from "../utils/ChatMessages";
import { OutfitWork, OutfitWorkState } from "./OutfitTypes";

export class OutfitWorker {
    private readonly works: OutfitWork[] = [];
    private readonly _timer;
    constructor(readonly interval: number = 1000) {
        this._timer = setInterval(() => {
            if (Player && this.works.length > 0) {
                const state = this.works[0].run(Player);
                if (state === OutfitWorkState.finished) {
                    this.works.shift();
                } else if (state === OutfitWorkState.interrupted) {
                    this.works.length = 0;
                }
            }
        }, interval);
    }

    push(work: OutfitWork) {
        this.works.push(work);
    }

    private static _global: OutfitWorker | undefined;
    static get global(): OutfitWorker {
        return OutfitWorker._global as OutfitWorker;
    }

    static set global(work: OutfitWorker) {
        if (OutfitWorker._global) clearInterval(OutfitWorker._global._timer);
        OutfitWorker._global = work;
    }
}