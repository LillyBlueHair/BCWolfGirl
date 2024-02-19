import { ModSDKModAPI } from "bondage-club-mod-sdk";

export type InjectionType = "anesthetic" | "pickmeup" | "aphrodisiac" | "inhibitor" | "EasterUniversalDispersal";

export type DisperseMode = "timely_cancel" | "all_cancel"
export type CummlateMode = "refresh" | "add" | "none"

export type DisperseSetting = {
    mode: DisperseMode,
    target: InjectionType[]
}

export abstract class IInjection {
    abstract name: InjectionType;
    abstract duration: number;
    abstract cumulate: CummlateMode;
    abstract disperse: DisperseSetting | undefined;
    isWorking: () => boolean = () => false;
    onInject(): void { };
    hook(mod: ModSDKModAPI, lateHook: (callback: () => void) => void): void { };
    update(player: PlayerCharacter): void { };
}