export { CtrlHook } from "./Ctrls";
export { WolfGirlCtrlMap, GetWolfGrilName, RunControls } from "./Ctrls";
export { IsPlayerWolfGirl } from "./Check";

import { ModSDKModAPI } from "bondage-club-mod-sdk";

export abstract class IController {
    abstract readonly type: ControllerType;
    abstract readonly target_item: string[];
    abstract readonly available_ctrls: CtrlType[];
    abstract set(player: Character, item: (Item | undefined)[], type: CtrlType): void;
    abstract test(player: Character, item: Item[], type: CtrlType): TestCtrlResult;
    hook(mod: ModSDKModAPI): void { };
}

export interface TestCtrlResult {
    missing?: AssetGroupItemName[];
    rejected?: "type" | "mode" | "itemprop" | "unchanged";
}

export const TReject = (reason: Required<TestCtrlResult>["rejected"]) => ({ rejected: reason }) as TestCtrlResult;
export const TAccept = () => ({}) as TestCtrlResult;

export type CtrlType = "off" | "base" | "total" | "edge" | "deny" | "open" | "max" | "close";

export type ControllerType = "ArousalCtrl" | "FeetCtrl" | "HandsCtrl" | "ToysCtrl" | "VisionCtrl" |
    "VoiceCtrl" | "HearingCtrl" | "FuturisticPublicCtrl";