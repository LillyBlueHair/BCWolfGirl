
interface Window {
    BCWorlGirl_Loaded?: boolean;
}

interface DataOutfitItem {
    asset: {
        name: string;
        group: string;
    },
    color: string | string[];
    property: any;
}

interface WolfGrilData {
    outfit: {
        lite_mode: boolean;
        items: DataOutfitItem[];
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