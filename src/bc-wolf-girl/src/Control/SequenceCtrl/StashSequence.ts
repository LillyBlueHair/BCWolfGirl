import { DataManager } from "../../Data";
import { CheckItemsWork, CommonWork, DelayWork } from "../CommonWork";
import { ParseMessage } from "../Message";
import { MessageWork } from "../MessageWork";
import { GatherColorStoreItem, StashOutfit, StashPopOutfit, StashPopResult } from "../StashOutfit";
import { TimedWork, TimedWorkState, TimedWorker } from "../Worker";
import { StdMissingAction, StdMissingMsgN } from "./ItemCmdSequence/CmdSequenceMessage";
import { PushMissingStopSequence } from "./StopSequence";

export function StartStashSequence(player: PlayerCharacter) {
    const work_sequence: TimedWork[] = [
        new CheckItemsWork(["ItemNeck", "ItemPelvis"], (player, result) => {
            if (result.missing.length > 0) {
                PushMissingStopSequence(result.missing.map(g => g.Craft.Name).join(", "));
                return TimedWorkState.interrupted;
            } else {
                ParseMessage({ mode: "chat-action", msg: `Activating the Nano-bee Swarm Storage Restraint Device to enter hidden mode` });
            }
        }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "{player_wg}'s restraints seem to be dissolving bit by bit, turning into a small stream of metallic silver water flowing along her skin to the main control core and training underwear. As the water flow disappears, the original restraints disappear as if they had never existed. However, the collar on her neck and the training underwear on her body obviously disagreed with this idea." }),
        new CommonWork((player) => {
            StashOutfit(player);
            DataManager.outfit.lite_mode = true;
            ParseMessage({ mode: "chat-action", msg: "Switched to lightweight item mode." });
        })
    ];

    TimedWorker.global.push({ description: "StartStashSequence", works: work_sequence });
}

export function StartStashPopSequence(player: PlayerCharacter) {
    const work_sequence: TimedWork[] = [
        new CheckItemsWork(["ItemNeck", "ItemPelvis"], (player, result) => {
            if (result.missing.length > 0) {
                PushMissingStopSequence(result.missing.map(g => g.Craft.Name).join(", "));
                return TimedWorkState.interrupted;
            } else {
                ParseMessage({ mode: "chat-action", msg: `Exiting restraint hiding mode, nanobee swarm at work` });
            }
        }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "The main control core and training underwear vibrate slightly. If someone else were to look, they would see some small streams of metallic silver flowing out of them, flowing to all parts of {player_wg}'s body, slowly forming the original restraints and reconnecting the various components." }),
        new CommonWork((player) => {
            if (StashPopOutfit(player) === StashPopResult.Locked) {
                ParseMessage({ mode: "chat-action", msg: "There is a locked item, unable to switch modes." });
            } else {
                DataManager.outfit.lite_mode = false;
                ParseMessage({ mode: "chat-action", msg: "Switched to full item mode." });
            }
        })
    ];
    TimedWorker.global.push({ description: "StartStashPopSequence", works: work_sequence });
}

export function ColorSaveSequence(player: PlayerCharacter, sender: Character) {
    const work_sequence: TimedWork[] = [
        new MessageWork({ mode: "chat-action", msg: "Received command, scanning for changes in package appearance" }),
        new MessageWork({ mode: "action", msg: "Several small streams of metallic silver water flow out of {player_wg}'s collar, slowly flowing along {player_wg}'s body to the restraints on various parts of her body. After a short stay, they return to the collar along the same path." }),
        new DelayWork(5000),
        new CommonWork((player) => {
            DataManager.outfit.color_store = GatherColorStoreItem(player);
            const collar = player.Appearance.find(a => a.Asset.Group.Name === "ItemNeck");
            const color = (collar?.Color ?? ["#000000"])[0];
            ParseMessage({ mode: "chat-action", msg: `The color scheme has been scanned and stored in the core, the current color scheme is marked as (${color})` });
        })
    ];
    TimedWorker.global.push({ description: "ColorSaveSequence", works: work_sequence });
}