import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { ArousalCtrl } from "./Ctrls/Arousal";
import { FeetCtrl } from "./Ctrls/Feet";
import { HandsCtrl } from "./Ctrls/Hands";
import { HearingCtrl } from "./Ctrls/Hearing";
import { ToysCtrl } from "./Ctrls/Toys";
import { VisionCtrl } from "./Ctrls/Vision";
import { VoiceCtrl } from "./Ctrls/Voice";
import { FuturisticBypass } from "./Ctrls/FuturisticBypass";
import { FCollarPublic } from "./Ctrls/FCollar";
import { IController } from "./IController";
import { TestCtrlResult } from "./IController";
import { ControllerType } from "./IController";
import { CtrlType } from "./IController";
import { TReject } from "./IController";

export { IsPlayerWolfGirl } from "./Check";

const WolfGirlCtrls = [HearingCtrl, ArousalCtrl, FeetCtrl,
    HandsCtrl, ToysCtrl, VisionCtrl, VoiceCtrl, FCollarPublic].map(c => new c);

export const WolfGirlCtrlMap = new Map(WolfGirlCtrls.map(c => [c.type, c] as [ControllerType, IController]));

export function RunControls(player: PlayerCharacter, type: ControllerType, mode: CtrlType) {
    const ctrl = WolfGirlCtrlMap.get(type);
    if (!ctrl) return false;
    const app_map = new Map(player.Appearance.map(e => [e.Asset.Group.Name, e] as [string, Item]));
    FuturisticBypass.instance.on = true;
    ctrl.set(player, ctrl.target_item.map(e => app_map.get(e)), mode);
    FuturisticBypass.instance.on = false;
    return true;
}

export function TestRunControls(player: PlayerCharacter, type: ControllerType, mode: CtrlType) {
    const ctrl = WolfGirlCtrlMap.get(type);

    if (!ctrl) return TReject("type");
    if (!ctrl.available_ctrls.includes(mode)) return TReject("mode");

    const app_map = new Map(player.Appearance.map(e => [e.Asset.Group.Name, e] as [string, Item]));
    const missing = ctrl.target_item.filter(e => !app_map.has(e));

    if (missing.length > 0) return { missing } as TestCtrlResult;
    return ctrl.test(player, ctrl.target_item.map(e => app_map.get(e) as Item), mode);
}

export function GetWolfGrilName(target: Character): string {
    return `狼女${target.MemberNumber ?? ""}`;
}

export function CtrlHook(mod: ModSDKModAPI, lateHook: (callback: () => void) => void) {
    WolfGirlCtrls.forEach(item => item.hook(mod, lateHook));
    FuturisticBypass.init(mod, lateHook);
}

export function ReduceTypeRecords(records: TypeRecord[], ref: TypeRecord): TypeRecord | undefined {
    if (records.length === 0) return undefined;
    const ref_ = { ...ref }
    Object.keys(ref_).forEach(key => ref_[key] = 0);

    for (const record of records) {
        if (Object.keys(record).some(key => ref_[key] === undefined)) return undefined;
        Object.keys(record).forEach(key => ref_[key] = Math.max(record[key], ref_[key]));
    }

    return ref_;
}


