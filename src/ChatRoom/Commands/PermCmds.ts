import { DataManager } from "../../Data";
import { ExtractMemberNumber } from "../../utils/Character";
import { ChatRoomAction } from "../../utils/ChatMessages";
import { CommandTemplate } from "../ICmds";
import { RouteIM } from "../Messages";
import { BasicPrerequisites } from "../Prerequistes";


export const PermCmds: CommandTemplate[] = [
    {
        match: /(打开|关闭)恋人语音权限/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DataManager.permission.setLoverMode(content[1] === "打开");
        }
    },
    {
        match: /设置(添加|移除)(\d{1,10})语音权限/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            const add = content[1] === "添加";
            const id = parseInt(content[2]);
            DataManager.permission.setModerator(id, add);
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

            RouteIM(sender, args.type, perm_report);
        }
    }
];