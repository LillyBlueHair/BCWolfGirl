import { RoomComeHereSequence, RoomForceLeaveSequence, RoomLeaveSequence } from "../../Control/RoomCtrl/RoomCtrl";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites } from "../Prerequistes";


export const RoomCtrls: CommandTemplate[] = [
    {
        match: /^离开这个房间/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            RoomLeaveSequence(player);
            return false;
        }
    },
    {
        match: /^强行离开这个房间/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            RoomForceLeaveSequence(player);
            return false;
        }
    },
    {
        type: "Beep",
        match: /^到我这里来/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            if (!args || !args["BeepRoom"]) RoomForceLeaveSequence(player);
            else RoomComeHereSequence(player, args["BeepRoom"]);
            return false;
        }
    }
];