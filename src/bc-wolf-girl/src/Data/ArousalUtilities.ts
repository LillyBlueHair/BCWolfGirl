import { DataManager } from "./DataManager";


export class ArousalUtilities {
    constructor(readonly parent: DataManager) { }

    private save() {
        this.parent.save("arousal");
    }

    get data() {
        return this.parent.data.arousal;
    }

    get ruined() {
        return this.data.ruined;
    }

    set ruined(num: number) {
        this.data.ruined = num;
        this.save();
    }

    get orgasm() {
        return this.data.orgasm;
    }

    set orgasm(num: number) {
        this.data.orgasm = num;
        this.save();
    }

    get resist() {
        return this.data.resist;
    }

    set resist(num: number) {
        this.data.resist = num;
        this.save();
    }
}