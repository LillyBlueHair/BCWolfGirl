import { CommandType } from "../../ChatRoom/ICmds";
import { EILNetwork } from "../../Network";
import { ExtractMemberNumber } from "../../utils/Character";
import { CheckItemsWork, CheckWork, CommonWork, DelayWork } from "../CommonWork";
import { ParseMessage, RouteIM } from "../Message";
import { MessageWork, } from "../MessageWork";
import { OutfitItemsMap } from "../OutfitCtrl/Definition";
import { DefaultCheckOutfitItem } from "../OutfitCtrl/Utils";
import { StdMissingAction, StdMissingMsgN } from "../SequenceCtrl/ItemCmdSequence/CmdSequenceMessage";
import { TimedWork, TimedWorkState, TimedWorker } from "../Worker";
import { ChatRoomWork } from "./Work";

export function RoomLeaveSequence(player: PlayerCharacter, cmd_src: { sender: number | Character, type: CommandType }) {
    const work_sequence: TimedWork[] = [
        new MessageWork({ mode: "action", msg: "Received the command to leave the room and started the kinematic check" }),
        new CheckItemsWork(["ItemLegs", "ItemFeet", "ItemBoots"], (pl, result) => {
            const missing_formated = result.missing.map(g => g.Craft.Name).join(", ");
            if (result.missing.length === 3) {
                RouteIM(cmd_src.type, player, cmd_src.sender, StdMissingMsgN.msg, { missing_formated });
                ParseMessage(StdMissingAction, { player });
                return TimedWorkState.interrupted;
            }
            RouteIM(cmd_src.type, player, cmd_src.sender, `Received the command, planning the path and executing it`);
        }),
        new CheckWork((pl) => {
            if (pl.Appearance.some(e => {
                if (OutfitItemsMap.has(e.Asset.Group.Name)) return false;
                if (e.Property && e.Property.Effect)
                    return e.Property.Effect.some(f => ["Tethered", "Mounted", "Leash", "Freeze"].includes(f));
            })) return CheckWork.Rejected;
            return CheckWork.Accepted;
        }, (pl, result) => {
            if (result.passed) {
                ParseMessage({ mode: "action", msg: "The walking posture controller on {player_wg} lights up, controlling {player_wg} to slowly walk out of the room." }, { player });
            } else {
                RouteIM(cmd_src.type, player, cmd_src.sender, `Action path planning failed, please remove obstacles or use forced exit command`);
                ParseMessage(StdMissingAction, { player });
            }
        }),
        new DelayWork(5000),
        new ChatRoomWork(undefined),
    ];
    TimedWorker.global.push({ description: "Room Leave Sequence", works: work_sequence });
}

export function RoomForceLeaveSequence(player: PlayerCharacter, cmd_src: { sender: number | Character, type: CommandType }) {
    const CurryRouteIM = (msg: string, args?: { [key: string]: any }) => RouteIM(cmd_src.type, player, cmd_src.sender, msg, args);

    const work_sequence: TimedWork[] = [
        new CheckItemsWork(["ItemVulvaPiercings", "ItemNipplesPiercings"], (pl, result) => {
            if (result.missing.length === 2) {
                const missing_formated = result.missing.map(g => g.Craft.Name).join(", ");
                CurryRouteIM(StdMissingMsgN.msg, { missing_formated });
                ParseMessage(StdMissingAction, { player });
                return TimedWorkState.interrupted;
            }
            CurryRouteIM(`Forced departure procedure activated, beacon deployed, ready to be transmitted to EIL facility`);
        }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "The space behind {player_wg} ripples slightly, and after a nearly instant of blinding white light, her figure completely disappears, leaving only a small cyclone behind." }),
        new ChatRoomWork(EILNetwork.Access.room, (pl, reason) => {
            CurryRouteIM("No access to EIL facilities, rooms are full or locked");
        }, (pl, dest) => {
            ParseMessage({ mode: "action", msg: "{player_wg}A blinding white light suddenly appears in the teleporter, slightly disturbing the comfortable temperature in the facility." }, { player });
        }),
        new MessageWork({ mode: "chat-action", msg: "Welcome to the EIL facility. Please do your own maintenance. Please find a cat maid for storage services. Please find a trainer for new wolf girls. Have fun." }),
    ];
    TimedWorker.global.push({ description: "Room Force Leave Sequence", works: work_sequence });
}

