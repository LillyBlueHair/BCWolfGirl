import { DataManager } from ".";


export class OutfitUtilities {
    private parent: DataManager;
    private _items: Map<string, DataOutfitItem>;

    constructor(parent: DataManager) {
        this.parent = parent;
        this._items = new Map<string, DataOutfitItem>(parent.data.outfit.items.map(i => [i.asset.group, i]));
    }

    private get data() {
        return this.parent.data.outfit;
    }

    get lite_mode() {
        return this.data.lite_mode;
    }

    set lite_mode(arg: boolean) {
        this.data.lite_mode = arg;
        this.parent.save();
    }

    add(item: DataOutfitItem | DataOutfitItem[]) {
        if (Array.isArray(item)) {
            item.forEach(i => this._items.set(i.asset.group, i));
        } else {
            this._items.set(item.asset.group, item);
        }
        this.data.items = [...this._items.values()];
        this.parent.save();
    }

    get items(): Map<string, DataOutfitItem> {
        return this._items;
    }

    set items(arg: DataOutfitItem[] | Map<string, DataOutfitItem>) {
        if (Array.isArray(arg)) {
            this.data.items = arg;
            this._items = new Map<string, DataOutfitItem>(arg.map(i => [i.asset.group, i]));
        } else {
            this.data.items = [...arg.values()];
            this._items = arg;
        }
        this.parent.save();
    }
}
