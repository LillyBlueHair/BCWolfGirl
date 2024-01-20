import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { ArousalCtrl } from "./Ctrls/Arousal";
import { FeetCtrl } from "./Ctrls/Feet";
import { HandsCtrl } from "./Ctrls/Hands";
import { HearingCtrl } from "./Ctrls/Hearing";
import { ToysCtrl } from "./Ctrls/Toys";
import { VisionCtrl } from "./Ctrls/Vision";
import { VoiceCtrl } from "./Ctrls/Voice";
import { CtrlType, IController } from "./ICtrl";
import { FuturisticBypass } from "./FuturisticBypass";

export const WolfGirlCtrls = [
    { name: "HearingCtrl", ctrl: new HearingCtrl() },
    { name: "ArousalCtrl", ctrl: new ArousalCtrl() },
    { name: "FeetCtrl", ctrl: new FeetCtrl() },
    { name: "HandsCtrl", ctrl: new HandsCtrl() },
    { name: "ToysCtrl", ctrl: new ToysCtrl() },
    { name: "VisionCtrl", ctrl: new VisionCtrl() },
    { name: "VoiceCtrl", ctrl: new VoiceCtrl() },
]

export const WolfGirlCtrlMap = new Map(WolfGirlCtrls.map(c => [c.name, c.ctrl] as [string, IController]));

export function RunControls(player: Character, type: string, mode: CtrlType) {
    const ctrl = WolfGirlCtrlMap.get(type);
    if (!ctrl) return false;

    const items = ctrl.target_item.map(e => InventoryGet(player, e)) as Item[];
    FuturisticBypass.instance.on = true;
    ctrl.set(player, items, mode);
    FuturisticBypass.instance.on = false;
    return true;
}

export function GetWolfGrilName(player: Character): string {
    return `狼女${player.MemberNumber}`;
}

export function CtrlHook(mod: ModSDKModAPI) {
    WolfGirlCtrls.forEach(item => item.ctrl.hook(mod));
    FuturisticBypass.init(mod);
}