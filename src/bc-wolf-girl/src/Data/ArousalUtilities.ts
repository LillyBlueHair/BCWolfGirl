import { DataManager } from ".";


export class ArousalUtilities {
    constructor(readonly parent: DataManager) { }

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