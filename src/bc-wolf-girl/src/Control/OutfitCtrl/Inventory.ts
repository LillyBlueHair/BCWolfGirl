import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { Tools } from "./Definition";
import { ItemFromOutfit } from "./Utils";

function DialogInventoryBuildHandler(C: Character, lock: boolean) {
    if (lock) return;

    Tools.forEach(e => {
        const focus = C.FocusGroup?.Name;
        if (!focus || focus !== e.Asset.Group) return;

        const item = ItemFromOutfit(C, C, e);

        if (!item || !item.Craft) return;
        if (DialogCanUseCraftedItem(C, item.Craft, item.Asset))
            DialogInventoryAdd(C, { Asset: item.Asset, Craft: item.Craft }, false);
    })

    DialogInventorySort();
}

export function AdditionalInventoryInit(mod: ModSDKModAPI) {
    mod.hookFunction('DialogInventoryBuild', 1, (args, next) => {
        next(args);
        DialogInventoryBuildHandler(args[0] as Character, args[2] as boolean);
    });
}