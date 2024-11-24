import { CtrlType } from "../../WolfGirlCtrl/IController";
import { StdMissing } from "./CmdSequenceMessage";
import { CmdSequenceMessage } from "./CmdSequenceMessage";
import { StdCmdSequence } from "./StdCmdSequence";


export function ArousalCtrlSequence(player: PlayerCharacter, mode: CtrlType) {
    const messages: CmdSequenceMessage = {
        missing: StdMissing,
        modes: {
            "off": {
                notify: { mode: "chat-action", msg: "Received the instruction, the orgasm lock has been disabled" },
                action: { mode: "action", msg: "{player_wg}'s orgasm lock icon goes out as the command was spoken. Although her body did not feel any changes, a strange sense of freedom might be washing over her heart. Perhaps the only orgasm she wanted was the one allowed by command." },
            },
            "edge": {
                notify: { mode: "chat-action", msg: "Received the command, the orgasm lock has been turned on, the current mode is: edge" },
                action: { mode: "action", msg: "An icon slowly begins to flash in {player_wg}'s field of vision. Even without the manual, one could roughly guess the meaning of the small lock icon embedded in the flashing light red heart. Perhaps, in the next second, the next touch, {player_wg} will reach the other end of the corridor. However, it seems that the end was only a short distance away." },
            },
            "deny": {
                notify: { mode: "chat-action", msg: "Received command, orgasm lock has been turned on, current mode: deny orgasm" },
                action: { mode: "action", msg: "An icon slowly begins to flash in {player_wg}'s field of vision, and the heart with a small lock embedded in it splits into two halves, while the lock was still the most conspicuous. Endless pleasure does not bring endless satisfaction. Even if the belt is open and {player_wg} is allowed to masturbate or have sex, she will never be satisfied. Or is this another kind of satisfaction for her?" },
            }
        }
    };

    StdCmdSequence(player, "ArousalCtrl", mode, messages);
}
