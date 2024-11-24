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
        new MessageWork({ mode: "chat-action", msg: "Received the instruction, the penalty mode has been turned on" }),
        new MessageWork({ mode: "action", msg: "It seemed that {player_wg} has done something wrong, which led to her current situation. All the restraints on her body are tightly binding her flesh, and the electric shocks make her struggle and twist like a fish, shaking her body and making her struggle to maintain her sanity and balance." }),
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
        new MessageWork({ mode: "local-status", msg: `>> Penalty mode is activated, estimated duration ${(time / 60 / 1000).toFixed(2)} minutes` }),
        new PunishWork(time),
        new MessageWork({ mode: "local-status", msg: `>> Punishment mode has ended` }),
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
        new MessageWork({ mode: "chat-action", msg: "{player_wg}'s restraints return to their previous mode, and the stun gun returns to standby mode, leaving only {player_wg}'s stiff muscles and the lingering pain from the electric shocks to tell her what had just happened. Although this was not the most severe form of punishment, I hope she has realized her mistake." })
    ];

    TimedWorker.global.push({ description: "punish work", works: works });
}
