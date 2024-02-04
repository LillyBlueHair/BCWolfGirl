import { DrinkAphrodisiac, DrinkRedbull } from "../../Control/Drink";
import { ParseMessage } from "../../Control/Message";
import { Tools } from "../../Control/OutfitCtrl";
import { CheckItemRaw } from "../../Control/OutfitCtrl/Utils";
import { IsPlayerWolfGirl } from "../../Control/WolfGirlCtrl";
import { ActivityInfo } from "../../utils/ChatMessages";
import { ActivityTriggerMode, IActivityExtened } from "./IActivity";


export class DrinkExtend implements IActivityExtened {
    activity: string = "SipItem";
    mode: ActivityTriggerMode = "onself";
    onBodyparts: AssetGroupItemName[] = ["ItemMouth"];
    on(player: Character, sender: Character, info: ActivityInfo): void {
        if (IsPlayerWolfGirl(player)) {
            if (info.Asset && info.ActivityGroup.startsWith("ItemMouth")) {
                const tItem = sender.Appearance.find(a => a.Asset.Group.Name === info.Asset!.GroupName);
                if (!tItem) return;
                const target = Tools.find(i => i.Asset.Group === info.Asset!.GroupName
                    && i.Asset.Name === info.Asset!.AssetName && i.Craft.Name === info.Asset!.CraftName);
                if (!target) return;
                if (!CheckItemRaw(tItem, target)) return;

                if (target.Craft.Name === "情欲之水") {
                    DrinkAphrodisiac(player);
                } else if (target.Craft.Name === "特种红牛") {
                    DrinkRedbull(player);
                }
            }
        }
    }
}