import { RoomComeHereSequence, RoomForceLeaveSequence, RoomLeaveSequence } from "../../Control/RoomCtrl/RoomCtrl";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites } from "../Prerequistes";


export const RoomCmds: CommandTemplate[] = [
    {
        match: /^离开这个房间/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            RoomLeaveSequence(player, { sender: sender, type: args.type });
        }
    },
    {
        match: /^强行离开这个房间/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            RoomForceLeaveSequence(player, { sender: sender, type: args.type });
        }
    },
    {
        type: "Beep",
        match: /^到我这里来/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            RoomComeHereSequence(player, {
                sender: sender,
                type: args.type,
                room: args.BeepRoom as { name: string, space: string } | undefined
            });
        }
    }
];