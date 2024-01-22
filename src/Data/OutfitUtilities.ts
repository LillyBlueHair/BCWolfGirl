import { DataManager } from ".";


export class OutfitUtilities {
    parent: DataManager;
    constructor(parent: DataManager) {
        this.parent = parent;
    }

    get data() {
        return this.parent.data.outfit;
    }

    get collar_only() {
        return this.data.collar_only;
    }

    set collar_only(arg: boolean) {
        this.data.collar_only = arg;
        this.parent.save();
    }

    get items() {
        return this.data.items;
    }

    set items(arg: DataOutfitItem[]) {
        this.data.items = arg;
        this.parent.save();
    }
}
