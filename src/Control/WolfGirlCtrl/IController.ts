import { ModSDKModAPI } from "bondage-club-mod-sdk";

export interface TestCtrlMissingResult {
    missing: AssetGroupItemName[];
}

export type TestCtrlResult = Partial<TestCtrlMissingResult> & {
    rejected?: "type" | "mode" | "itemprop" | "unchanged";
}

export abstract class IController {
    abstract readonly type: ControllerType;
    abstract readonly target_item: string[];
    abstract readonly available_ctrls: CtrlType[];
    abstract set(player: Character, item: (Item | undefined)[], type: CtrlType): void;
    abstract test(player: Character, item: Item[], type: CtrlType): TestCtrlResult;
    hook(mod: ModSDKModAPI): void { };
}

export type ControllerType = "ArousalCtrl" | "FeetCtrl" | "HandsCtrl" | "ToysCtrl" | "VisionCtrl" |
    "VoiceCtrl" | "HearingCtrl" | "FuturisticPublicCtrl";

export type CtrlType = "off" | "base" | "total" | "edge" | "deny" | "open" | "max" | "close" | "random";

export function DetailedItemTestRecords(items: Item[], compare: (oldrecords: TypeRecord[]) => TestCtrlResult): TestCtrlResult {
    const oldrecords = CollectTypeRecords(items);
    if (!oldrecords) return TReject("itemprop");
    return compare(oldrecords);
}

export function StandardItemTestRecords(items: Item[], target: TypeRecord[]): TestCtrlResult {
    const oldrecords = CollectTypeRecords(items);
    if (!oldrecords) return TReject("itemprop");
    if (RecordsEqual(target, oldrecords)) return TReject("unchanged");
    return TAccept();
}

export const TReject = (reason: Required<TestCtrlResult>["rejected"]) => ({ rejected: reason }) as TestCtrlResult;

export const TAccept = () => ({}) as TestCtrlResult;

export function RecordsEqual(target: TypeRecord[], cur: TypeRecord[]) {
    if (target.length !== cur.length) return false;
    return target.every((e, idx) => Object.keys(e).every(key => e[key] === cur[idx][key]));
}

export function CollectTypeRecords(items: Item[]): TypeRecord[] | undefined {
    if (items.some(item => !item.Property?.TypeRecord)) return undefined;
    return items.map(item => item.Property?.TypeRecord).filter(e => e) as TypeRecord[];
}

export function StandardItemSetRecords(player: Character, items: (Item | undefined)[], target: TypeRecord[]) {
    items.forEach((item, idx) => target[idx] && item && ExtendedItemSetOptionByRecord(player, item, target[idx]));
}

