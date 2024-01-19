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
    Color: string[] | string;
    Craft: {
        Name: string;
        Description: string;
        Lock?: string;
        Property?: string;
        OverridePriority?: number;
        TypeRecord?: { [k: string]: number };
        ItemProperty?: ItemProperty;
    };
}

export enum OutfitWorkState {
    worked, finished, interrupted
}

export abstract class OutfitWork {
    abstract run(player: Character): OutfitWorkState;
}