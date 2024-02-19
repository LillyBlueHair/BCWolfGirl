import { CtrlType } from "../../WolfGirlCtrl/IController";
import { StdMissing } from "./CmdSequenceMessage";
import { CmdSequenceMessage } from "./CmdSequenceMessage";
import { StdCmdSequence } from "./StdCmdSequence";


export function VoiceCtrlSequence(player: PlayerCharacter, mode: CtrlType) {
    const messages: CmdSequenceMessage = {
        missing: StdMissing,
        modes: {
            "off": {
                notify: { mode: "chat-action", msg: "收到指令，语言限制已关闭" },
                action: { mode: "action", msg: "{player_wg}的智能口球发出了小小的嘶嘶声，缓缓缩小，而原有的数个内置凹槽则重新出现，虽然会略微降低话语的声响，不过至少能够好好听清{player_wg}想要说什么了，不应该说声谢谢吗？" },
            },
            "base": {
                notify: { mode: "chat-action", msg: "收到指令，语言限制已开启" },
                action: { mode: "action", msg: "{player_wg}口中的口球稍稍震动了下，口球束带上的一盏小灯点亮，随后缓缓开始膨胀，虽然稍稍有些阻碍唇舌的发音，但是还是能大致的表达出自己的意愿的" },
            },
            "total": {
                notify: { mode: "chat-action", msg: "收到指令，语言限制已设置为最强限制模式" },
                action: { mode: "action", msg: "{player_wg}的口球愈发膨胀，束带上的所有指示灯也进阶点亮，膨胀的乳胶不仅仅是压住她稚嫩的舌，还一点点探入喉咙，填满口腔，而神经干涉模块很是时宜的遏制了反射性的干呕与咳嗽，嗯，用鼻子发出呜呜声也的确是狼在被限制住口的时候的做法呢，这不是很完美吗？" },
            }
        }
    };

    StdCmdSequence(player, "VoiceCtrl", mode, messages);
}
