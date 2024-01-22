import { DataManager } from ".";


export class ArousalUtilities {
    private readonly parent: DataManager;
    constructor(parent: DataManager) {
        this.parent = parent;
    }

    get data() {
        return this.parent.data.arousal;
    }

    get ruined() {
        return this.data.ruined;
    }

    set ruined(num: number) {
        this.data.ruined = num;
        this.parent.save();
    }

    get orgasm() {
        return this.data.orgasm;
    }

    set orgasm(num: number) {
        this.data.orgasm = num;
        this.parent.save();
    }

    get resist() {
        return this.data.resist;
    }

    set resist(num: number) {
        this.data.resist = num;
        this.parent.save();
    }
}