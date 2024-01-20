import { EILManger } from "../../Asset";
import { AppearanceUpdate } from "../../utils/Apperance";
import { OutfitItemMap, OutfitItems } from "./Definition";
import { OutfitItemType } from "./OutfitTypes";
import { TimedWork } from "../Worker";
import { TimedWorkState } from "../Worker";
import { ItemFromOutfit } from "./Utils";


function ExtractTarget(target: number | Character): number {
    return typeof target === "number" ? target : target.MemberNumber;
}

export class ItemWearWork extends TimedWork {
    readonly _items: OutfitItemType[];
    readonly _target: number;
    constructor(readonly items: string[] | OutfitItemType[], target: number | Character) {
        super();
        if (items.length === 0) this._items = [];
        else if (typeof items[0] === "string") this._items = (items as string[]).map(e => OutfitItemMap.get(e) as OutfitItemType);
        else this._items = items as OutfitItemType[];
        this._target = ExtractTarget(target);
    }

    run(player: Character): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        const crafter = EILManger.instance.getCraft();
        if (!crafter || !target) return TimedWorkState.interrupted;

        this._items.forEach(outfit => {
            const item = ItemFromOutfit(player, target, outfit, crafter);
            if (!item) return;
            const oldIdx = target.Appearance.findIndex(e => e.Asset.Group === item.Asset.Group);
            if (oldIdx >= 0) target.Appearance[oldIdx] = item;
            else target.Appearance.push(item);
        });
        AppearanceUpdate(target);
        return TimedWorkState.finished;
    }
}

interface ItemOptionWorkItem {
    readonly group: string;
    readonly option: TypeRecord;
}

export class ItemOptionWork extends TimedWork {
    readonly _target: number;
    readonly _options: ItemOptionWorkItem[];

    constructor(target: number | Character, option: ItemOptionWorkItem[]) {
        super();
        this._target = ExtractTarget(target);
        this._options = option;
    }

    run(player: Character): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        if (!target) return TimedWorkState.interrupted;

        this._options.forEach(option => {
            const item = target.Appearance.find(e => e.Asset.Group.Name === option.group);
            if (!item) return;
            ExtendedItemSetOptionByRecord(target, item, option.option);
        });
        if (this._options.length > 0) AppearanceUpdate(target);
        return TimedWorkState.finished;
    }
}

export class ItemRemoveWork extends TimedWork {
    readonly _items: (string | OutfitItemType)[];
    readonly _target: number;
    constructor(target: number | Character, readonly items: (string | OutfitItemType)[]) {
        super();
        this._items = items;
        this._target = ExtractTarget(target);
    }

    run(player: Character): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        if (!target) return TimedWorkState.interrupted;
        const new_app: Item[] = []
        target.Appearance.forEach(e => {
            if (!this._items.some(item => {
                if (typeof item === "string") return e.Asset.Name === item;
                return e.Asset.Group.Name === item.Asset.Group && e.Asset.Name === item.Asset.Name;
            })) new_app.push(e);
        });
        target.Appearance = new_app;
        return TimedWorkState.finished;
    }
}

export class ClothRemoveWork extends TimedWork {
    readonly _stash: Item[];
    readonly _target: number;
    constructor(target: number | Character, readonly stash: Item[]) {
        super();
        this._stash = stash;
        this._target = ExtractTarget(target);
    }

    run(player: Character): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        if (!target) return TimedWorkState.interrupted;
        const new_app: Item[] = []
        target.Appearance.forEach(e => {
            if (e.Asset.Group.Clothing) {
                this._stash.push(e);
            } else {
                new_app.push(e);
            }
        });
        target.Appearance = new_app;
        AppearanceUpdate(target);
        return TimedWorkState.finished;
    }
}

export class ClothRestoreWork extends TimedWork {
    readonly _stash: Item[];
    readonly _target: number;
    constructor(target: number | Character, readonly stash: Item[]) {
        super();
        this._stash = stash;
        this._target = ExtractTarget(target);
    }

    run(player: Character): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        if (!target) return TimedWorkState.interrupted;
        target.Appearance = target.Appearance.concat(this._stash);
        AppearanceUpdate(target);
        return TimedWorkState.finished;
    }
}

export class ItemLockWork extends TimedWork {
    readonly _target: number;
    readonly _group: string[];
    readonly _lock?: string;
    constructor(readonly group: string[], target: number | Character, lock?: string) {
        super();
        this._group = group;
        this._target = ExtractTarget(target);
        this._lock = lock;
    }

    run(player: Character): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        if (!target) return TimedWorkState.interrupted;

        const lock = (() => {
            if (this._lock) return this._lock;

            if (target.Ownership && target.Ownership.MemberNumber === player.MemberNumber)
                return "OwnerPadlock";
            if (target.Lovership && target.Lovership.some(e => e.MemberNumber === player.MemberNumber))
                return "LoverPadlock";
            return "ExclusivePadlock";
        })()

        this._group.forEach(group => {
            const item = target.Appearance.find(e => e.Asset.Group.Name === group);
            if (item) InventoryLock(target, item, lock, player.MemberNumber, false);
        })
        AppearanceUpdate(target);
        return TimedWorkState.finished;
    }
}

interface ItemPropertyWorkItem {
    readonly group: string;
    readonly property: ItemProperty;
}

export class ItemPropertyWork extends TimedWork {
    readonly _target: number;
    readonly _items: ItemPropertyWorkItem[];
    constructor(target: number | Character, items: ItemPropertyWorkItem[]) {
        super();
        this._target = ExtractTarget(target);
        this._items = items;
    }

    run(player: Character): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        if (!target) return TimedWorkState.interrupted;
        this._items.forEach(item => {
            const item_ = target.Appearance.find(e => e.Asset.Group.Name === item.group);
            if (!item_) return;
            if (!item_.Property) item_.Property = {};
            Object.assign(item_.Property, item.property);
        })
        AppearanceUpdate(target);
        return TimedWorkState.finished;
    }
}