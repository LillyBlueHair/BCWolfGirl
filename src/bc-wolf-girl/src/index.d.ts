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

type TaskCounterType = "Resisted" | "Orgasmed" | "BreastPlayed" | "VulvaPlayed" | "Spanked";

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
    stat: {
        script_run_time: number;
        wolfgirl_time: number;
        stash_time: number;
        last_fix_time: number;
        task: {
            finished: number;
            failed: number;
            counter: {
                [k in TaskCounterType]?: number;
            },
        }
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