import { Tools } from "../../Control/OutfitCtrl";
import { IsPlayerWolfGirl } from "../../Control/WolfGirlCtrl";
import { ActivityInfo, ActivityTriggerMode, IActivityExtended } from "bc-utilities";
import { DefaultCheckOutfitItem } from "../../Control/OutfitCtrl/Utils";
import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { ParseMessage } from "../../Control/Message";

export class DrinkExtend extends IActivityExtended<CustomActivities, CustomPrerequisites> {
    constructor() { super("onself", ["ItemMouth"], "SipItem"); }

    on(player: PlayerCharacter, sender: Character, info: ActivityInfo): void {
        if (info.Asset && info.ActivityGroup.startsWith("ItemMouth")) {
            const tItem = sender.Appearance.find(a => a.Asset.Group.Name === info.Asset!.GroupName);
            if (!tItem) return;
            const target = Tools.find(i => i.Asset.Group === info.Asset!.GroupName
                && i.Asset.Name === info.Asset!.AssetName && i.Craft.Name === info.Asset!.CraftName);
            if (!target) return;
            if (!DefaultCheckOutfitItem(tItem, target)) return;

            if (target.Craft.Name === "情欲之水") {
                if (IsPlayerWolfGirl(player)) this.DrinkAphrodisiac(player);
            } else if (target.Craft.Name === "特种红牛") {
                this.DrinkRedbull(player);
            }
        }
    }

    private DrinkAphrodisiac(player: PlayerCharacter) {
        ParseMessage({ mode: "local", msg: "刚刚喝下的东西让你兴奋异常" });
        if (player?.ArousalSettings?.Progress !== undefined) {
            player.ArousalSettings.Progress = 100;
            ActivityOrgasmPrepare(player, false);
        }
    }

    private RedbullDrinkTimeout = 0;

    private DrinkRedbull(player: PlayerCharacter) {
        ParseMessage({ mode: "local", msg: "你喝下了一罐红牛，感觉充满了力量, 似乎能挣脱一切束缚" });
        this.RedbullDrinkTimeout = Date.now() + 15 * 60 * 1000;
    }

    init(mod: ModSDKModAPI<any>): void {
        mod.hookFunction("DialogStruggleStart", 1, (args, next) => {
            const [C, Action, PrevItem, NextItem] = args as [Character, string, Item, Item];
            if (C.MemberNumber === Player?.MemberNumber && this.RedbullDrinkTimeout > Date.now() && Action === "ActionStruggle") {
                PrevItem.Difficulty = -50;
                this.RedbullDrinkTimeout = 0;
            }
            return next(args);
        });
    }
}