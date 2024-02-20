import { MessageWork } from "../MessageWork";
import { TimedWorker } from "../Worker";
import { StdMissingMsgN, StdMissingAction } from "./ItemCmdSequence/CmdSequenceMessage";

export function PushMissingStopSequence(missing_formated: string) {
    TimedWorker.global.insert_after_first({
        description: "StopSequence", works: [
            new MessageWork(StdMissingMsgN, { args: { missing_formated } }),
            new MessageWork(StdMissingAction)
        ]
    });
}