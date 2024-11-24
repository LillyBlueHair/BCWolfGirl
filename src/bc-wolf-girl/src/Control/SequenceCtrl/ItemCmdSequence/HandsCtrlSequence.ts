import { CommonWork, DelayWork } from "../../CommonWork";
import { MessageSimWrongCoding, ParseMessage } from "../../Message";
import { MessageWork } from "../../MessageWork";
import { OutfitItemsMap } from "../../OutfitCtrl";
import { DefaultCheckItemByGroup, CheckMissingItems } from "../../OutfitCtrl/Utils";
import { RandomSinglePunishWork } from "../../PunishWork";
import { ControllerType, TestCtrlMissingResult, TestCtrlResult } from "../../WolfGirlCtrl/IController";
import { CtrlType } from "../../WolfGirlCtrl/IController";
import { RunControls } from "../../WolfGirlCtrl";
import { TestControlWork } from "../../WolfGirlCtrl/Works";
import { TimedWork, TimedWorkState, TimedWorker } from "../../Worker";
import { StdMissing, StdMissingMsgBase, StdMissingMsgN, StdMissingMsgNPart } from "./CmdSequenceMessage";
import { CmdSequenceModeMessage } from "./CmdSequenceMessage";
import { CmdData, StdResultBranch } from "./StdCmdSequence";
import { AppearanceUpdate } from "bc-utilities";


export function HandsCtrlSequence(player: PlayerCharacter, mode: CtrlType) {

    const messages: CmdSequenceModeMessage = {
        modes: {
            off: {
                notify: { mode: "chat-action", msg: "Received command, arm restraints are disabled" },
                action: { mode: "action", msg: "The energy beams between the cuffs on {player_wg}'s arms gradually extinguish, and the neural interference module also shuts down the control of the arm. The nanomachines on the gloves return to their original positions with a slight vibration, releasing {player_wg}'s arms and hands. Is it really freedom, or is it just a momentary illusion?" }
            },
            base: {
                notify: { mode: "chat-action", msg: "Received command, arm restraints have been enabled" },
                action: { mode: "action", msg: "The handcuffs on {player_wg}'s arms begin to attract each other, and the coordination between the electrical stimulation system and the neural interference module made the force of the handcuffs tightening. {player_wg} was always slightly greater than her thoughts of struggling and resisting, so she can only watch her arms and fingers being gradually gathered and connected." }
            },
            total: {
                notify: { mode: "chat-action", msg: "Received command, arm restraints have been set to the strongest mode" },
                action: { mode: "action", msg: "The cuffs on {player_wg}'s arms suddenly tighten, and the unquestionable force even makes {player_wg} feel a little pain. She even ignored the nanomachines on the gloves that tighten and press her fists a little bit. The tight closure of her arms and the squeezing of her fingers and palms, or perhaps for {player_wg}'s heart, was this a better situation?" }
            }
        }
    };

    const type: ControllerType = "HandsCtrl";

    let data: CmdData = { type, mode };

    const missing_route_01 = (result: TestCtrlMissingResult) => {
        ParseMessage(StdMissingMsgBase, { player }, { missing_formated: result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join(", ") });
        data.xMessage = StdMissing.action;
    }

    const missing_route_02 = (result: TestCtrlMissingResult) => {
        ParseMessage(StdMissingMsgNPart, { player },
            { missing_formated: result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join(", ") });
        data.xMessage = { mode: "action", msg: "{player_wg}'s central control core beeps a little, and then the fingers of the glove slowly deform and tighten, causing her hands to curl into two balls of flesh that could not be grasped." };
        data.mode = "total";
        data.do_work = true;
    }

    const missing_route_03 = (result: TestCtrlMissingResult) => {
        ParseMessage(StdMissingMsgNPart, { player },
            { missing_formated: result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join(", ") });
        data.xMessage = { mode: "action", msg: "The cuffs on {player_wg}'s arms are quickly tightened with a punishing force, tightening {player_wg}'s arms, which would obviously cause sufficient and lasting pain." };
        data.mode = "total";
        data.do_work = true;
    }

    const missing_route_04 = (result: TestCtrlMissingResult) => {
        ParseMessage(StdMissingMsgN, { player },
            { missing_formated: result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join(", ") });
        data.xMessage = StdMissing.action;
    }

    const missing_route_05 = (result: TestCtrlMissingResult) => {
        const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join(", ");

        if (DefaultCheckItemByGroup(player, "ItemVulva")) {
            ParseMessage(StdMissingMsgN, { player }, { missing_formated });
            data.xMessage = StdMissing.action;
            return;
        }

        if (CheckMissingItems(player).size >= 5) {
            const err_works: TimedWork[] = [
                new MessageWork({ mode: "chat-action", msg: "Received command, arm restraints are disabled" }),
                new CommonWork(() => ParseMessage(StdMissingMsgNPart, { player }, { missing_formated })),
                new MessageWork({ mode: "chat-action", msg: "Received the instruction, arms limit limit limit limit limit limit limit....." }),
                new MessageWork({ mode: "action", msg: "{player_wg}'s central control core emits a sharp and continuous beeping sound, but soon returns to silence." }),
                new MessageWork({ mode: "action", msg: MessageSimWrongCoding(StdMissingMsgBase.msg, 0.5) }),
                new RandomSinglePunishWork(),
                new MessageWork({ mode: "action", msg: MessageSimWrongCoding(StdMissingMsgBase.msg, 0.9) }),
                new RandomSinglePunishWork(),
                new DelayWork(1000),
                new RandomSinglePunishWork(),
                new DelayWork(1000),
                new RandomSinglePunishWork(),
                new MessageWork({ mode: "action", msg: "{player_wg}'s central control core once again emits a sharp sound, but soon returns to silence again." }),
                new MessageWork({ mode: "chat-action", msg: "An error in the execution of a command was detected, and the execution of the command has been terminated and retried." }),
            ];
            TimedWorker.global.insert_after_first({ description: `SetItemSequence${type}`, works: err_works });
            return TimedWorkState.interrupted;
        }

        ParseMessage({ mode: "chat-action", msg: "Received command, arm restraints are disabled" }, { player });
        mode = "off";
        data.do_work = true;
    }

    const work_sequence: TimedWork[] = [
        new TestControlWork(type, mode, StdResultBranch(player, data, (missing_result, data) => {
            if (missing_result.missing.length === 2) return missing_route_01(missing_result);
            if (mode === "off") return missing_route_05(missing_result);
            if (Math.random() < 0.5) return missing_route_04(missing_result);
            if (missing_result.missing.includes("ItemArms")) return missing_route_02(missing_result);
            if (missing_result.missing.includes("ItemHands")) return missing_route_03(missing_result);
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
