import { AppearanceUpdate } from "../utils/Apperance";
import { OutfitItemMap, OutfitItems } from "./Definition";
import { OutfitItemType, OutfitWork, OutfitWorkState } from "./OutfitTypes";
import { ItemFromOutfit } from "./Utils";


export class ItemWearWork extends OutfitWork {
    readonly _items: OutfitItemType[];
    readonly _target: number;
    constructor(readonly items: string[] | OutfitItemType[], target: number) {
        super();
        if (items.length === 0) this._items = [];
        else if (typeof items[0] === "string") this._items = (items as string[]).map(e => OutfitItemMap.get(e) as OutfitItemType);
        else this._items = items as OutfitItemType[];
        this._target = target;
    }

    run(player: Character): OutfitWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        if (!target) return OutfitWorkState.interrupted;
        this._items.forEach(outfit => {
            const item = ItemFromOutfit(player, target, outfit);
            if (!item) return;
            const oldIdx = target.Appearance.findIndex(e => e.Asset.Group === item.Asset.Group);
            if (oldIdx >= 0) target.Appearance[oldIdx] = item;
            else target.Appearance.push(item);
        });
        AppearanceUpdate(target);
        return OutfitWorkState.finished;
    }
}