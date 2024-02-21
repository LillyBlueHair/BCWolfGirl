export type DataKeys = keyof WolfGrilData;

type DataCategoryType = "Default" | "Frequent";

const DataCategory: Record<DataKeys, DataCategoryType> = {
    outfit: "Default",
    permission: "Default",
    stat: "Frequent",
    settings: "Default",
    points: "Default",
    arousal: "Frequent"
}

export type FrequentData = Pick<WolfGrilData, "stat" | "arousal">;
export type DefaultData = Omit<WolfGrilData, "stat" | "arousal">;

export function isFrequentDataKey(key: string): key is keyof FrequentData {
    return DataCategory[key as DataKeys] === "Frequent";
}

export function isDefaultDataKey(key: string): key is keyof DefaultData {
    return DataCategory[key as DataKeys] === "Default";
}

export function isDefaultData(data: Partial<WolfGrilData>): data is WolfGrilData {
    return Object.keys(DataCategory).every((key) => data[key as DataKeys] !== undefined);
}

export function PickDefaultData(data: Partial<WolfGrilData>): DefaultData {
    return Object.keys(DataCategory).reduce((prev, cur) => {
        if (isDefaultDataKey(cur))
            Object.assign(prev, { [cur]: data[cur] });
        return prev;
    }, {} as Partial<DefaultData>) as DefaultData;
}

export function PickFrequenceData(data: Partial<WolfGrilData>): FrequentData {
    return Object.keys(DataCategory).reduce((prev, cur) => {
        if (isFrequentDataKey(cur))
            Object.assign(prev, { [cur]: data[cur] });
        return prev;
    }, {} as Partial<FrequentData>) as FrequentData;
}