import { ModSDKModAPI } from "bondage-club-mod-sdk";

export abstract class IController {
    abstract readonly type: ControllerType;
    abstract readonly target_item: string[];
    abstract set(player: Character, item: Item[], type: CtrlType): void;
    hook(mod: ModSDKModAPI): void { };
}

export type CtrlType = "off" | "base" | "total" | "edge" | "deny" | "open" | "max" | "close";

export type ControllerType = "ArousalCtrl" | "FeetCtrl" | "HandsCtrl" | "ToysCtrl" | "VisionCtrl" |
    "VoiceCtrl" | "HearingCtrl" | "FuturisticPublicCtrl";