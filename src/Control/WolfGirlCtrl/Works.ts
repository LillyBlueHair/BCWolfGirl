import { ControllerType, CtrlType, RunControls, TestCtrlResult } from ".";
import { TimedWork, TimedWorkState } from "../Worker";
import { TestRunControls } from "./Ctrls";

export class RunControlWork extends TimedWork {
    constructor(readonly type: ControllerType, readonly mode: CtrlType) { super(); }

    run(player: Character): TimedWorkState {
        RunControls(player, this.type, this.mode);
        return TimedWorkState.finished;
    }
}

export class TestControlWork extends TimedWork {
    constructor(readonly type: ControllerType, readonly mode: CtrlType, readonly call: (r: TestCtrlResult) => TimedWorkState | void) {
        super();
    }

    run(player: Character): TimedWorkState {
        const result = TestRunControls(player, this.type, this.mode);
        return this.call(result) || TimedWorkState.finished;
    }
}