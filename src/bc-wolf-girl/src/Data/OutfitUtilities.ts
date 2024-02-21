import { DataManager } from "./DataManager";


export class OutfitUtilities {
    constructor(readonly parent: DataManager) {
        this._items = new Map<string, DataOutfitItem>(parent.data.outfit.items.map(i => [i.asset.group, i]));
        this._color_store = new Map<string, ColorStoreItem>(parent.data.outfit.color_store.map(i => [i.group, i]));
    }

    private save() {
        this.parent.save("outfit");
    }

    private get data() {
        return this.parent.data.outfit;
    }

    get lite_mode() {
        return this.data.lite_mode;
    }

    set lite_mode(arg: boolean) {
        this.data.lite_mode = arg;
        this.save();
    }

    private _items: Map<string, DataOutfitItem>;
    add(item: DataOutfitItem | DataOutfitItem[]) {
        if (Array.isArray(item)) {
            item.forEach(i => this._items.set(i.asset.group, i));
        } else {
            this._items.set(item.asset.group, item);
        }
        this.data.items = [...this._items.values()];
        this.save();
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
        this.save();
    }

    private _color_store: Map<string, ColorStoreItem>;
    get color_store(): Map<string, ColorStoreItem> {
        return this._color_store;
    }

    set color_store(arg: ColorStoreItem[] | Map<string, ColorStoreItem>) {
        if (Array.isArray(arg)) {
            this.data.color_store = arg;
            this._color_store = new Map<string, ColorStoreItem>(arg.map(i => [i.group, i]));
        } else {
            this.data.color_store = [...arg.values()];
            this._color_store = arg;
        }
        this.save();
    }
}
