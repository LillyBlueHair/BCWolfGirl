import { DataManager } from "../../Data";
import { AppearanceUpdate } from "bc-utilities";
import { CommonWork } from "../CommonWork";
import { MessageWork } from "../MessageWork";
import { ItemOptionWork } from "../OutfitCtrl";
import { FuturisticBypass } from "../WolfGirlCtrl/Ctrls/FuturisticBypass";
import { TimedWorker } from "../Worker";
import { PunishWork } from "../PunishWork";



export function StartPunish(player: PlayerCharacter) {
    const time = DataManager.points.punish_time;

    const lock_down = [
        { target: "ItemEars", option: { typed: 3 } },
        { target: 'ItemEyes', option: { typed: 3 } },
        { target: 'ItemArms', option: { typed: 3 } },
        { target: 'ItemHands', option: { typed: 0 } },
        { target: 'ItemFeet', option: { typed: 1 } },
        { target: 'ItemLegs', option: { typed: 1 } }
    ];

    const stash = new Map<string, TypeRecord | null>(lock_down.map(
        i => [i.target, null]
    ));

    const works = [
        new MessageWork({ mode: "chat-action", msg: "收到指令，惩罚模式已开启" }),
        new MessageWork({ mode: "action", msg: "看起来{player_wg}做了些什么错事，导致了现在这一下场，身上所有的拘束具紧束着肉体，而一下又一下的电击令她像是一条鱼一样挣扎扭动，摇晃着身躯苦苦维持着理智与平衡" }),
        new CommonWork((player) => {
            player.Appearance.forEach(item => {
                if (stash.has(item.Asset.Group.Name) && item.Property?.TypeRecord)
                    stash.set(item.Asset.Group.Name, { ...item.Property.TypeRecord });
            });
            FuturisticBypass.instance.on = true;
            lock_down.forEach(i => ItemOptionWork.ItemOptionSingleS(player, i));
            FuturisticBypass.instance.on = false;
            PunishWork.punish_flag = true;
        }),
        new ItemOptionWork(player, lock_down),
        new MessageWork({ mode: "local-status", msg: `>> 惩罚模式启动，持续时间预计${(time / 60 / 1000).toFixed(2)}分钟` }),
        new PunishWork(time),
        new MessageWork({ mode: "local-status", msg: `>> 惩罚模式已结束` }),
        new CommonWork((player) => {
            PunishWork.punish_flag = false;
            FuturisticBypass.instance.on = true;
            player.Appearance.forEach(item => {
                const record = stash.get(item.Asset.Group.Name);
                if (record) ExtendedItemSetOptionByRecord(player, item, record);
            });
            FuturisticBypass.instance.on = false;
            AppearanceUpdate(player);
        }),
        new MessageWork({ mode: "chat-action", msg: "{player_wg}身上的拘束回到了先前的模式，电击器则回到了待机模式，只留下{player_wg}僵硬的肌肉与电击留下的持续疼痛告诉她方才发生了些什么，虽然这并非是最严格的惩处手段，但是希望她已经知道了自己的错误" })
    ];

    TimedWorker.global.push({ description: "punish work", works: works });
}
