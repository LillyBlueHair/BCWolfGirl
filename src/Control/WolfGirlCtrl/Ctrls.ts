import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { ArousalCtrl } from "./Ctrls/Arousal";
import { FeetCtrl } from "./Ctrls/Feet";
import { HandsCtrl } from "./Ctrls/Hands";
import { HearingCtrl } from "./Ctrls/Hearing";
import { ToysCtrl } from "./Ctrls/Toys";
import { VisionCtrl } from "./Ctrls/Vision";
import { VoiceCtrl } from "./Ctrls/Voice";
import { ControllerType, CtrlType, IController } from "./ICtrl";
import { FuturisticBypass } from "./FuturisticBypass";
import { FCollarPublic } from "./Ctrls/FCollar";

const WolfGirlCtrls = [HearingCtrl, ArousalCtrl, FeetCtrl,
    HandsCtrl, ToysCtrl, VisionCtrl, VoiceCtrl, FCollarPublic].map(c => new c);

export const WolfGirlCtrlMap = new Map(WolfGirlCtrls.map(c => [c.type, c] as [ControllerType, IController]));

export function RunControls(player: Character, type: ControllerType, mode: CtrlType) {
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
    WolfGirlCtrls.forEach(item => item.hook(mod));
    FuturisticBypass.init(mod);
}