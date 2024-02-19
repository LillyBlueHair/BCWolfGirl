import { ActivityInfo } from "bc-utilities";

export type ActivityTriggerMode = "onself" | "selfonother" | "both";

interface ActivityInvokeBase {
    mode: ActivityTriggerMode;
    onBodyparts: AssetGroupItemName[] | undefined;
    on(player: PlayerCharacter, sender: Character, info: ActivityInfo): void;
    adjustDict?(Content: string, dict: any[]): any[];
}

type ExtendedActivityPrerequisite = ActivityPrerequisite | string;

export type ExtendedActivity = Omit<Activity, "Name" | "Prerequisite"> & {
    Name: string,
    Prerequisite: ExtendedActivityPrerequisite[];
};

export type IActivity = ActivityInvokeBase & {
    activity: ExtendedActivity;
    image: string;
    text(keyword: string): string;
}

export type IActivityExtened = ActivityInvokeBase & {
    activity: string;
}

export type IActivityInvokable = IActivity | IActivityExtened;

