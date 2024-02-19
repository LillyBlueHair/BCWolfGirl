import { AppearanceUpdate, GatherAppMap } from "../../utils/Apperance";
import { OutfitItemsMap, OutfitItems } from "./Definition";
import { TimedWork } from "../Worker";
import { TimedWorkState } from "../Worker";
import { CalculateLocks, ItemFromOutfit } from "./Utils";
import { ExtractMemberNumber } from "../../utils/Character";
import { OutfitItemType } from "bc-utilities";

export class ItemWearWork extends TimedWork {
    readonly _items: OutfitItemType[];
    readonly _target: number;
    readonly _craft?: { uid: number, name: string };
    constructor(readonly items: string[] | OutfitItemType[], target: number | Character, craft?: { uid: number, name: string }) {
        super();
        if (items.length === 0) this._items = [];
        else if (typeof items[0] === "string") this._items = (items as string[]).map(e => OutfitItemsMap.get(e) as OutfitItemType);
        else this._items = items as OutfitItemType[];
        this._target = ExtractMemberNumber(target);
        this._craft = craft;
    }

    static ItemWearSingle(item: OutfitItemType, target: Character) {
        const item_ = ItemFromOutfit(target, target, item);
        if (!item_) return;
        const oldIdx = target.Appearance.findIndex(e => e.Asset.Group === item_.Asset.Group);
        if (oldIdx >= 0) target.Appearance[oldIdx] = item_;
        else target.Appearance.push(item_);
    }

    run(player: PlayerCharacter): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        if (!target) return TimedWorkState.interrupted;

        this._items.forEach(outfit => ItemWearWork.ItemWearSingle(outfit, target));
        AppearanceUpdate(target);
        return TimedWorkState.finished;
    }
}

interface ItemOptionWorkIUnit {
    readonly target: Item;
    readonly option: TypeRecord;
}

interface ItemOptionWorkSUnit {
    readonly target: string;
    readonly option: TypeRecord;
}

type ItemOptionWorkUnit = ItemOptionWorkIUnit | ItemOptionWorkSUnit;

export class ItemOptionWork extends TimedWork {
    readonly _target: number;
    readonly _options: ItemOptionWorkUnit[];

    constructor(target: number | Character, option: ItemOptionWorkUnit[]) {
        super();
        this._target = ExtractMemberNumber(target);
        this._options = option;
    }

    static ItemOptionSingleI(target: Character, option: ItemOptionWorkIUnit) {
        ExtendedItemSetOptionByRecord(target, option.target, option.option);
    }

    static ItemOptionSingleS(target: Character, option: ItemOptionWorkSUnit) {
        const item = target.Appearance.find(e => e.Asset.Group.Name === option.target);
        if (!item) return;
        ExtendedItemSetOptionByRecord(target, item, option.option);
    }

    run(player: PlayerCharacter): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        if (!target) return TimedWorkState.interrupted;

        const app_map = GatherAppMap(target);
        (this._options.map(i => { return { target: typeof i.target === "string" ? app_map.get(i.target) : i.target, option: i.option } })
            .filter(i => i.target) as ItemOptionWorkIUnit[])
            .forEach(option => ItemOptionWork.ItemOptionSingleI(target, option));
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
        this._target = ExtractMemberNumber(target);
    }

    run(player: PlayerCharacter): TimedWorkState {
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
        AppearanceUpdate(target);
        return TimedWorkState.finished;
    }
}

export class ClothRemoveWork extends TimedWork {
    readonly _stash: Item[];
    readonly _target: number;
    constructor(target: number | Character, readonly stash: Item[]) {
        super();
        this._stash = stash;
        this._target = ExtractMemberNumber(target);
    }

    run(player: PlayerCharacter): TimedWorkState {
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
        this._target = ExtractMemberNumber(target);
    }

    run(player: PlayerCharacter): TimedWorkState {
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
        this._target = ExtractMemberNumber(target);
        this._lock = lock;
    }

    run(player: PlayerCharacter): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        if (!target) return TimedWorkState.interrupted;

        const lock = CalculateLocks(player, target);

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
    readonly property: ItemProperties;
}

export class ItemPropertyWork extends TimedWork {
    readonly _target: number;
    readonly _items: ItemPropertyWorkItem[];
    constructor(target: number | Character, items: ItemPropertyWorkItem[]) {
        super();
        this._target = ExtractMemberNumber(target);
        this._items = items;
    }

    run(player: PlayerCharacter): TimedWorkState {
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