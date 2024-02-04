import { EILNetwork } from "../../Network";
import { Tools, ToolsCrate, ToolsInjector } from "./Definition";
import { CraftingItemFromOutfit } from "./Utils";


export function DialogInventoryBuildHandler(C: Character, lock: boolean) {
    if (lock) return;

    Tools.forEach(e => {
        const focus = C.FocusGroup?.Name;
        if (!focus || focus !== e.Asset.Group) return;

        const asset = AssetGet(C.AssetFamily, e.Asset.Group, e.Asset.Name);
        if (!asset) return;
        const craft = CraftingItemFromOutfit(C, e, EILNetwork.Access.craft);
        if (!craft) return;
        if (DialogCanUseCraftedItem(C, craft))
            DialogInventoryAdd(C, { Asset: asset, Craft: craft }, false);
    })

    DialogInventorySort();
}