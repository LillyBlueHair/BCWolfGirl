import { CommandType } from "../../ChatRoom/ICmds";
import { EILNetwork } from "../../Network";
import { ExtractMemberNumber } from "../../utils/Character";
import { CheckItemsWork, CheckWork, CommonWork, DelayWork } from "../CommonWork";
import { ParseMessage, RouteIM } from "../Message";
import { MessageWork } from "../MessageWork";
import { OutfitItemsMap } from "../OutfitCtrl/Definition";
import { DefaultCheckOutfitItem } from "../OutfitCtrl/Utils";
import { StdMissingAction, StdMissingMsgN } from "../SequenceCtrl/ItemCmdSequence/CmdSequenceMessage";
import { TimedWork, TimedWorkState, TimedWorker } from "../Worker";
import { ChatRoomWork } from "./Work";

export function RoomLeaveSequence(player: PlayerCharacter, cmd_src: { sender: number | Character, type: CommandType }) {
    const work_sequence: TimedWork[] = [
        new MessageWork("action", "接收到离开房间指令，开始运动学检查"),
        new CheckItemsWork(["ItemLegs", "ItemFeet", "ItemBoots"], (pl, result) => {
            const missing_formated = result.missing.map(g => g.Craft.Name).join("、");
            if (result.missing.length === 3) {
                RouteIM(cmd_src.type, player, cmd_src.sender, StdMissingMsgN.msg, { missing_formated });
                ParseMessage(StdMissingAction, { player });
                return TimedWorkState.interrupted;
            }
            RouteIM(cmd_src.type, player, cmd_src.sender, `收到指令，正在规划路径并执行`);
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
                ParseMessage({ mode: "action", msg: "{player_wg}身上的行走姿态控制器缓缓点亮，操纵着{player_wg}慢慢走向房门外" }, { player });
            } else {
                RouteIM(cmd_src.type, player, cmd_src.sender, `行动路径规划失败，请移除阻碍物或使用强制离开指令`);
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
                const missing_formated = result.missing.map(g => g.Craft.Name).join("、");
                CurryRouteIM(StdMissingMsgN.msg, { missing_formated });
                ParseMessage(StdMissingAction, { player });
                return TimedWorkState.interrupted;
            }
            CurryRouteIM(`强制离开程序已激活，信标布设完毕，准备传送至EIL设施`);
        }),
        new DelayWork(5000),
        new MessageWork("action", "{player_wg}身后的空间泛起了一阵小小的涟漪，而在近乎瞬间的眩目白光之后，她的身形已经完全消失，只留下小小的气旋"),
        new ChatRoomWork(EILNetwork.Access.room, (pl, reason) => {
            CurryRouteIM("无法进入EIL设施，房间满员或锁定");
        }, (pl, dest) => {
            ParseMessage({ mode: "action", msg: "{player_wg}随着一瞬眩目的白光出现在传送机之中，稍稍扰乱了设施内舒适的气温" }, { player });
        }),
        new MessageWork("chat-action", "欢迎来到EIL设施，维护服务请自助，寄存服务请寻找猫女仆，新晋狼女训练请寻找训练师，祝玩的开心"),
    ];
    TimedWorker.global.push({ description: "Room Force Leave Sequence", works: work_sequence });
}

export function RoomComeHereSequence(player: PlayerCharacter, cmd_src: { sender: number | Character, type: CommandType, room: { name: string, space: ServerChatRoomSpace } | undefined }) {

    let data: { work?: "leave-join" | "leave-only" } = {}

    const CurryRouteIM = (msg: string, args?: { [key: string]: any }) => RouteIM(cmd_src.type, player, cmd_src.sender, msg, args);

    const work_sequence: TimedWork[] = [
        new CheckItemsWork(["ItemLegs", "ItemFeet", "ItemBoots"], (pl, result) => {
            if (result.missing.length === 3) {
                const missing_formated = result.missing.map(g => g.Craft.Name).join("、");
                CurryRouteIM(StdMissingMsgN.msg, { missing_formated });
                ParseMessage(StdMissingAction, { player });
                return TimedWorkState.interrupted;
            }
            CurryRouteIM(`收到指令，正在规划路径并执行`);
            ParseMessage({ mode: "chat-action", msg: "收到指令，正在规划路径并执行" }, { player })
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
                CurryRouteIM(`行动路径规划失败，有阻碍物`);
                ParseMessage(StdMissingAction, { player });
            }
        }),
        new CheckItemsWork(["ItemNeckAccessories"], (pl, result) => {
            if (result.missing.length === 1 || cmd_src.room === undefined) {
                data.work = "leave-only";
            } else {
                data.work = "leave-join";
                CurryRouteIM(`正在前往`);
            }
        }),
        new MessageWork("action", "{player_wg}的行走姿态控制器缓缓点亮，操纵着{player_wg}慢慢走向房门外"),
        new ChatRoomWork(cmd_src.room, (pl, reason) => {
            CurryRouteIM(`已离开先前房间，但无法进入{sender_num}所在房间，房间满员或锁定`, { sender_num: cmd_src.sender });
        }, (pl, dest) => {
            if (dest === undefined) {
                CurryRouteIM(`指令中未包含房间信息，无法执行进入房间操作。`, { sender_num: cmd_src.sender });
            } else {
                if (data.work === "leave-only") {
                    CurryRouteIM(`身份信标丢失，通行证明异常，已离开先前房间，但无法进入{sender_num}所在房间`, { sender_num: cmd_src.sender });
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
            ParseMessage({ mode: "action", msg: "{player_wg}身上的行走姿态控制器控制着{player_wg}进入了房间，走到{target_name}身边，顺从的用身体蹭了蹭{target_name}" }, { player }, { target_name });
        }),
    ];
    TimedWorker.global.push({ description: "Room Come Here Sequence", works: work_sequence });
}