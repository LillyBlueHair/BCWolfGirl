import { DataManager } from "../Data";
import { IsPlayerWolfGirl } from "./WolfGirlCtrl";

export class TimedSummary {
    private timer: number;

    constructor(readonly resolution: number) {
        this.timer = Date.now();
        setInterval(() => {
            if (Player && Player.MemberNumber) {
                const time = Date.now();
                const isWolfGirl = IsPlayerWolfGirl(Player);
                const isStashed = DataManager.outfit.items.size > 0;
                DataManager.statistics.add_time(isWolfGirl, isStashed, time - this.timer);
                this.timer = time;
            }
        }, resolution);
    }

    private static _instance: TimedSummary | undefined = undefined;
    static init(resolution: number) {
        if (TimedSummary._instance) return;
        TimedSummary._instance = new TimedSummary(resolution);
    }
    static get instance() {
        return TimedSummary._instance as TimedSummary;
    }
}