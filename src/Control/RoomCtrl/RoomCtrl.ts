import { EILNetwork } from "../../Network";
import { CheckWork, CommonWork, DelayWork } from "../CommonWork";
import { MessageWork } from "../MessageWork";
import { OutfitItemsMap } from "../OutfitCtrl/Definition";
import { TimedWork, TimedWorker } from "../Worker";

export function RoomLeaveSequence(player: Character) {
    const work_sequence: TimedWork[] = [
        new MessageWork("action", "接收到离开房间指令，开始运动学检查"),
        new DelayWork(5000),
        new CheckWork((pl) => {
            let blocked = false;
            pl.Appearance.forEach(e => {
                const saved = OutfitItemsMap.get(e.Asset.Group.Name);
                if (saved) return;

                if (e.Property && e.Property.Effect)
                    blocked = e.Property.Effect.some(f => ["Tethered", "Mounted", "Leash", "Freeze"].includes(f));
            });
            if (blocked) return CheckWork.Rejected;
            return CheckWork.Accepted;
        }, (pl, result) => {
            if (result.passed) return { mode: "action", msg: "狼女{player_id}身上的狼女腿环与狼女行走姿态控制器缓缓点亮，操纵着狼女{player_id}慢慢走向房门外" };
            return { mode: "action", msg: "行动路径规划失败，请移除阻碍物或使用强制离开指令" };
        }),
        new CommonWork(pl => {
            ChatRoomLeave();
            CommonSetScreen("Online", "ChatSearch");
            ServerSend("ChatRoomJoin", { Name: EILNetwork.Access.room.name });
        })
    ];
    TimedWorker.global.push({ description: "Room Leave Sequence", works: work_sequence });
}

export function RoomForceLeaveSequence(player: Character) {
    const work_sequence: TimedWork[] = [
        new MessageWork("chat-action", "强制离开程序已激活，信标布设完毕，准备传送至EIL设施"),
        new DelayWork(5000),
        new MessageWork("action", "狼女{player_id}身后的空间泛起了一阵小小的涟漪，而在近乎瞬间的眩目白光之后，她的身形已经完全消失，只留下小小的气旋"),
        new CommonWork(pl => {
            ChatRoomLeave();
            CommonSetScreen("Online", "ChatSearch");
            ServerSend("ChatRoomJoin", { Name: EILNetwork.Access.room.name });
        })
    ];
    TimedWorker.global.push({ description: "Room Force Leave Sequence", works: work_sequence });
}

export function RoomComeHereSequence(player: Character, room: string) {
    const work_sequence: TimedWork[] = [
        new MessageWork("action", "接收到离开房间指令，开始运动学检查"),
        new DelayWork(5000),
        new CheckWork((pl) => {
            let blocked = false;
            pl.Appearance.forEach(e => {
                const saved = OutfitItemsMap.get(e.Asset.Group.Name);
                if (saved) return;

                if (e.Property && e.Property.Effect)
                    blocked = e.Property.Effect.some(f => ["Tethered", "Mounted", "Leash", "Freeze"].includes(f));
            });
            if (blocked) return CheckWork.Rejected;
            return CheckWork.Accepted;
        }, (pl, result) => {
            if (result.passed) return { mode: "action", msg: "狼女{player_id}身上的狼女腿环与狼女行走姿态控制器缓缓点亮，操纵着狼女{player_id}慢慢走向房门外" };
            return { mode: "action", msg: "行动路径规划失败，请移除阻碍物或使用强制离开指令" };
        }),
        new CommonWork(pl => {
            ChatRoomLeave();
            CommonSetScreen("Online", "ChatSearch");
            CommonSetScreen("Online", "ChatSearch");
            ChatRoomPlayerCanJoin = true;
            ServerSend("ChatRoomJoin", { Name: room });
        })
    ];
    TimedWorker.global.push({ description: "Room Come Here Sequence", works: work_sequence });
}