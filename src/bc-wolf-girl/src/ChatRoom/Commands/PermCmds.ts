import { DataManager } from "../../Data";
import { ExtractMemberNumber } from "../../utils/Character";
import { CommandTemplate } from "../ICmds";
import { RouteIM } from "../../Control/Message";
import { BasicPrerequisites } from "../Prerequistes";


export const PermCmds: CommandTemplate[] = [
    {
        match: /(打开|关闭)恋人语音权限/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            DataManager.permission.setLoverMode(content[1] === "打开");

            const data = DataManager.permission.data;
            const perm_report = "当前语音权限:\n"
                + "└─ 恋人语音权限: " + (data.loverModerators ? "开启" : "关闭")

            RouteIM(args.type, player, sender, perm_report);
        }
    },
    {
        match: /设置(添加|移除)(\d{1,10})语音权限/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            const add = content[1] === "添加";
            const id = parseInt(content[2]);
            DataManager.permission.setModerator(id, add);

            const perm = DataManager.permission;
            const perm_report = "当前语音权限:\n"
                + "└─ 附加权限列表: " + (perm.isAdditionModerator(id) ? "+" : "-") + " " + id;

            RouteIM(args.type, player, sender, perm_report);
        }
    },
    {
        match: /查询语音权限/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            const num = ExtractMemberNumber(sender);
            const data = DataManager.permission.data;
            const perm_report = "当前语音权限:\n"
                + "├─ 恋人语音权限: " + (data.loverModerators ? "开启" : "关闭") + "\n"
                + "└─ 附加权限列表:\n"
                + data.moderators.map((i, idx, arr) => `   ${idx === arr.length ? '└─' : '├─'} ${i}`).join("\n");

            RouteIM(args.type, player, sender, perm_report);
        }
    }
];