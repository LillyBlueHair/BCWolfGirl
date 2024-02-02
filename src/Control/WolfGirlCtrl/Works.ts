import { RunControls } from ".";
import { ControllerType } from "./IController";
import { CtrlType } from "./IController";
import { TestCtrlResult } from "./IController";
import { TimedWork, TimedWorkState } from "../Worker";
import { TestRunControls } from ".";

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