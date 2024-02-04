import { ActivityInfo } from "../../utils/ChatMessages";

export interface IActivity {
    activity: Activity;
    image: string;
    on(player: Character, sender: Character, info: ActivityInfo): void;
    text(keyword: string): string;
}

export interface IActivityExtened {
    activity: string;
    on(player: Character, sender: Character, info: ActivityInfo): void;
}

export type IActivityInvokable = IActivity | IActivityExtened;

