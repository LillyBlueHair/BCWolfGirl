import { OutfitItemsMap } from "./OutfitCtrl";
import { CheckItemRaw } from "./OutfitCtrl/Utils";


export function StashOutfit(player: Character): DataOutfitItem[] {
    let result: DataOutfitItem[] = [];

    player.Appearance.forEach(item => {
        const ti = OutfitItemsMap.get(item.Asset.Group.Name);
        if (ti && CheckItemRaw(item, ti)) {
            result.push({
                asset: {
                    group: item.Asset.Group.Name,
                    name: item.Asset.Name,
                },
                color: item.Color ?? "Default",
                property: item.Property,
            });
        }
    });

    return result;
}