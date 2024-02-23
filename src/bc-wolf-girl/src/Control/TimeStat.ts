import { DataManager } from "../Data";
import { IsPlayerWolfGirl } from "./WolfGirlCtrl";

export class TimeStat {
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

    private static _instance: TimeStat | undefined = undefined;
    static init(resolution: number) {
        if (TimeStat._instance) return;
        TimeStat._instance = new TimeStat(resolution);
    }
    static get instance() {
        return TimeStat._instance as TimeStat;
    }
}