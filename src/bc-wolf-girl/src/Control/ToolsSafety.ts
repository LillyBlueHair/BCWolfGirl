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
                ParseMessage({ mode: "local", msg: "It is found that the registered installation props have not been used for a long time, and the automatic storage process begins." });
            }
        }, false),
        new CommonWork((player) => {
            if (CheckItem(player, ToolsInjector, false)) {
                player.Appearance = player.Appearance.filter(i => i.Asset.Group.Name !== ToolsInjector.Asset.Group);
                AppearanceUpdate(player, ToolsInjector.Asset.Group);
                ParseMessage({ mode: "local", msg: `${ToolsInjector.Craft.Name}Completed storage` });
            }
        }),
        new CommonWork((player) => {
            if (CheckItem(player, ToolsVisor, false)) {
                player.Appearance = player.Appearance.filter(i => i.Asset.Group.Name !== ToolsVisor.Asset.Group);
                AppearanceUpdate(player, ToolsVisor.Asset.Group);
                ParseMessage({ mode: "local", msg: `${ToolsVisor.Craft.Name}Completed storage` });
            }
        }),
        new MessageWork({ mode: "local", msg: "The system reminds you: Do not play with tools in your hands, as this is dangerous." }),
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