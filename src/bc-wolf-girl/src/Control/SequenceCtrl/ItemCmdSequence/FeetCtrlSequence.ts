import { AppearanceUpdate } from "bc-utilities";
import { CommonWork, DelayWork } from "../../CommonWork";
import { MessageSimWrongCoding, ParseMessage } from "../../Message";
import { MessageWork } from "../../MessageWork";
import { OutfitItemsMap } from "../../OutfitCtrl";
import { DefaultCheckItemByGroup, CheckMissingItems } from "../../OutfitCtrl/Utils";
import { RandomSinglePunishWork } from "../../PunishWork";
import { RunControls } from "../../WolfGirlCtrl";
import { ControllerType, TestCtrlMissingResult } from "../../WolfGirlCtrl/IController";
import { CtrlType } from "../../WolfGirlCtrl/IController";
import { TestControlWork } from "../../WolfGirlCtrl/Works";
import { TimedWorkState, TimedWork, TimedWorker } from "../../Worker";
import { CmdSequenceModeMessage, StdMissing, StdMissingMsgBase, StdMissingMsgN, StdMissingMsgNPart } from "./CmdSequenceMessage";
import { CmdData, StdResultBranch } from "./StdCmdSequence";


export function FeetCtrlSequence(player: PlayerCharacter, mode: CtrlType) {
    const messages: CmdSequenceModeMessage = {
        modes: {
            off: {
                notify: { mode: "chat-action", msg: "Received instruction, walking restriction has been turned off" },
                action: { mode: "action", msg: "The indicator lights on the limb action controllers on {player_wg}'s legs slowly turn off. Her legs, now free of any movement restrictions, might be able to stretch out for the first time in a long time. But don't worry, she won't be able to run away." },
            },
            base: {
                notify: { mode: "chat-action", msg: "Received instruction, walking restriction has been enabled" },
                action: { mode: "action", msg: "{player_wg}'s leg motion controller is activated again, making {player_wg} feel the familiar weakness of the leg muscles and the slowness and restriction of the stiff joints. The energy beams between the cuffs announc that {player_wg} is currently in a restricted state, but it seems that she has difficulty taking a step without the energy beam connection." },
            },
            total: {
                notify: { mode: "chat-action", msg: "Received the instruction, the walking restriction has been set to the strongest restriction mode" },
                action: { mode: "action", msg: "{player_wg}'s leg rings are suddenly tightened, without much time to react. Fortunately, the motion posture stabilization system interves in time to prevent {player_wg} from falling to the ground in pain and distress. However, it is only a matter of time before she is pushed down after losing the ability to walk. Who would have thought that {player_wg}, who was standing quietly and with a dignified posture, could not even take the simplest step?" },
            }
        }
    };

    const type: ControllerType = "FeetCtrl";

    let data: CmdData = { type, mode };

    const missing_route_01 = (result: TestCtrlMissingResult, data: CmdData) => {
        const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join(", ");
        ParseMessage(StdMissingMsgBase, { player }, { missing_formated });
        data.xMessage = StdMissing.action;
    }

    const missing_route_02 = (result: TestCtrlMissingResult, data: CmdData) => {
        const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join(", ");
        ParseMessage(StdMissingMsgNPart, { player }, { missing_formated });
        data.xMessage = { mode: "action", msg: "{player_wg}'s limb motion controller starts up with a small error beep from the central control core. She closes her legs and tries to maintain her position and balance as much as possible. However, due to the abnormal configuration parameters of the motion controller, she can only move slowly." };
        data.mode = "base";
        data.do_work = true;
    }

    const missing_route_03 = (result: TestCtrlMissingResult, data: CmdData) => {
        const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join(", ");
        ParseMessage(StdMissingMsgN, { player }, { missing_formated });
        data.xMessage = { mode: "action", msg: "{player_wg}'s body movement controller flashes a few times in rhythm with the central control core's error beep. Apart from that, nothing happens." };
    }

    const missing_route_04 = (result: TestCtrlMissingResult, data: CmdData) => {
        const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join(", ");
        ParseMessage(StdMissingMsgN, { player }, { missing_formated });
        data.xMessage = StdMissing.action;
    }

    const missing_route_05 = (result: TestCtrlMissingResult, data: CmdData) => {
        const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join(", ");

        if (DefaultCheckItemByGroup(player, "ItemVulva")) {
            ParseMessage(StdMissingMsgN, { player }, { missing_formated });
            data.xMessage = StdMissing.action;
            return;
        }

        if (CheckMissingItems(player).size >= 5) {
            const err_works: TimedWork[] = [
                new MessageWork({ mode: "chat-action", msg: "Received instruction, walking restriction has been disabled" }),
                new CommonWork(() => ParseMessage(StdMissingMsgNPart, { player }, { missing_formated })),
                new MessageWork({ mode: "chat-action", msg: "Received the instruction, walking limit limit limit limit limit limit limit limit....." }),
                new MessageWork({ mode: "action", msg: "{player_wg}'s central control core emits a sharp and continuous beeping sound, but soon returns to silence." }),
                new MessageWork({ mode: "action", msg: MessageSimWrongCoding(StdMissingMsgBase.msg, 0.5) }),
                new RandomSinglePunishWork(),
                new MessageWork({ mode: "action", msg: MessageSimWrongCoding(StdMissingMsgBase.msg, 0.9) }),
                new RandomSinglePunishWork(),
                new DelayWork(1000),
                new RandomSinglePunishWork(),
                new DelayWork(1000),
                new RandomSinglePunishWork(),
                new MessageWork({ mode: "action", msg: "{player_wg}'s central control core once again emits a sharp sound, but soon returns to silence." }),
                new MessageWork({ mode: "chat-action", msg: "An error in the execution of a command was detected, and the execution of the command has been terminated and retried." }),
            ];
            TimedWorker.global.insert_after_first({ description: `SetItemSequence${type}`, works: err_works });
            return TimedWorkState.interrupted;
        }

        ParseMessage({ mode: "chat-action", msg: "Received instruction, walking restriction has been disabled" }, { player });
        data.mode = "off";
        data.do_work = true;
    }

    const work_sequence: TimedWork[] = [
        new TestControlWork(type, mode, StdResultBranch(player, data, (missing_result, data) => {
            if (missing_result.missing.length === 3) return missing_route_01(missing_result, data);
            if (mode === "off") return missing_route_05(missing_result, data);
            if (Math.random() < 0.5) return missing_route_04(missing_result, data);
            if (missing_result.missing.length === 1) return missing_route_02(missing_result, data);
            if (missing_result.missing.length === 2) return missing_route_03(missing_result, data);
        }, (data) => {
            const msg = messages.modes[mode];
            if (msg) {
                ParseMessage(msg.notify, { player });
                data.xMessage = msg.action;
                data.do_work = true;
            } else {
                ParseMessage({ mode: "chat-action", msg: `[DEBUG] error message: WGException.${data.type}.MissingDialog.${data.mode}` }, { player });
                return TimedWorkState.interrupted;
            }
        })),
        new CommonWork(() => {
            if (data.do_work) {
                RunControls(player, type, data.mode);
                AppearanceUpdate(player);
            }
        }),
        new CommonWork(() => { if (data.xMessage) ParseMessage(data.xMessage, { player }); }),
    ];

    TimedWorker.global.push({ description: `SetItemSequence${type}`, works: work_sequence });
}
