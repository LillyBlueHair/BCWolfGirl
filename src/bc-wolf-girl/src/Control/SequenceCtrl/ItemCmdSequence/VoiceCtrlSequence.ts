import { CtrlType } from "../../WolfGirlCtrl/IController";
import { StdMissing } from "./CmdSequenceMessage";
import { CmdSequenceMessage } from "./CmdSequenceMessage";
import { StdCmdSequence } from "./StdCmdSequence";

export function VoiceCtrlSequence(player: PlayerCharacter, mode: CtrlType) {
    const messages: CmdSequenceMessage = {
        missing: StdMissing,
        modes: {
            off: {
                notify: { mode: "chat-action", msg: "Received instruction, language restriction has been disabled" },
                action: {
                    mode: "action",
                    msg: "{player_wg}'s smart gag makes a small hissing sound and slowly shrinks while the original built-in grooves reappear. Although it slightly reduces the sound of the words, at least one can clearly hear what {player_wg} wants to say. Shouldn't she say thank you?",
                },
            },
            base: {
                notify: { mode: "chat-action", msg: "Received instruction, language restriction is enabled" },
                action: {
                    mode: "action",
                    msg: "{player_wg}'s gag vibrates slightly, and a small light on the gag's strap lights up, then slowly begins to expand. Although it slightly hinderes the pronunciation of the lips and tongue, she is still able to roughly express her wishes.",
                },
            },
            total: {
                notify: { mode: "chat-action", msg: "Received instruction, language restriction has been set to the strongest restriction mode" },
                action: {
                    mode: "action",
                    msg: "{player_wg}'s gag continues to swell, and all the indicator lights on the straps light up. The expanded latex not only presses down her tender tongue, but also penetrates into her throat little by little, filling her mouth. The neural interference module suppresses the reflexive retching and coughing at the right time. Well, making a whining sound through the nose is indeed what wolves do when their mouths are restrained. Isn't this perfect?",
                },
            },
        },
    };

    StdCmdSequence(player, "VoiceCtrl", mode, messages);
}
