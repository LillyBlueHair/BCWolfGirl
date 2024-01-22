import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DataManager } from "../Data";
import { ActivityInfo } from "../utils/ChatMessages";
import { InitDressSequence } from "../Control/CtrlSequence";
import { IsModerator } from "./Prerequistes";
import { IsPlayerWolfGirl } from "../Control/WolfGirlCtrl";
import { StashOutfit, StashPopOutfit, StashPopResult } from "../Control/StashOutfit";
import { ParseMessage } from "../Control/Message";


abstract class IActivity {
    abstract activity: Activity;
    on(player: Character, sender: Character, info: ActivityInfo) { }
    abstract text(keyword: string): string;
}

type ActivityHandler = (player: Character, sender: Character, info: ActivityInfo) => void;

class WolfGirlItemsSwitch extends IActivity {
    activity = {
        Name: "WolfGirlItemsSwitch",
        MaxProgress: 0,
        Prerequisite: ["NotSuspended", "CanInteract", "IsActedWolfGirl"],
        Target: ['ItemNeck'],
        TargetSelf: ['ItemNeck']
    } as Activity;

    on(player: Character, sender: Character, info: ActivityInfo): void {
        if (info.TargetCharacter.MemberNumber === player.MemberNumber && IsModerator(player, sender) && IsPlayerWolfGirl(player)) {
            if (DataManager.outfit.lite_mode) {
                if (StashPopOutfit(player) === StashPopResult.Locked) {
                    ParseMessage({ mode: "chat-action", msg: "存在锁定物品，无法切换模式。" })
                } else {
                    DataManager.outfit.lite_mode = false;
                    ParseMessage({ mode: "chat-action", msg: "已切换到完整物品模式。" })
                }
            } else {
                StashOutfit(player);
                DataManager.outfit.lite_mode = true;
                ParseMessage({ mode: "chat-action", msg: "已切换到轻量物品模式。" })
            }
        }
    }

    text(keyword: string) {
        return "切换物品模式";
    }
}

function onInject(player: Character, sender: Character, info: ActivityInfo) {
    if (player.MemberNumber === player.MemberNumber && info.ActivityName === "Inject" && info.SourceCharacter.MemberNumber === player.MemberNumber) {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === info.TargetCharacter.MemberNumber);
        if (!target) return;
        InitDressSequence(player, target);
    }
}

const ActivityHandlers: Map<string, ActivityHandler[]> = new Map([["Inject", [onInject]]]);
const ActivityTextParse: Map<string, (keyword: string) => string> = new Map();

export function RegisterActivityHandler(act: string, handler: ActivityHandler) {
    const target_list = ActivityHandlers.get(act);
    if (!target_list) ActivityHandlers.set(act, [handler]);
    else target_list.push(handler);
}

export function RegisterActivitiy(act: IActivity) {
    RegisterActivityHandler(act.activity.Name, act.on);
    ActivityTextParse.set(act.activity.Name, act.text);
    ActivityFemale3DCG?.push(act.activity);
    ActivityFemale3DCGOrdering?.push(act.activity.Name);
}

export function RegisterActivities(mod: ModSDKModAPI) {
    const itemSwitch = new WolfGirlItemsSwitch();

    mod.hookFunction("ActivityCheckPrerequisite", 1, (args, next) => {
        const [prereq, acting, acted, group] = args as [string, Character, Character, AssetGroupItemName];
        if (prereq === "IsActedWolfGirl") {
            // act on self
            if (acted.MemberNumber === acting.MemberNumber && Player && Player.MemberNumber === acted.MemberNumber) {
                return DataManager.points.points > 10;
            }
            else return DataManager.permission.canModerate(acting, acted);
        }
        return next(args);
    });

    mod.hookFunction("ActivityDictionaryText", 1, (args, next) => {
        const splits = (args[0] as string).split("-");
        const actviity_name = splits[splits.length - 1];
        const text_parse = ActivityTextParse.get(actviity_name);
        if (text_parse) return text_parse(args[0]);
        return next(args);
    })

    RegisterActivitiy(itemSwitch);
}

export function RunActivityHandlers(player: Character, sender: Character, info: ActivityInfo) {
    ActivityHandlers.get(info.ActivityName)?.forEach(h => h(player, sender, info));
}