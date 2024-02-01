import { DataManager } from "../../Data";
import { CommonWork, DelayWork } from "../CommonWork";
import { ParseMessage } from "../Message";
import { MessageWork } from "../MessageWork";
import { StashOutfit, StashPopOutfit, StashPopResult } from "../StashOutfit";
import { TimedWork, TimedWorker } from "../Worker";

export function StartStashSequence(player: Character, sender: Character) {
    const work_sequence: TimedWork[] = [
        new MessageWork("chat-action", "正在启动纳米蜂群收纳拘束具进入隐藏模式"),
        new DelayWork(5000),
        new MessageWork("action", "{player_wg}身上的拘束具似乎在一点点溶解，化作金属银色的小小水流沿着皮肤流向主控核心与训练内裤，随着水流的消逝，本有的拘束具尽皆消逝，仿佛不曾存在过，但显然脖颈上的项圈与身体上的训练内裤显然不同意这样的想法"),
        new CommonWork((player) => {
            StashOutfit(player);
            DataManager.outfit.lite_mode = true;
            ParseMessage({ mode: "chat-action", msg: "已切换到轻量物品模式。" });
        })
    ];

    TimedWorker.global.push({ description: "StartStashSequence", works: work_sequence });
}

export function StartStashPopSequence(player: Character, sender: Character) {
    const work_sequence: TimedWork[] = [
        new MessageWork("chat-action", "正在退出拘束隐藏模式，纳米蜂群工作中"),
        new DelayWork(5000),
        new MessageWork("action", "主控核心与训练内裤发出了一阵小小的震动，如若是另一人来看则能发现一些金属银色的小小水流正从中流出，淌向{player_wg}的身体各处，缓缓构建成原有的拘束具并重新连接各处组件"),
        new CommonWork((player) => {
            if (StashPopOutfit(player) === StashPopResult.Locked) {
                ParseMessage({ mode: "chat-action", msg: "存在锁定物品，无法切换模式。" });
            } else {
                DataManager.outfit.lite_mode = false;
                ParseMessage({ mode: "chat-action", msg: "已切换到完整物品模式。" });
            }
        })
    ];
    TimedWorker.global.push({ description: "StartStashPopSequence", works: work_sequence });
}

