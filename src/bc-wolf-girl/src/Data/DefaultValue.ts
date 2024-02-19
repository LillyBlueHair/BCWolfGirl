export function defaultValue(): WolfGrilData {
    return {
        outfit: {
            lite_mode: false,
            items: [],
            color_store: []
        },
        permission: {
            moderators: [],
            loverModerators: true
        },
        points: {
            current: 0,
            punish_time: 5 * 60 * 1000,
            task_time: 15 * 60 * 1000,
        },
        arousal: {
            orgasm: 0,
            ruined: 0,
            resist: 0,
            edge_time: 0,
        }
    };
}

function IsStringArray(data: any): data is string[] {
    if (!Array.isArray(data)) return false;
    return data.every((item) => typeof item === "string");
}

function IsNumberArray(data: any): data is number[] {
    if (!Array.isArray(data)) return false;
    return data.every((item) => typeof item === "number");
}

export function Validate(data: any): WolfGrilData {
    let defaultData = defaultValue();

    for (const k in defaultData) {
        if (data[k] === undefined) data[k] = defaultData[k as keyof WolfGrilData];
    }

    ((data: any) => {
        const dvalue = defaultData.outfit;
        const pd = data as Partial<WolfGrilData["outfit"]>;

        if (typeof pd.lite_mode !== "boolean") pd.lite_mode = dvalue.lite_mode;
        if (!Array.isArray(pd.items)) pd.items = dvalue.items;

        let items: DataOutfitItem[] = [];
        for (const item of pd.items) {
            if (typeof item !== "object") continue;
            const ii = item as Partial<DataOutfitItem>;
            if (typeof ii.asset !== "object") continue;
            if (typeof ii.asset.name !== "string") continue;
            if (typeof ii.asset.group !== "string") continue;
            if (typeof ii.color !== "string" && !IsStringArray(ii.color)) continue;
            if (typeof ii.property !== "object") continue;
            items.push(ii as DataOutfitItem);
        }
        pd.items = items;

        let color_store: ColorStoreItem[] = [];
        if (!Array.isArray(pd.color_store)) pd.color_store = dvalue.color_store;
        for (const item of pd.color_store) {
            if (typeof item !== "object") continue;
            const ii = item as Partial<ColorStoreItem>;
            if (typeof ii.asset !== "string") continue;
            if (typeof ii.group !== "string") continue;
            if (typeof ii.color !== "string" && !IsStringArray(ii.color)) continue;
            color_store.push(ii as ColorStoreItem);
        }
        pd.color_store = color_store;
    })(data["outfit"]);

    ((data: any) => {
        const dvalue = defaultData.permission;
        const pd = data as Partial<WolfGrilData["permission"]>;
        if (!IsNumberArray(pd.moderators)) data.moderators = dvalue.moderators;
        if (typeof pd.loverModerators !== "boolean") data.loverModerators = dvalue.loverModerators;
    })(data["permission"]);

    ((data: any) => {
        const dvalue = defaultData.points;
        const pd = data as Partial<WolfGrilData["points"]>;
        if (typeof pd.current !== "number") pd.current = dvalue.current;
        if (typeof pd.punish_time !== "number") pd.punish_time = dvalue.punish_time;
        if (typeof pd.task_time !== "number") pd.task_time = dvalue.task_time;
    })(data["points"]);

    ((data: any) => {
        const dvalue = defaultData.arousal;
        const pd = data as Partial<WolfGrilData["arousal"]>;
        if (typeof pd.orgasm !== "number") pd.orgasm = dvalue.orgasm;
        if (typeof pd.ruined !== "number") pd.ruined = dvalue.ruined;
        if (typeof pd.resist !== "number") pd.resist = dvalue.resist;
        if (typeof pd.edge_time !== "number") pd.edge_time = dvalue.edge_time;
    })(data["arousal"]);

    return data as WolfGrilData;
}