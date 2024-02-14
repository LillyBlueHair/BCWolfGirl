import { ActivityInfo } from "../../bc-utilities/ChatMessages";

export type ActivityTriggerMode = "onself" | "selfonother" | "both";

interface ActivityInvokeBase {
    mode: ActivityTriggerMode;
    onBodyparts: AssetGroupItemName[] | undefined;
    on(player: Character, sender: Character, info: ActivityInfo): void;
    adjustDict?(Content: string, dict: any[]): any[];
}

export type IActivity = ActivityInvokeBase & {
    activity: Activity;
    image: string;
    text(keyword: string): string;
}

export type IActivityExtened = ActivityInvokeBase & {
    activity: string;
}

export type IActivityInvokable = IActivity | IActivityExtened;

