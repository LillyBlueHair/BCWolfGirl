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
import { ControllerType, IController, CtrlType, TestCtrlResult, TReject, TAccept } from ".";

const WolfGirlCtrls = [HearingCtrl, ArousalCtrl, FeetCtrl,
    HandsCtrl, ToysCtrl, VisionCtrl, VoiceCtrl, FCollarPublic].map(c => new c);

export const WolfGirlCtrlMap = new Map(WolfGirlCtrls.map(c => [c.type, c] as [ControllerType, IController]));

export function RunControls(player: Character, type: ControllerType, mode: CtrlType) {
    const ctrl = WolfGirlCtrlMap.get(type);
    if (!ctrl) return false;
    const app_map = new Map(player.Appearance.map(e => [e.Asset.Group.Name, e] as [string, Item]));
    FuturisticBypass.instance.on = true;
    ctrl.set(player, ctrl.target_item.map(e => app_map.get(e) as Item), mode);
    FuturisticBypass.instance.on = false;
    return true;
}

export function TestRunControls(player: Character, type: ControllerType, mode: CtrlType) {
    const ctrl = WolfGirlCtrlMap.get(type);

    if (!ctrl) return TReject("type");
    if (!ctrl.available_ctrls.includes(mode)) return TReject("mode");

    const app_map = new Map(player.Appearance.map(e => [e.Asset.Group.Name, e] as [string, Item]));
    const missing = ctrl.target_item.filter(e => !app_map.has(e));

    if (missing.length > 0) return { missing } as TestCtrlResult;
    return ctrl.test(player, ctrl.target_item.map(e => app_map.get(e) as Item), mode);
}

export function GetWolfGrilName(player: Character): string {
    return `狼女${player.MemberNumber}`;
}

export function CtrlHook(mod: ModSDKModAPI) {
    WolfGirlCtrls.forEach(item => item.hook(mod));
    FuturisticBypass.init(mod);
}

export function CollectTypeRecords(items: Item[]): TypeRecord[] | undefined {
    if (items.some(item => !item.Property?.TypeRecord)) return undefined;
    return items.map(item => item.Property?.TypeRecord).filter(e => e) as TypeRecord[];
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

export function StandardItemSetRecords(player: Character, items: Item[], target: TypeRecord[]) {
    items.forEach((item, idx) => target[idx] && ExtendedItemSetOptionByRecord(player, item, target[idx]));
}

export function StandardItemTestRecords(items: Item[], target: TypeRecord[]): TestCtrlResult {
    const oldrecords = CollectTypeRecords(items);
    if (!oldrecords) return TReject("itemprop");
    if (!RecordsEqual(target, oldrecords)) return TReject("unchanged");
    return TAccept();
}

export function RecordsEqual(target: TypeRecord[], cur: TypeRecord[]) {
    if (target.length !== cur.length) return false;
    return target.every((e, idx) => Object.keys(e).every(key => e[key] === cur[idx][key]));
}

export function DetailedItemTestRecords(items: Item[], compare: (oldrecords: TypeRecord[]) => TestCtrlResult): TestCtrlResult {
    const oldrecords = CollectTypeRecords(items);
    if (!oldrecords) return TReject("itemprop");
    return compare(oldrecords);
}