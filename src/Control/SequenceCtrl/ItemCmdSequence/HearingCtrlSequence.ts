import { CtrlType } from "../../WolfGirlCtrl";
import { CmdSequenceMessage, StdCmdSequence } from ".";


export function HearingCtrlSequence(player: Character, sender: Character, mode: CtrlType) {
    const messages: CmdSequenceMessage = {
        missing: {
            notify: { mode: "chat-action", msg: "收到指令，指令执行异常，组件{0}不在线，指令无法完成" },
            action: { mode: "action", msg: "{player_wg}的中央控制核心小小的发出了错误的嘟声，除此之外什么都没有发生" },
        },
        modes: {
            "off": {
                notify: { mode: "chat-action", msg: "收到指令，听觉限制已关闭" },
                action: { mode: "action", msg: "{player_wg}耳机上的指示灯渐渐褪去红色的光芒，只剩下一丝微不可查的淡蓝色，世界的声音透过这带有体温的机械，朦胧的传入了{player_wg}耳边，没有了方才的死寂，也不需要集中精神阅读唇语，得以放松许多，对吧" },
            },
            "base": {
                notify: { mode: "chat-action", msg: "收到指令，听觉限制已开启" },
                action: { mode: "action", msg: "{player_wg}的耳边声音骤然减小，并且愈发模糊与朦胧，她耳机上的指示灯亮起小小的红光，虽然被{player_wg}的发丝遮盖，但若是在伸手不见五指的黑夜，还是能隐约发觉的" },
            },
            "max": {
                notify: { mode: "chat-action", msg: "收到指令，听觉限制已设置为高功率运转" },
                action: { mode: "action", msg: "{player_wg}的耳机似乎微微收紧了些，外界的声响似乎在这一瞬间被按下了暂停键一般陷入死寂，方才微弱的光现在已是醒目的红色闪烁，似乎在尝试宣告着什么，但那又如何呢？世间的喧嚣本就太过嘈杂烦扰，也许这样能够静心许多" },
            }
        }
    };
    StdCmdSequence(player, sender, "HearingCtrl", mode, messages);
}
