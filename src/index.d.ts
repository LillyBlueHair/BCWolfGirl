
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
        collar_only: boolean;
        items: DataOutfitItem[];
    },
    permission: {
        moderators: number[];
        loverModerators: boolean;
    },
    points: {
        current: number;
    },
    arousal: {
        orgasm: number;
        deny: number;
        resist: number;
        edge_time: number;
    }
}