import { DataManager } from "../../Data";
import { ExtractMemberNumber } from "../../utils/Character";
import { CommandTemplate } from "../ICmds";
import { RouteIM } from "../../Control/Message";
import { BasicPrerequisites } from "../Prerequistes";


export const PermCmds: CommandTemplate[] = [
    {
        match: /((打开|关闭)恋人语音权限)|(((Open)|(Close)) Lover voice permission)/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            DataManager.permission.setLoverMode(content[2] === "打开" || content[4].toLowerCase() == "open");

            const data = DataManager.permission.data;
            const perm_report = "Current voice permissions:\n"
                + "  Lover voice permission: " + (data.loverModerators ? "Open" : "Closed")

            RouteIM(args.type, player, sender, perm_report);
        }
    },
    {
        match: /((设置(添加|移除)|((add )|(remove )))(\d{1,10})(语音权限)|( voice permission))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            const add = (content[3] === "添加" || content[4].toLowerCase() === "add");
            const id = parseInt(content[7]);
            DataManager.permission.setModerator(id, add);

            const perm = DataManager.permission;
            const perm_report = "Current voice permissions:\n"
                + "  Additional permissions list: " + (perm.isAdditionModerator(id) ? "+" : "-") + " " + id;

            RouteIM(args.type, player, sender, perm_report);
        }
    },
    {
        match: /(查询语音权限)|(get voice permissions)/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            const num = ExtractMemberNumber(sender);
            const data = DataManager.permission.data;
            const perm_report = "Current voice permissions:\n"
                + "  Lover voice permission: " + (data.loverModerators ? "Open" : "Closed") + "\n"
                + "  Additional permissions list:\n"
                + data.moderators.map((i, idx, arr) => `    ${i}`).join("\n");

            RouteIM(args.type, player, sender, perm_report);
        }
    }
];