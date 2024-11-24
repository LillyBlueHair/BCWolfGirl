import { CheckWork, DelayWork } from "../CommonWork";
import { MessageWork } from "../MessageWork";
import { ToolsCrate } from "../OutfitCtrl";
import { ItemRemoveWork } from "../OutfitCtrl";
import { CheckItem } from "../OutfitCtrl";
import { TimedWork, TimedWorker } from "../Worker";

export function ExitFixSequence(player: PlayerCharacter) {

    const work_sequence: TimedWork[] = [
        new CheckWork(() => {
            if (CheckItem(player, ToolsCrate)) return CheckWork.Accepted;
            return CheckWork.Rejected;
        }, (pl, result) => {
            if (!result.passed) return { mode: "chat-action", msg: "Error: Not in maintenance mode." }
        }),
        new MessageWork({ mode: "chat-action", msg: "Received instruction to exit maintenance mode" }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "The maintenance cabin door opens, and the robotic arm pushes {player_wg} out. Then it gradually becomes distorted and transparent, and finally only a small cyclone was left." }),
        new ItemRemoveWork(player, [ToolsCrate]),
    ]

    TimedWorker.global.push({ description: "ExitFixSequence", works: work_sequence });
}

