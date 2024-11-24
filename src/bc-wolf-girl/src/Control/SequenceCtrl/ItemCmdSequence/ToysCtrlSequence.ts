import { CommonWork } from "../../CommonWork";
import { IMessage, ParseMessage } from "../../Message";
import { OutfitItemsMap } from "../../OutfitCtrl";
import { ControllerType } from "../../WolfGirlCtrl/IController";
import { CtrlType } from "../../WolfGirlCtrl/IController";
import { RunControls } from "../../WolfGirlCtrl";
import { TestControlWork } from "../../WolfGirlCtrl/Works";
import { TimedWork, TimedWorkState, TimedWorker } from "../../Worker";
import { StdMissing } from "./CmdSequenceMessage";
import { CmdSequenceMessage } from "./CmdSequenceMessage";
import { CmdData, StdResultBranch } from "./StdCmdSequence";
import { AppearanceUpdate } from "bc-utilities";


export function ToysCtrlSequence(player: PlayerCharacter, mode: CtrlType) {
    const messages: CmdSequenceMessage = {
        missing: StdMissing,
        modes: {
            off: {
                notify: { mode: "chat-action", msg: "Received command, vibrator turned off" },
                action: { mode: "action", msg: "All the vibrators on {player_wg}'s body suddenly stop. Maybe she has a little chance to relax. Is she tired? One wonders if {player_wg} is dissatisfied with the current silence after the previous waves of pleasure?" },
            },
            open: {
                notify: { mode: "chat-action", msg: "Received command, vibrator turned on" },
                action: { mode: "action", msg: "{player_wg}'s vibrators begin to vibrate slightly. Although it is not strong enough, it is enough to slowly push her towards orgasm. There is not much buzzing sound at this power, so there is no need to worry about being discovered. Of course, if she can orgasm is hard to say." },
            },
            max: {
                notify: { mode: "chat-action", msg: "Received command, the vibrator has been set to maximum power mode" },
                action: { mode: "action", msg: "The vibrators on {player_wg}'s body suddenly emit a clear buzzing sound. Even with the barrier of body and clothes, it is clearly audible if one gets a little closer. However, {player_wg} obviously doesn't have much energy to pay attention to this. After all, wave after wave of pleasure wash over her brain, erasing her reason and thoughts bit by bit." },
            }
        }
    };

    const type: ControllerType = "ToysCtrl";

    let data: CmdData = { type, mode };

    const work_sequence: TimedWork[] = [
        new TestControlWork(type, mode, StdResultBranch(player, data, (result, data) => {
            const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join(", ");
            if (!result.missing.includes("ItemVulva")) {
                ParseMessage(messages.missing.notify, { player }, { missing_formated });
                data.xMessage = { mode: "action", msg: "Although {player_wg}'s vibrator indicates that it had been set up successfully, judging by the sound, something has clearly gone wrong. The humming sound of the vibrations is like the ups and downs of the sea in a storm, as if it is toying with {player_wg}, as if this mistake has been made intentionally and carelessly." };
                data.mode = "random";
                data.do_work = true;
            } else {
                ParseMessage(messages.missing.notify, { player }, { missing_formated });
                data.xMessage = messages.missing.action;
            }
        }, (data) => {
            const msg = messages.modes[mode];
            if (msg) {
                ParseMessage(msg.notify, { player });
                data.xMessage = msg.action;
                data.do_work = true;
            } else {
                ParseMessage({ mode: "chat-action", msg: `[DEBUG] error message: WGException.${data.type}.MissingDialog.${data.mode}` }, { player });
                return TimedWorkState.interrupted;
            }
        })),
        new CommonWork(() => {
            if (data.do_work) {
                RunControls(player, type, data.mode);
                AppearanceUpdate(player);
            }
        }),
        new CommonWork(() => { if (data.xMessage) ParseMessage(data.xMessage, { player }); }),
    ];

    TimedWorker.global.push({ description: `SetItemSequence${type}`, works: work_sequence });
}
