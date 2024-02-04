function buildVersion(v1: number, v2: number, v3: number) {
    return `${v1}.${v2}.${v3}`;
}

export const ModVersion = buildVersion(0, 3, 1);
export const ModName = 'BondageClub WolfGril';
export const HTMLIDPrefix = "BCWG_";

export const DebugMode = false;

export const SettingName = "BCWolfGrilSetting";
export const DataKeyName = "BCWolfGrilData";

export const CUSTOM_ACTION_TAG = "SSCustomAction";