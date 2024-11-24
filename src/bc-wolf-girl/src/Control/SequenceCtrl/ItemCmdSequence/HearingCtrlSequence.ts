import { CtrlType } from "../../WolfGirlCtrl/IController";
import { StdMissing } from "./CmdSequenceMessage";
import { CmdSequenceMessage } from "./CmdSequenceMessage";
import { StdCmdSequence } from "./StdCmdSequence";


export function HearingCtrlSequence(player: PlayerCharacter, mode: CtrlType) {
    const messages: CmdSequenceMessage = {
        missing: StdMissing,
        modes: {
            "off": {
                notify: { mode: "chat-action", msg: "Received command, hearing restriction has been turned off" },
                action: { mode: "action", msg: "The red light on {player_wg}'s headset gradually fades, leaving only a barely detectable light blue. The sounds of the world passed through the machine and hazily entered {player_wg}'s ears. Without the dead silence just now, there is no need to concentrate on reading lips, so she is able to relax a lot now, right?"},
            },
            "base": {
                notify: { mode: "chat-action", msg: "Received command, hearing restriction has been turned on" },
                action: { mode: "action", msg: "The sound in {player_wg}'s ears suddenly becomes fainter and more blurred and hazy. The indicator light on her earphones lights up as a small red light. Although it is covered by {player_wg}'s hair, it could still be vaguely detected." },
            },
            "total": {
                notify: { mode: "chat-action", msg: "Received command, hearing limit has been set to high power operation" },
                action: { mode: "action", msg: "{player_wg}'s headphones seem to tighten slightly, and the outside world seems to have been paused at this moment and fallen into silence. The faint light just now is now a striking red flash, as if trying to announce something, but so what? The hustle and bustle of the world is already too noisy and disturbing, maybe this can help calm down" },
            }
        }
    };
    StdCmdSequence(player, "HearingCtrl", mode, messages);
}
