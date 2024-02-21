import { CommonWork, DelayWork } from "../../Control/CommonWork";
import { ParseMessage } from "../../Control/Message";
import { MessageWork } from "../../Control/MessageWork";
import { GetWolfGrilName } from "../../Control/WolfGirlCtrl";
import { TimedWorkState, TimedWorker } from "../../Control/Worker";
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
    }, {
        match: /^扫描身体敏感部位/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            TimedWorker.global.push({
                description: "ScanBody", works: [
                    new MessageWork({ mode: "action", msg: "指令收到，正在扫描身体参数" }),
                    new MessageWork({ mode: "action", msg: `狼女{player_wg}的项圈上涌出了数股金属银色的小小水流，正沿着狼女{player_wg}的身体缓缓流向身体各处，短暂的覆盖住了狼女{player_wg}的身体，如同银色的乳胶衣一般覆盖了全身，随着一阵刺痒过后，这件奇特的乳胶衣又化回了银色的水流，原路返回项圈之中` }),
                    new DelayWork(5000),
                    new CommonWork((player) => {
                        if (player.ArousalSettings === undefined || player.ArousalSettings.Active === "Inactive") {
                            ParseMessage({ mode: "action", msg: "扫描数据分析完毕，狼女{player_wg}的性奋中枢处于关闭状态，没有收集到任何身体数据。" }, { player });
                            return TimedWorkState.interrupted;
                        }
                        const { Zone } = player.ArousalSettings;
                        const value3Zones = Zone.filter(z => z.Factor === 3).map(z => AssetGroupGet(player.AssetFamily, z.Name)?.Description).filter(z => !!z).join("、");
                        const value4Zones = Zone.filter(z => z.Factor === 4).map(z => AssetGroupGet(player.AssetFamily, z.Name)?.Description).filter(z => !!z).join("、");
                        const orgasmZones = Zone.filter(z => z.Orgasm).map(z => AssetGroupGet(player.AssetFamily, z.Name)?.Description).filter(z => !!z).join("、");
                        ParseMessage({ mode: "action", msg: `扫描数据已分析完毕，狼女{player_wg}身体较为敏感的部位为 {value3Zones} ，狼女{player_wg}身体十分敏感的部位为 {value4Zones} ，其中，能够使狼女{player_wg}高潮的部位为 {orgasmZones} ，扫描数据总结完成` },
                            { player }, { value3Zones, value4Zones, orgasmZones });
                    })
                ]
            });
        }
    }
]