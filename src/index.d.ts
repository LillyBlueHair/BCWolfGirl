
interface Window {
    BCWorlGirl_Loaded?: boolean;
}

interface ColorPattern {
    item: string;
    group: string;
    color: string | string[];
}

interface WolfGrilData {
    color: {
        patterns: ColorPattern[];
    },
    permission: {
        moderators: number[];
        loverModerators: boolean;
    },
    points: {
        current: number;
    }
}