import { InjectionManager } from ".";

import { CummlateMode, DisperseSetting, IInjection, InjectionType } from "./IInjection";


export class Pickmeup extends IInjection {
    name: InjectionType = "pickmeup";
    duration = 0;
    cumulate: CummlateMode = "none";
    disperse: DisperseSetting = {
        mode: "all_cancel",
        target: ['anesthetic'],
    }
}
