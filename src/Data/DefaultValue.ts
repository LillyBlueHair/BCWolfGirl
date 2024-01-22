export function defaultValue(): WolfGrilData {
    return {
        outfit: {
            collar_only: false,
            items: []
        },
        permission: {
            moderators: [],
            loverModerators: true
        },
        points: {
            current: 0
        },
        arousal: {
            orgasm: 0,
            deny: 0,
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

        if (typeof pd.collar_only !== "boolean") pd.collar_only = dvalue.collar_only;
        if (!Array.isArray(pd.items)) pd.items = dvalue.items;

        let items = [];
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
    })(data["points"]);

    ((data: any) => {
        const dvalue = defaultData.arousal;
        const pd = data as Partial<WolfGrilData["arousal"]>;
        if (typeof pd.orgasm !== "number") pd.orgasm = dvalue.orgasm;
        if (typeof pd.deny !== "number") pd.deny = dvalue.deny;
        if (typeof pd.resist !== "number") pd.resist = dvalue.resist;
        if (typeof pd.edge_time !== "number") pd.edge_time = dvalue.edge_time;
    })(data["arousal"]);

    return data as WolfGrilData;
}