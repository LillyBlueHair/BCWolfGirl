import { CtrlType } from "../../WolfGirlCtrl";
import { CmdSequenceMessage, StdCmdSequence } from ".";


export function VisionCtrlSequence(player: Character, sender: Character, mode: CtrlType) {
    const messages: CmdSequenceMessage = {
        missing: {
            notify: { mode: "chat-action", msg: "收到指令，指令执行异常，组件{0}不在线，指令无法完成" },
            action: { mode: "action", msg: "{player_wg}的中央控制核心小小的发出了错误的嘟声，除此之外什么都没有发生" },
        },
        modes: {
            "off": {
                notify: { mode: "chat-action", msg: "收到指令，视觉限制已关闭" },
                action: { mode: "action", msg: "{player_wg}的护目镜逐渐变回了最初的外观，神经干涉模块随着颜色的改变而愈发柔和起来，{player_wg}黑暗的世界中闯入了些微光明，虽然不够清晰，不过也已经足够防止她摔倒在地和撞上障碍了，而在这样的情况下玩些追逐游戏也是足够有趣的" },
            },
            "base": {
                notify: { mode: "chat-action", msg: "收到指令，视觉限制已开启" },
                action: { mode: "action", msg: "{player_wg}的护目镜稍稍闪过一丝波纹，稍稍变暗了些，神经干涉模块的工作结合镜片的变动，令{player_wg}的视野愈发模糊" },
            },
            "max": {
                notify: { mode: "chat-action", msg: "收到指令，视觉限制已设置为高功率运转" },
                action: { mode: "action", msg: "{player_wg}的护目镜画面完全熄灭，而神经干涉模块的功率则有了显著的增长，{player_wg}已近乎完全无法视物，可是失去了视觉，在黑暗的世界里，信赖之人的怀抱与气息带来的安心感难道不更令人沉醉吗？不再需要见到其他人，也不会再见到其他人，也许仅仅是一丝残香就足够指引方向" },
            }
        }
    };
    StdCmdSequence(player, sender, "VisionCtrl", mode, messages);
}
