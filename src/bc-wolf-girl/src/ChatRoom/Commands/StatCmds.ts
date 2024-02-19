import { ParseMessage } from "../../Control/Message";
import { GetWolfGrilName } from "../../Control/WolfGirlCtrl";
import { DataManager } from "../../Data";
import { CommandTemplate } from "../ICmds";
import { ModOrSelfPrerequisites } from "../Prerequistes";


export const StatCmds: CommandTemplate[] = [
    {
        match: /^查询高潮统计/,
        prerequisite: ModOrSelfPrerequisites,
        run(player, sender, content) {
            const { orgasm, resist, ruined } = DataManager.arousal;
            const arousal_report = GetWolfGrilName(player) + "的高潮统计如下：\n" +
                `  高潮次数：${orgasm}\n` +
                `  忍耐次数：${resist}\n` +
                `  毁灭次数：${ruined}\n` +
                `  高潮成功率：${((orgasm) / (orgasm + resist + ruined) * 100).toFixed(2)}%`;
            ParseMessage({ mode: "chat-action", msg: arousal_report });
        }
    }
]