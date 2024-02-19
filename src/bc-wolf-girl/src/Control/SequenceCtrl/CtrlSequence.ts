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
            if (!result.passed) return { mode: "chat-action", msg: "错误：未处于维护模式中。" }
        }),
        new MessageWork("chat-action", "已收到指令，退出维护模式"),
        new DelayWork(5000),
        new MessageWork("action", "维护舱仓门打开，机械臂将{player_wg}推出，随后开始渐渐变得扭曲，透明，最终仅留下小小的气旋"),
        new ItemRemoveWork(player, [ToolsCrate]),
    ]

    TimedWorker.global.push({ description: "ExitFixSequence", works: work_sequence });
}