export function RoomComeHereSequence(player: PlayerCharacter, cmd_src: { sender: number | Character, type: CommandType, room: { name: string, space: ServerChatRoomSpace } | undefined }) {

    let data: { work?: "leave-join" | "leave-only" } = {}

    const CurryRouteIM = (msg: string, args?: { [key: string]: any }) => RouteIM(cmd_src.type, player, cmd_src.sender, msg, args);

    const work_sequence: TimedWork[] = [
        new CheckItemsWork(["ItemLegs", "ItemFeet", "ItemBoots"], (pl, result) => {
            if (result.missing.length === 3) {
                const missing_formated = result.missing.map(g => g.Craft.Name).join(", ");
                CurryRouteIM(StdMissingMsgN.msg, { missing_formated });
                ParseMessage(StdMissingAction, { player });
                return TimedWorkState.interrupted;
            }
            CurryRouteIM(`Received the command, planning the path and executing it`);
            ParseMessage({ mode: "chat-action", msg: "Received the command, planning the path and executing it" }, { player })
        }),
        new CheckWork((pl) => {
            if (pl.Appearance.some(e => {
                const oi = OutfitItemsMap.get(e.Asset.Group.Name);
                if (oi && DefaultCheckOutfitItem(e, oi)) return false;
                if (Array.isArray(e.Property?.Effect))
                    return e.Property.Effect.some(f => ["Tethered", "Mounted", "Freeze"].includes(f));
                return false;
            })) return CheckWork.Rejected;
            return CheckWork.Accepted;
        }, (pl, result) => {
            if (!result.passed) {
                CurryRouteIM(`Action path planning failed, there are obstacles`);
                ParseMessage(StdMissingAction, { player });
            }
        }),
        new CheckItemsWork(["ItemNeckAccessories"], (pl, result) => {
            if (result.missing.length === 1 || cmd_src.room === undefined) {
                data.work = "leave-only";
            } else {
                data.work = "leave-join";
                CurryRouteIM(`Heading to`);
            }
        }),
        new MessageWork({ mode: "action", msg: "{player_wg}'s walking posture controller lights up, controlling {player_wg} to slowly walk out of the door." }),
        new ChatRoomWork(cmd_src.room, (pl, reason) => {
            CurryRouteIM(`Left the previous room, but cannot enter the room where {sender_num} is located, the room is full or locked`, { sender_num: cmd_src.sender });
        }, (pl, dest) => {
            if (dest === undefined) {
                CurryRouteIM(`The command does not contain room information, so the room entry operation cannot be performed.。`, { sender_num: cmd_src.sender });
            } else {
                if (data.work === "leave-only") {
                    CurryRouteIM(`The identity beacon is lost, the pass is abnormal, and the previous room has been left, but the room where {sender_num} is located cannot be entered`, { sender_num: cmd_src.sender });
                }
            }
        }),
        new CommonWork((pl) => {
            const sender_num = ExtractMemberNumber(cmd_src.sender);
            const target: any = ChatRoomCharacter.find(c => c.MemberNumber === sender_num);
            const target_name = (() => {
                if (target) return CharacterNickname(target);
                else {
                    const friend = pl.FriendNames?.get(sender_num);
                    if (friend === undefined) return sender_num.toString();
                    return friend;
                }
            })();
            ParseMessage({ mode: "action", msg: "{player_wg}'s walking posture controller controlls {player_wg} to enter the room, walk to {target_name}, and obediently rub {target_name} with her body." }, { player }, { target_name });
        }),
    ];
    TimedWorker.global.push({ description: "Room Come Here Sequence", works: work_sequence });
}