export type OutfitDressType = {
    Asset: {
        Name: string;
        Group: string;
    };
    Color: string[];
    Property?: {
        Type?: string | null;
        OverridePriority?: number | { [key: string]: number };
    };
};

export type OutfitItemType = {
    Asset: {
        Name: string;
        Group: string;
    };
    Color: string[] | (() => string[]);
    Craft: {
        Name: string;
        Description: string;
        Lock: string | null;
        Property: string;
        OverridePriority: null | number;
        Private: boolean;
    };
    Property?: (() => ItemProperty) | ItemProperty;
}

export enum OutfitWorkState {
    worked, finished, interrupted
}

export type OutfitWork = (player: Character) => OutfitWorkState;
export abstract class OutfitWorkSet {
    static UndressWork: OutfitWork;
    static RedressWork: OutfitWork;
}