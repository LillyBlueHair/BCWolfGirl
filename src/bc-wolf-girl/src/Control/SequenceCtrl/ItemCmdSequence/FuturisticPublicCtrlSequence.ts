import { CtrlType } from "../../WolfGirlCtrl/IController";
import { StdMissing } from "./CmdSequenceMessage";
import { CmdSequenceMessage } from "./CmdSequenceMessage";
import { StdCmdSequence } from "./StdCmdSequence";


export function FuturisticPublicCtrlSequence(player: PlayerCharacter, mode: CtrlType) {
    const messages: CmdSequenceMessage = {
        missing: StdMissing,
        modes: {
            "close": {
                notify: { mode: "chat-action", msg: "Received instruction, public operation permission has been disabled" },
                action: { mode: "action", msg: "The public operation panel on the collar gradually goes out. It was a pity that it can't be played with by others anymore. If {player_wg} wants something, maybe it would be better to ask her master and lovers now..." },
            },
            "open": {
                notify: { mode: "chat-action", msg: "Received instructions, public operation permissions have been enabled" },
                action: { mode: "action", msg: "The public operation panel on {player_wg}'s collar lights up immediately, projecting small operation panels all over her body so that anyone can play with her body at any time. Perhaps if she serves well, a kind-hearted person would allow {player_wg} to gain a brief freedom?" },
            }
        }
    };

    StdCmdSequence(player, "FuturisticPublicCtrl", mode, messages);
}
