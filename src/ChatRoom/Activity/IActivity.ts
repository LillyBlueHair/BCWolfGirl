import { ActivityInfo } from "../../utils/ChatMessages";

export type ActivityTriggerMode = "onself" | "selfonother" | "both";

interface ActivityInvokeBase {
    mode: ActivityTriggerMode;
    onBodyparts: AssetGroupItemName[] | undefined;
    on(player: Character, sender: Character, info: ActivityInfo): void;
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

