import { CommonWork } from "../../CommonWork";
import { IMessage, ParseMessage } from "../../Message";
import { OutfitItemsMap } from "../../OutfitCtrl";
import { ControllerType } from "../../WolfGirlCtrl/IController";
import { CtrlType } from "../../WolfGirlCtrl/IController";
import { RunControls } from "../../WolfGirlCtrl";
import { TestControlWork } from "../../WolfGirlCtrl/Works";
import { TimedWork, TimedWorkState, TimedWorker } from "../../Worker";
import { StdMissing } from "./CmdSequenceMessage";
import { CmdSequenceMessage } from "./CmdSequenceMessage";
import { CmdData, StdResultBranch } from "./StdCmdSequence";
import { AppearanceUpdate } from "../../../utils/Apperance";


export function ToysCtrlSequence(player: Character, mode: CtrlType) {
    const messages: CmdSequenceMessage = {
        missing: StdMissing,
        modes: {
            off: {
                notify: { mode: "chat-action", msg: "收到指令，振动器已关闭" },
                action: { mode: "action", msg: "{player_wg}身上的振动器尽皆骤停，也许她有了小小的放松时机，是累了吗，亦或者已经被喂饱了？不知道在此前持续的快感浪潮之下有没有令{player_wg}对现如今这样的小小沉寂感到不满呢？可不要求着别人打开哦？" },
            },
            open: {
                notify: { mode: "chat-action", msg: "收到指令，振动器已开启" },
                action: { mode: "action", msg: "{player_wg}身上的振动器开始了小小的震动，虽然并不足够强烈，但是也足够将她缓缓推向高潮，这个功率下并不会有多少嗡嗡声，不用担心被发现，当然，高潮了的话就说不定了" },
            },
            max: {
                notify: { mode: "chat-action", msg: "收到指令，振动器已设置为最大功率模式" },
                action: { mode: "action", msg: "{player_wg}身上的振动器顿时发出了清晰的嗡鸣，即使有着身体与衣物的阻隔，稍稍接近即清晰可辨，而{player_wg}显然没有太多精力用来注意这点，毕竟一波又一波浪潮一般的快感冲刷着她的大脑，一点点抹去她的理智与思想" },
            }
        }
    };

    const type: ControllerType = "ToysCtrl";

    let data: CmdData = { type, mode };

    const work_sequence: TimedWork[] = [
        new TestControlWork(type, mode, StdResultBranch(player, data, (result, data) => {
            const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、");
            if (!result.missing.includes("ItemVulva")) {
                ParseMessage(messages.missing.notify, { player }, { missing_formated });
                data.xMessage = { mode: "action", msg: "{player_wg}身上的振动器虽然显示着设置成功，但是根据声音判断显然出现了错误，震动的嗡鸣如同风暴中的海面一样跌宕起伏，似乎在玩弄着{player_wg}，就仿佛这一个错误是故意不小心的一般" };
                data.mode = "random";
                data.do_work = true;
            } else {
                ParseMessage(messages.missing.notify, { player }, { missing_formated });
                data.xMessage = messages.missing.action;
            }
        }, (data) => {
            const msg = messages.modes[mode];
            if (msg) {
                ParseMessage(msg.notify, { player });
                data.xMessage = msg.action;
                data.do_work = true;
            } else {
                ParseMessage({ mode: "chat-action", msg: `[DEBUG] 错误信息: WGException.${data.type}.MissingDialog.${data.mode}` }, { player });
                return TimedWorkState.interrupted;
            }
        })),
        new CommonWork(() => {
            if (data.do_work) {
                RunControls(player, type, data.mode);
                AppearanceUpdate(player);
            }
        }),
        new CommonWork(() => { if (data.xMessage) ParseMessage(data.xMessage, { player }); }),
    ];

    TimedWorker.global.push({ description: `SetItemSequence${type}`, works: work_sequence });
}
