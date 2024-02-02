import { CtrlType } from "../../WolfGirlCtrl";
import { CmdSequenceMessage, StdCmdSequence } from ".";


export function ArousalCtrlSequence(player: Character, sender: Character, mode: CtrlType) {
    const messages: CmdSequenceMessage = {
        missing: {
            notify: { mode: "chat-action", msg: "收到指令，指令执行异常，组件{0}不在线，指令无法完成" },
            action: { mode: "action", msg: "{player_wg}的中央控制核心小小的发出了错误的嘟声，除此之外什么都没有发生" },
        },
        modes: {
            "off": {
                notify: { mode: "chat-action", msg: "收到指令，高潮限制已关闭" },
                action: { mode: "action", msg: "{player_wg}视野中表示高潮锁的图标随着指令话音落下而熄灭，虽然身体并没有感知到什么变化，不过一股怪诞的自由也许正冲刷着她的内心，也许只有被命令下允许的高潮才是她想要的吧" },
            },
            "edge": {
                notify: { mode: "chat-action", msg: "收到指令，高潮限制已开启，当前模式：边缘寸止" },
                action: { mode: "action", msg: "{player_wg}视野中有个图标缓缓开始了闪烁，闪烁的淡红色爱心内嵌着的小锁图标即使没有说明书也能够大致猜测到含义，也许，下一秒，下一次触碰，就能抵达长廊的另一端，可是似乎终点终究只差那么些微距离" },
            },
            "deny": {
                notify: { mode: "chat-action", msg: "收到指令，高潮限制已开启，当前模式：拒绝高潮" },
                action: { mode: "action", msg: "{player_wg}视野中有个图标缓缓开始了闪烁，嵌着小锁的爱心缓缓裂成两半，而锁则仍然最为显眼，无尽的快感却不能有无尽的满足，即使挡板开放而任由{player_wg}自慰或者交欢都不可能得到满足，亦或者对她来说，这是另一种满足？" },
            }
        }
    };

    StdCmdSequence(player, sender, "ArousalCtrl", mode, messages);
}
