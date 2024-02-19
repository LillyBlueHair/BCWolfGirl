import { Tools } from "./Definition";
import { ItemFromOutfit } from "./Utils";


export function DialogInventoryBuildHandler(C: Character, lock: boolean) {
    if (lock) return;

    Tools.forEach(e => {
        const focus = C.FocusGroup?.Name;
        if (!focus || focus !== e.Asset.Group) return;

        const item = ItemFromOutfit(C, C, e);

        if (!item || !item.Craft) return;
        if (DialogCanUseCraftedItem(C, item.Craft))
            DialogInventoryAdd(C, { Asset: item.Asset, Craft: item.Craft }, false);
    })

    DialogInventorySort();
}