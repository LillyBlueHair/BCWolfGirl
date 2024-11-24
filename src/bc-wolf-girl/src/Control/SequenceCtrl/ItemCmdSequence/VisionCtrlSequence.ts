import { CtrlType } from "../../WolfGirlCtrl/IController";
import { StdMissing } from "./CmdSequenceMessage";
import { CmdSequenceMessage } from "./CmdSequenceMessage";
import { StdCmdSequence } from "./StdCmdSequence";


export function VisionCtrlSequence(player: PlayerCharacter, mode: CtrlType) {
    const messages: CmdSequenceMessage = {
        missing: StdMissing,
        modes: {
            "off": {
                notify: { mode: "chat-action", msg: "Received command, visual restriction has been disabled" },
                action: { mode: "action", msg: "{player_wg}'s goggles gradually return to their original appearance, and the neural interference module becomes softer as the color changes. A little light breaks into {player_wg}'s dark world. Although it is not clear enough, it is enough to prevent her from falling to the ground and hitting obstacles. In this situation, it might be fun to play some chasing games." },
            },
            "base": {
                notify: { mode: "chat-action", msg: "Received command, visual restriction is enabled" },
                action: { mode: "action", msg: "{player_wg}'s goggles flicker slightly and dim slightly. The work of the neural interference module combined with the change of the lens make {player_wg}'s vision more and more blurred." },
            },
            "total": {
                notify: { mode: "chat-action", msg: "Received command, visual restriction set to high power operation" },
                action: { mode: "action", msg: "{player_wg}'s goggles are completely dark, and the power of the neural interference module increase significantly. {player_wg} is almost completely unable to see, but without vision, in the dark world, wouldn't the sense of security brought by the embrace and breath of a trusted person be more intoxicating? No longer need to see other people, and will never see other people again, maybe just a trace of residual fragrance is enough to guide the direction" },
            }
        }
    };
    StdCmdSequence(player, "VisionCtrl", mode, messages);
}
