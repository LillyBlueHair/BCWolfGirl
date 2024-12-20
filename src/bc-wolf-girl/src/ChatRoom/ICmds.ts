import { Prerequisite } from "./Prerequistes";

export type CommandType = "Chat" | "Whisper" | "Beep";

export type CommandArgs = {
    type: CommandType,
    [k: string]: any
};

export interface CommandTemplate {
    type?: CommandType;
    prerequisite: Prerequisite
    match: RegExp;
    run(player: PlayerCharacter, sender: number | Character, content: RegExpExecArray, args: CommandArgs): void;
}
