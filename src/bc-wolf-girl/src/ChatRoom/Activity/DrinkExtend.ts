import { DrinkAphrodisiac, DrinkRedbull } from "../../Control/Drink";
import { Tools } from "../../Control/OutfitCtrl";
import { IsPlayerWolfGirl } from "../../Control/WolfGirlCtrl";
import { ActivityInfo } from "bc-utilities";
import { ActivityTriggerMode, IActivityExtened } from "./IActivity";
import { DefaultCheckOutfitItem } from "../../Control/OutfitCtrl/Utils";


export class DrinkExtend implements IActivityExtened {
    activity: string = "SipItem";
    mode: ActivityTriggerMode = "onself";
    onBodyparts: AssetGroupItemName[] = ["ItemMouth"];
    on(player: PlayerCharacter, sender: Character, info: ActivityInfo): void {
        if (info.Asset && info.ActivityGroup.startsWith("ItemMouth")) {
            const tItem = sender.Appearance.find(a => a.Asset.Group.Name === info.Asset!.GroupName);
            if (!tItem) return;
            const target = Tools.find(i => i.Asset.Group === info.Asset!.GroupName
                && i.Asset.Name === info.Asset!.AssetName && i.Craft.Name === info.Asset!.CraftName);
            if (!target) return;
            if (!DefaultCheckOutfitItem(tItem, target)) return;

            if (target.Craft.Name === "情欲之水") {
                if (IsPlayerWolfGirl(player))
                    DrinkAphrodisiac(player);
            } else if (target.Craft.Name === "特种红牛") {
                DrinkRedbull(player);
            }
        }
    }
}