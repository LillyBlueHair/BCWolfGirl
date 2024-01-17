import { ChatRoomAction } from "../utils/ChatMessages";
import { OutfitWork, OutfitWorkState } from "./OutfitTypes";

export class OutfitWorker {
    private readonly works: OutfitWork[] = [];

    private readonly action: ChatRoomAction;

    private readonly timeout;

    constructor(action: ChatRoomAction) {
        this.action = action;
        this.timeout = setInterval(() => {
            if (this.works.length > 0) {
                console.log(this.works[0]);
            }
        }, 1000);
    }

    push(work: OutfitWork) {
        this.works.push(work);
    }

    pushMessageWork(msg: string) {
        this.works.push(() => {
            this.action.ServerAction(msg);
            return OutfitWorkState.finished;
        })
    }
}