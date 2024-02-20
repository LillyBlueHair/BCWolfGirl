import { ParseMessage } from "../../Control/Message";
import { GetWolfGrilName } from "../../Control/WolfGirlCtrl";
import { DataManager } from "../../Data";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites, ModOrSelfPrerequisites } from "../Prerequistes";


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
    },
    {
        match: /^查询狼女训练统计/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            const { script_run_time, wolfgirl_time, stash_time, last_fix_time, task } = DataManager.instance.data.stat;
            const { finished, failed, counter } = task;
            const point = DataManager.instance.data.points.current;

            const day_hour_minute_second = (time: number) => {
                const seconds = Math.floor(time / 1000);
                const days = Math.floor(seconds / (3600 * 24));
                const daystring = days > 0 ? `${days}天` : "";
                const hours = Math.floor((seconds % (3600 * 24)) / 3600);
                const hourstring = days > 0 || hours > 0 ? `${hours}小时` : "";
                const minutes = Math.floor((seconds % 3600) / 60);
                const second = seconds % 60;
                return `${daystring}${hourstring}${minutes}分${second}秒`;
            }

            const local_time = (time: number) => {
                return new Date(time).toLocaleString();
            }

            const task_report = GetWolfGrilName(player) + "的训练统计如下：\n" +
                `  训练辅助系统总运行时间：${day_hour_minute_second(script_run_time)}\n` +
                `  训练模块有效工作时间：${day_hour_minute_second(wolfgirl_time)}\n` +
                `  任务完成次数：${finished}\n` +
                `  任务失败次数：${failed}\n` +
                `  当前任务积分：${point}\n` +
                `  任务计数：\n` +
                `    高潮：${counter.Orgasmed ?? 0}\n` +
                `    忍耐：${counter.Resisted ?? 0}\n` +
                `    玩弄胸部：${counter.BreastPlayed ?? 0}\n` +
                `    玩弄阴部：${counter.VulvaPlayed ?? 0}\n` +
                `    拍打：${counter.Spanked ?? 0}\n` +
                `  上次套装维护检查时间：${last_fix_time > 0 ? local_time(last_fix_time) : "无记录"}\n` +
                `  拘束轻量化模式时间：${day_hour_minute_second(stash_time)}`;
            ParseMessage({ mode: "chat-action", msg: task_report });
        }
    }
]