import { RoomComeHereSequence, RoomForceLeaveSequence, RoomLeaveSequence } from "../../Control/RoomCtrl/RoomCtrl";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites } from "../Prerequistes";


export const RoomCmds: CommandTemplate[] = [
    {
        match: /^离开这个房间/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            RoomLeaveSequence(player);
        }
    },
    {
        match: /^强行离开这个房间/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            RoomForceLeaveSequence(player);
        }
    },
    {
        type: "Beep",
        match: /^到我这里来/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            if (!args || typeof args["BeepRoom"] !== "string") RoomForceLeaveSequence(player);
            else RoomComeHereSequence(player, args["BeepRoom"]);
        }
    }
];