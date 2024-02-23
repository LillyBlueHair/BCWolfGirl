export function defaultValue(): WolfGirlData {
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
        settings: {
            orgasmPunishMode: 0
        },
        stat: {
            script_run_time: 0,
            wolfgirl_time: 0,
            stash_time: 0,
            last_fix_time: 0,
            task: {
                finished: 0,
                failed: 0,
                counter: {}
            }
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

export function Validate(data: any): WolfGirlData {
    const defaultData = defaultValue();
    const xd = data as Partial<WolfGirlData>;

    const ret: Partial<WolfGirlData> = {};

    ret.outfit = ((data: Partial<WolfGirlData["outfit"]> | undefined) => {
        const dvalue = defaultData.outfit;
        if (data === undefined) return dvalue;

        if (typeof data.lite_mode === "boolean") dvalue.lite_mode = data.lite_mode;
        if (Array.isArray(data.items)) {
            let items: DataOutfitItem[] = [];
            for (const item of data.items) {
                if (typeof item !== "object") continue;
                const ii = item as Partial<DataOutfitItem>;
                if (typeof ii.asset !== "object") continue;
                if (typeof ii.asset.name !== "string") continue;
                if (typeof ii.asset.group !== "string") continue;
                if (typeof ii.color !== "string" && !IsStringArray(ii.color)) continue;
                if (typeof ii.property !== "object") continue;
                items.push(ii as DataOutfitItem);
            }
            dvalue.items = items;
        }

        if (Array.isArray(data.color_store)) {
            let color_store: ColorStoreItem[] = [];
            for (const item of data.color_store) {
                if (typeof item !== "object") continue;
                const ii = item as Partial<ColorStoreItem>;
                if (typeof ii.asset !== "string") continue;
                if (typeof ii.group !== "string") continue;
                if (typeof ii.color !== "string" && !IsStringArray(ii.color)) continue;
                color_store.push(ii as ColorStoreItem);
            }
            dvalue.color_store = color_store;
        }
        return dvalue;
    })(xd.outfit);

    ret.permission = ((data: Partial<WolfGirlData["permission"]> | undefined) => {
        const dvalue = defaultData.permission;
        if (data === undefined) return dvalue;
        if (IsNumberArray(data.moderators)) dvalue.moderators = data.moderators;
        if (typeof data.loverModerators === "boolean") dvalue.loverModerators = data.loverModerators;
        return dvalue;
    })(xd.permission);

    ret.settings = ((data: Partial<WolfGirlData["settings"]> | undefined) => {
        const dvalue = defaultData.settings;
        if (data === undefined) return dvalue;
        if (typeof data.orgasmPunishMode === "number") dvalue.orgasmPunishMode = data.orgasmPunishMode;
        return dvalue;
    })(xd.settings);

    ret.stat = ((data: Partial<WolfGirlData["stat"]> | undefined) => {
        const dvalue = defaultData.stat;
        if (data === undefined) return dvalue;
        if (typeof data.script_run_time === "number") dvalue.script_run_time = data.script_run_time;
        if (typeof data.wolfgirl_time === "number") dvalue.wolfgirl_time = data.wolfgirl_time;
        if (typeof data.stash_time === "number") dvalue.stash_time = data.stash_time;
        if (typeof data.last_fix_time === "number") dvalue.last_fix_time = data.last_fix_time;
        if (typeof data.task === "object") {
            const dvalue = defaultData.stat.task;
            if (typeof data.task.finished === "number") dvalue.finished = data.task.finished;
            if (typeof data.task.failed === "number") dvalue.failed = data.task.failed;
            if (typeof data.task.counter === "object") {
                const dvalue = defaultData.stat.task.counter;
                for (const key in data.task.counter) {
                    if (typeof data.task.counter[key as TaskCounterType] === "number")
                        dvalue[key as TaskCounterType] = (data.task.counter[key as TaskCounterType] as number);
                }
            }
        }
        return dvalue;
    })(xd.stat);

    ret.points = ((data: Partial<WolfGirlData["points"]> | undefined) => {
        const dvalue = defaultData.points;
        if (data === undefined) return dvalue;
        if (typeof data.current === "number") dvalue.current = data.current;
        if (typeof data.punish_time === "number") dvalue.punish_time = data.punish_time;
        if (typeof data.task_time === "number") dvalue.task_time = data.task_time;
        return dvalue;
    })(xd.points);

    ret.arousal = ((data: Partial<WolfGirlData["arousal"]> | undefined) => {
        const dvalue = defaultData.arousal;
        if (data === undefined) return dvalue;
        if (typeof data.orgasm === "number") dvalue.orgasm = data.orgasm;
        if (typeof data.ruined === "number") dvalue.ruined = data.ruined;
        if (typeof data.resist === "number") dvalue.resist = data.resist;
        if (typeof data.edge_time === "number") dvalue.edge_time = data.edge_time;
        return dvalue;
    })(xd.arousal);

    return ret as WolfGirlData;
}