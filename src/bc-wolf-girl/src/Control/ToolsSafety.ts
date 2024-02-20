import { AppearanceUpdate } from "bc-utilities";
import { CheckItemsWork, CommonWork } from "./CommonWork";
import { ParseMessage } from "./Message";
import { MessageWork } from "./MessageWork";
import { CheckItem, ToolsInjector, ToolsVisor } from "./OutfitCtrl";
import { TimedWork, TimedWorkState, TimedWorker } from "./Worker";

export function InitSafetyUndressSequence(player: PlayerCharacter): void {
    const work_sequence: TimedWork[] = [
        new CheckItemsWork([ToolsVisor, ToolsInjector], (player, result) => {
            if (result.missing.length == 2) {
                return TimedWorkState.interrupted;
            } else {
                ParseMessage({ mode: "local", msg: "发现长时间未使用注册安装道具，开始自动收纳过程。" });
            }
        }, false),
        new CommonWork((player) => {
            if (CheckItem(player, ToolsInjector, false)) {
                player.Appearance = player.Appearance.filter(i => i.Asset.Group.Name !== ToolsInjector.Asset.Group);
                AppearanceUpdate(player, ToolsInjector.Asset.Group);
                ParseMessage({ mode: "local", msg: `${ToolsInjector.Craft.Name}已经完成收纳` });
            }
        }),
        new CommonWork((player) => {
            if (CheckItem(player, ToolsVisor, false)) {
                player.Appearance = player.Appearance.filter(i => i.Asset.Group.Name !== ToolsVisor.Asset.Group);
                AppearanceUpdate(player, ToolsVisor.Asset.Group);
                ParseMessage({ mode: "local", msg: `${ToolsVisor.Craft.Name}已经完成收纳` });
            }
        }),
        new MessageWork({ mode: "local", msg: "系统提醒您：不要手持工具玩耍，这样很危险。" }),
    ]
    TimedWorker.global.push({ description: "InitSafetyUndressSequence", works: work_sequence });
}

export class ToolsSafety {
    private holdStart: number = 0;
    constructor(readonly resolution: number) {
        setInterval(() => {
            if (Player && Player.MemberNumber) {
                if (TimedWorker.global.cur_description !== undefined) {
                    this.holdStart = 0;
                } else if (CheckItem(Player, ToolsVisor, false) && CheckItem(Player, ToolsInjector)) {
                    if (this.holdStart === 0) this.holdStart = Date.now();
                    else if (Date.now() - this.holdStart > 300000) {
                        InitSafetyUndressSequence(Player);
                        this.holdStart = 0;
                    }
                }
            }
        }, resolution);
    }


    private static _instance: ToolsSafety | undefined;
    static get instance() { return this._instance as ToolsSafety; }
    static init(resolution: number) {
        if (this._instance) return;
        this._instance = new ToolsSafety(resolution);
    }

}