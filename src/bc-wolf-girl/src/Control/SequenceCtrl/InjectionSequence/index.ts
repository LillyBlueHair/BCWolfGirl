import { CheckItemsWork, CommonWork, DelayWork } from "../../CommonWork";
import { InjectionManager } from "../../Injection";
import { InjectionType } from "../../Injection/IInjection";
import { IMessage, ParseMessage } from "../../Message";
import { TimedWork, TimedWorkState, TimedWorker } from "../../Worker";
import { StdMissingAction, StdMissingMsgN } from "../ItemCmdSequence/CmdSequenceMessage";

interface InjectionSequenceMsg {
    finish: IMessage;
    f_action: IMessage;
}

function InstantInjection(type: InjectionType, msg: InjectionSequenceMsg) {
    const work_sequence: TimedWork[] = [
        new CommonWork((player) => ParseMessage(msg.finish, { player })),
        new CommonWork((player) => ParseMessage(msg.f_action, { player })),
        new CommonWork(() => InjectionManager.instance.doInject(type))
    ]
    TimedWorker.global.push_front({ description: `InstantInjection${type}`, works: work_sequence })
}

function StdInjectionSequence(type: InjectionType, msg: InjectionSequenceMsg) {
    let data = {
        msg: StdMissingAction
    }

    const work_sequence: TimedWork[] = [
        new CheckItemsWork(["ItemTorso2"], (player, result) => {
            if (result.missing.length > 0) {
                const missing_formated = result.missing.map(g => g.Craft.Name).join(", ");
                ParseMessage(StdMissingMsgN, { player }, { missing_formated });
                return TimedWorkState.interrupted;
            } else {
                data.msg = { mode: "chat-action", msg: `Received the order, the medicine is being prepared` };
            }
        }),
        new CommonWork((player) => ParseMessage(data.msg, { player })),
        new DelayWork(1000),
        new CommonWork((player) => {
            InjectionManager.instance.doInject(type);
        }),
        new CommonWork((player) => ParseMessage(msg.finish, { player })),
        new CommonWork((player) => ParseMessage(msg.f_action, { player }))
    ]
    TimedWorker.global.push({ description: `InjectionSequence${type}`, works: work_sequence })
}

const messages: {
    [k in InjectionType]: InjectionSequenceMsg;
} = {
    'aphrodisiac': {
        finish: { mode: "chat-action", msg: "Aphrodisiac injection completed" },
        f_action: { mode: "action", msg: "Oh, it's an aphrodisiac. Although it won't lead to an orgasm directly, subsequent arousal will be more impactful. I hope {player_wg} won't let the pleasure spoil her brain." }
    },
    'inhibitor': {
        finish: { mode: "chat-action", msg: "Inhibitor injection completed" },
        f_action: { mode: "action", msg: "{player_wg}'s harness injected her with an inhibitor that can temporarily suppress the pain, but the side effect is that it suppresses the brain's perception of pleasure. If this is injected when she is in estrus... don't treat your body too much because of desire, okay?" }
    },
    'anesthetic': {
        finish: { mode: "chat-action", msg: "Anesthetic injection completed" },
        f_action: { mode: "action", msg: "{player_wg}, who has lost her ability to resist, seems to be able to be played with at will. Maybe in a few minutes we need to call the EIL recycling team to pick her up." }
    },
    'pickmeup': {
        finish: { mode: "chat-action", msg: "Recovery injection completed" },
        f_action: { mode: "action", msg: "With the injection of the recovery agent, {player_wg}'s body gradually regains strength and she gradually regained control of her limbs." }
    },
    "EasterUniversalDispersal": {
        finish: { mode: "chat-action", msg: "The injection of general dispersant is completed" },
        f_action: { mode: "action", msg: "Complex magic circuits, inherited ancient bloodlines, tedious preparations for casting spells, how can a great magician who takes decades to become a master avoid being caught up by technology? The low threshold for using technology has never been comparable to those magicians who require so-called bloodlines and origins." }
    }
}

export function DoInjection(type: InjectionType, instant?: boolean) {
    if (instant) {
        InstantInjection(type, messages[type]);
    } else {
        StdInjectionSequence(type, messages[type]);
    }
}