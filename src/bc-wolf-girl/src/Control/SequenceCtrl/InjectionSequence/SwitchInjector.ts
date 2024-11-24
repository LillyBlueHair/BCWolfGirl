import { CheckItemsWork, DelayWork } from "../../CommonWork";
import { IMessage, ParseMessage } from "../../Message";
import { MessageWork } from "../../MessageWork";
import { ToolsInjector } from "../../OutfitCtrl";
import { TimedWork, TimedWorkState, TimedWorker } from "../../Worker";
import { StdMissingMsgBase } from "../ItemCmdSequence/CmdSequenceMessage";
import { InjectionType } from "../../Injection/IInjection";
import { ActivityProvider } from "../../../ChatRoom/Activity";

export type SwitchAvailableType = Exclude<InjectionType, "EasterUniversalDispersal">;

export const switchInjectorMessages: {
    [key in SwitchAvailableType | "chips"]: IMessage;
} = {
    "anesthetic": { mode: "chat-action", msg: "Shh... maybe it's time to kidnap someone. Who will be the lucky one?" },
    "pickmeup": { mode: "chat-action", msg: "It's really boring to play with a dead fish with no reaction or movement, isn't it? The prey's escape and struggle are also part of the fun of hunting, right?" },
    "aphrodisiac": { mode: "chat-action", msg: "Is it to discipline or to play around? Whether it is for others or for yourself, something very interesting is about to happen, isn't it?" },
    "inhibitor": { mode: "chat-action", msg: "If injected into a person in heat, this would undoubtedly be the most severe punishment. Compared to being unable to orgasm, a drug that would make it impossible for a person to even feel much pleasure is truly a demon." },
    "chips": { mode: "chat-action", msg: "It looks like trainer {player_id} is about to capture a new wolf girl, but please don't capture her and send her into the wolf girl assembly line at will, okay?" },
};

export function SwitchInjector(mode: string, type: SwitchAvailableType | undefined) {
    const work_sequence: TimedWork[] = [
        new CheckItemsWork([ToolsInjector], (player, result) => {
            if (result.missing.length > 0) {
                ParseMessage(StdMissingMsgBase, { player }, { missing_formated: ToolsInjector.Craft.Name });
                return TimedWorkState.interrupted;
            }
            ActivityProvider.instance.injector.type = type
        }, false),
        new MessageWork({ mode: "chat-action", msg: `The syringe has switched to ${mode} mode` }),
        new MessageWork({ mode: "chat-action", msg: switchInjectorMessages[type || "chips"].msg }),
    ];
    TimedWorker.global.push({ description: `SwitchInjector${mode}`, works: work_sequence });
}

export function UniversalDispersalSwitchInjection() {
    const work_sequence: TimedWork[] = [
        new CheckItemsWork([ToolsInjector], (player, result) => {
            if (result.missing.length > 0) {
                ParseMessage(StdMissingMsgBase, { player }, { missing_formated: ToolsInjector.Craft.Name });
                return TimedWorkState.interrupted;
            }
        }),
        new MessageWork({ mode: "chat-action", msg: "Mode switching completed, current mode: general repellent injection" }),
        new MessageWork({ mode: "action", msg: "With this external power that has never been offered to the Shadow King who rules the world, he turned it into a supreme treasure." }),
        new DelayWork(2500),
        new MessageWork({ mode: "action", msg: "Pray for a good harvest and sing the sacred praises" }),
        new DelayWork(2500),
        new MessageWork({ mode: "action", msg: "The Holy Spirit bestowed upon him a noble gift, which made his name go down in history." }),
        new DelayWork(2500),
        new MessageWork({ mode: "action", msg: "We will use our powerful magic power to corrode the spreading filth into mud." }),
        new DelayWork(2500),
        new MessageWork({ mode: "action", msg: "We will curb the rampant madness with our firm belief" }),
        new DelayWork(2500),
        new MessageWork({ mode: "action", msg: "Achieve a thorough intervention of thoughts on matter" }),
        new DelayWork(2500),
        new MessageWork({ mode: "chat-action", msg: "The currently loaded firmware has been detected to be abnormal, and the default firmware is being reloaded." }),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "Firmware recovery complete" }),
        new MessageWork({ mode: "chat-action", msg: "Mode switching completed, current mode: general repellent injection" }),
        new MessageWork({ mode: "action", msg: "Complex magic circuits, inherited ancient bloodlines, tedious preparations for casting spells, how can a great magician who takes decades to become a master avoid being caught up by technology? The low threshold for using technology has never been comparable to those magicians who require so-called bloodlines and origins." })
    ];
    TimedWorker.global.push({ description: `UniversalDispersalInjectionSwitchSequence`, works: work_sequence });
} 
