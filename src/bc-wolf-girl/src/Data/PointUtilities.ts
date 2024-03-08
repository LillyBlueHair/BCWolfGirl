import { DataManager } from "./DataManager";

type points_callback = (cur_points: number) => void;

export class PointsUtilities {
    constructor(readonly parent: DataManager) { }

    private save() {
        this.parent.save("points");
    }

    get data() {
        return this.parent.data.points;
    }

    get points() {
        return this.parent.data.points.current;
    }

    set points(arg: number) {
        this.parent.data.points.current = arg;
        this.save();
    }

    get punish_time() {
        return this.parent.data.points.punish_time;
    }

    set punish_time(arg: number) {
        this.parent.data.points.punish_time = arg;
        this.save();
    }

    get orgasm_punish_time() {
        return this.parent.data.points.orgasm_punish_time;
    }

    set orgasm_punish_time(arg: number) {
        this.parent.data.points.orgasm_punish_time = arg;
        this.save();
    }

    get task_time() {
        return this.parent.data.points.task_time;
    }

    set task_time(arg: number) {
        this.parent.data.points.task_time = arg;
        this.save();
    }

    use_points(arg: number) {
        return {
            then: (accept: points_callback, reject?: points_callback) => {
                if (this.points < arg) {
                    if (reject) reject(this.points);
                } else {
                    this.points -= arg;
                    accept(this.points);
                }
            }
        }
    }
}