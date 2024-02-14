import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DataManager } from "../../Data";
import { ActivityDeconstruct, ActivityInfo } from "../../bc-utilities/ChatMessages";
import { IsCollarOn } from "../../Control/WolfGirlCtrl/Check";
import { IActivity, IActivityExtened, IActivityInvokable } from "./IActivity";
import { WolfGirlItemsSwitch } from "./WolfGirlItemsSwitch";
import { InjectionExtend, InjectionExtendInjected } from "./InjectionExtend";
import { DrinkExtend } from "./DrinkExtend";

const ActivityHandlers: Map<string, IActivityInvokable[]> = new Map();
const ActivityCustoms: Map<string, IActivity> = new Map();

function RegisterActivityHandler(act: string, handler: IActivityInvokable) {
    const target_list = ActivityHandlers.get(act);
    if (!target_list) ActivityHandlers.set(act, [handler]);
    else target_list.push(handler);
}

export function RegisterActivitiyExtend(act: IActivityExtened) {
    RegisterActivityHandler(act.activity, act);
}

export function RegisterActivitiyCustom(act: IActivity) {
    RegisterActivityHandler(act.activity.Name, act);
    ActivityCustoms.set(act.activity.Name, act);
    ActivityFemale3DCG?.push(act.activity);
    ActivityFemale3DCGOrdering?.push(act.activity.Name);
}

export function RegisterActivities(mod: ModSDKModAPI, lateHook: (callback: () => void) => void) {
    mod.hookFunction("ActivityCheckPrerequisite", 1, (args, next) => {
        const [prereq, acting, acted, group] = args as [string, Character, Character, AssetGroupItemName];
        if (prereq === "IsActedWolfGirl") {
            // act on self
            if (acted.MemberNumber === acting.MemberNumber && Player && Player.MemberNumber === acted.MemberNumber) {
                return DataManager.points.points > 10;
            }
            else return IsCollarOn(acted) && DataManager.permission.isCommandAuthorized(acted, acting);
        }
        return next(args);
    });

    mod.hookFunction("DrawGetImage", 1, (args, next) => {
        // let image = "Assets/" + C.AssetFamily + "/Activity/" + Act.Name + ".png";
        const values = (args[0] as string).split("/");
        if (values[2] === "Activity") {
            const act = ActivityCustoms.get(values[3].split(".")[0]);
            if (act) return next([act.image]);
        }
        return next(args);
    });

    mod.hookFunction("ActivityDictionaryText", 1, (args, next) => {
        const splits = (args[0] as string).split("-");
        const actviity_name = splits[splits.length - 1];
        return ActivityCustoms.get(actviity_name)?.text(args[0]) ?? next(args);
    })

    mod.hookFunction("ServerSend", 1, (args, next) => {
        if (args[0] !== "ChatRoomChat" || args[1]?.Type !== "Activity") return next(args);
        const dict = args[1].Dictionary;
        if (!dict) return next(args);
        const d = ActivityDeconstruct(dict);
        if (!d) return next(args);

        const myact = ActivityHandlers.get(d.ActivityName);
        if (!myact) return next(args);
        args[1].Dictionary = myact.reduce((acc, act) => act.adjustDict?.(args[1].Content, acc) ?? acc, dict);
        return next(args);
    });

    RegisterActivitiyExtend(InjectionExtend.global);
    RegisterActivitiyExtend(new InjectionExtendInjected);
    RegisterActivitiyExtend(new DrinkExtend);
    RegisterActivitiyCustom(new WolfGirlItemsSwitch);

}

export function RunActivityHandlers(player: Character, sender: Character, info: ActivityInfo) {
    ActivityHandlers.get(info.ActivityName)?.forEach(h => {
        if (h.onBodyparts !== undefined && !h.onBodyparts.includes(info.ActivityGroup as AssetGroupItemName)) return;
        if (h.mode === "onself" && info.TargetCharacter.MemberNumber !== player.MemberNumber) return;
        if (h.mode === "selfonother"
            && (info.TargetCharacter.MemberNumber === player.MemberNumber
                || info.SourceCharacter.MemberNumber !== player.MemberNumber)) return;
        h.on(player, sender, info);
    });
}