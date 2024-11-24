import { CommonWork, DelayWork } from "../../Control/CommonWork";
import { ParseMessage } from "../../Control/Message";
import { MessageWork } from "../../Control/MessageWork";
import { GetWolfGirlName } from "../../Control/WolfGirlCtrl";
import { TimedWorkState, TimedWorker } from "../../Control/Worker";
import { DataManager } from "../../Data";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites, ModOrSelfPrerequisites } from "../Prerequistes";


export const StatCmds: CommandTemplate[] = [
    {
        match: /^((查询高潮统计)|(Get orgasm statistics))/i,
        prerequisite: ModOrSelfPrerequisites,
        run(player, sender, content) {
            const { orgasm, resist, ruined } = DataManager.arousal;
            const arousal_report = GetWolfGirlName(player) + "The climax statistics are as follows: \n" +
                `  Number of orgasms: ${orgasm}\n` +
                `  Number of resisted orgasms: ${resist}\n` +
                `  Number of ruined orgasms: ${ruined}\n` +
                `  Orgasm Rate: ${((orgasm) / (orgasm + resist + ruined) * 100).toFixed(2)}%`;
            ParseMessage({ mode: "chat-action", msg: arousal_report });
        }
    },
    {
        match: /^((查询狼女训练统计)|(Get wolf girl training statistics))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            const { script_run_time, wolfgirl_time, stash_time, last_fix_time, task } = DataManager.instance.data.stat;
            const { finished, failed, counter } = task;
            const point = DataManager.instance.data.points.current;

            const day_hour_minute_second = (time: number) => {
                const seconds = Math.floor(time / 1000);
                const days = Math.floor(seconds / (3600 * 24));
                const daystring = days > 0 ? `${days}days` : "";
                const hours = Math.floor((seconds % (3600 * 24)) / 3600);
                const hourstring = days > 0 || hours > 0 ? `${hours}hours` : "";
                const minutes = Math.floor((seconds % 3600) / 60);
                const second = seconds % 60;
                return `${daystring}${hourstring}${minutes}minutes${second}seconds`;
            }

            const local_time = (time: number) => {
                return new Date(time).toLocaleString();
            }

            const task_report = GetWolfGirlName(player) + "The training statistics are as follows: \n" +
                `  Total running time of training assistance system: ${day_hour_minute_second(script_run_time)}\n` +
                `  Training module effective working time: ${day_hour_minute_second(wolfgirl_time)}\n` +
                `  Number of tasks completed: ${finished}\n` +
                `  Number of tasks failed: ${failed}\n` +
                `  Current task points: ${point}\n` +
                `  Task Count: \n` +
                `    climax: ${counter.Orgasmed ?? 0}\n` +
                `    resisted orgasms: ${counter.Resisted ?? 0}\n` +
                `    Played with breast: ${counter.BreastPlayed ?? 0}\n` +
                `    Played with vulva: ${counter.VulvaPlayed ?? 0}\n` +
                `    Spanked: ${counter.Spanked ?? 0}\n` +
                `  Last suit maintenance check: ${last_fix_time > 0 ? local_time(last_fix_time) : "No records"}\n` +
                `  Restrained Lightweight Mode Time: ${day_hour_minute_second(stash_time)}`;
            ParseMessage({ mode: "chat-action", msg: task_report });
        }
    }, {
        match: /^((扫描身体敏感部位)|(Scan sensitive body parts))/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            TimedWorker.global.push({
                description: "ScanBody", works: [
                    new MessageWork({ mode: "action", msg: "Command received, scanning body parameters" }),
                    new MessageWork({ mode: "action", msg: `Several small streams of metallic silver water flow out of {player_wg}'s collar and along {player_wg}'s body to various parts of her body. They briefly cover {player_wg}'s body, just like a silver latex suit covering her entire body. After a burst of itchiness, this strange latex suit turns back into a silver stream of water and returns to the collar along the same path.` }),
                    new DelayWork(5000),
                    new CommonWork((player) => {
                        if (player.ArousalSettings === undefined || player.ArousalSettings.Active === "Inactive") {
                            ParseMessage({ mode: "action", msg: "The scan data analysis is complete. {player_wg}'s sexual arousal center is in a shut-down state and no physical data has been collected." }, { player });
                            return TimedWorkState.interrupted;
                        }
                        const ZoneData = AssetGroup.filter(g => g.IsItem()).map(g => g.Name).map(g => PreferenceGetArousalZone(player, g)).filter(z => !!z) as ArousalZone[];
                        const value3Zones = ZoneData.filter(z => z.Factor === 3).map(z => AssetGroupGet(player.AssetFamily, z.Name)?.Description).filter(z => !!z).join(", ");
                        const value4Zones = ZoneData.filter(z => z.Factor === 4).map(z => AssetGroupGet(player.AssetFamily, z.Name)?.Description).filter(z => !!z).join(", ");
                        const orgasmZones = ZoneData.filter(z => z.Orgasm).map(z => AssetGroupGet(player.AssetFamily, z.Name)?.Description).filter(z => !!z).join(", ");
                        ParseMessage({ mode: "action", msg: `The scan data has been analyzed. The more sensitive parts of {player_wg}'s body are {value3Zones}, and the most sensitive parts of {player_wg}'s body are {value4Zones}. Among them, the part that can make {player_wg} climax is {orgasmZones}. The scan data summary is complete.` },
                            { player }, { value3Zones, value4Zones, orgasmZones });
                    })
                ]
            });
        }
    }
]