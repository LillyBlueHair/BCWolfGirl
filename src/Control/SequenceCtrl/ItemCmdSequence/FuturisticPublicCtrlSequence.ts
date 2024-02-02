import { CtrlType } from "../../WolfGirlCtrl/IController";
import { StdMissing } from "./CmdSequenceMessage";
import { CmdSequenceMessage } from "./CmdSequenceMessage";
import { StdCmdSequence } from "./StdCmdSequence";


export function FuturisticPublicCtrlSequence(player: Character, mode: CtrlType) {
    const messages: CmdSequenceMessage = {
        missing: StdMissing,
        modes: {
            "close": {
                notify: { mode: "chat-action", msg: "收到指令，公开操作权限已关闭" },
                action: { mode: "action", msg: "{player_wg}项圈上的公共操作面板渐渐熄灭，真是可惜，不能继续被其他人玩弄了，如果想要些什么的话，这个时候也许问一问主人和恋人们会更好？" },
            },
            "open": {
                notify: { mode: "chat-action", msg: "收到指令，公开操作权限已启用" },
                action: { mode: "action", msg: "{player_wg}项圈上的公共操作面板随即点亮，在她身体各处投射出小小的操作面板以便于任何人随时玩弄她的身体，也许好好服侍的话，能有好心人让{player_wg}获得短暂的自由呢？" },
            }
        }
    };

    StdCmdSequence(player, "FuturisticPublicCtrl", mode, messages);
}
