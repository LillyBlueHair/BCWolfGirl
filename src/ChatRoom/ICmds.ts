import { Prerequisite } from "./Prerequistes";

export type CommandType = "Chat" | "Whisper" | "Beep";
export type CommandArgs = { [k: string]: string };

export interface CommandTemplate {
    type?: CommandType;
    prerequisite: Prerequisite[]
    match: RegExp;
    run(player: Character, sender: number | Character, content: RegExpExecArray, args?: CommandArgs): boolean;
}
