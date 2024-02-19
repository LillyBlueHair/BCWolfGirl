interface DataOutfitItem {
    asset: {
        name: string;
        group: string;
    },
    color: string | string[];
    property: any;
}

interface ColorStoreItem {
    asset: string;
    group: string;
    color: string | string[];
}

interface WolfGrilData {
    outfit: {
        lite_mode: boolean;
        items: DataOutfitItem[];
        color_store: ColorStoreItem[];
    },
    permission: {
        moderators: number[];
        loverModerators: boolean;
    },
    points: {
        current: number;
        punish_time: number;
        task_time: number;
    },
    arousal: {
        orgasm: number;
        ruined: number;
        resist: number;
        edge_time: number;
    }
}

interface Window {
    __load_flag__?: boolean;
}
declare const __mod_version__: string;
declare const __mod_name__: string;
declare const __repo__: string;
declare const __script_id__: string;