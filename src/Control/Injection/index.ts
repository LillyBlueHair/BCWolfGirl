import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { IInjection, InjectionType } from "./IInjection";
import { Anesthetic } from "./Anesthetic";
import { Pickmeup } from "./Pickmeup";
import { Aphrodisiac } from "./Aphrodisiac";
import { Inhibitor } from "./Inhibitor";

const injections = [Anesthetic, Pickmeup, Aphrodisiac, Inhibitor];

export class InjectionManager {
    injections: Map<InjectionType, IInjection>;

    // name -> end time
    working: Map<InjectionType, number> = new Map();

    constructor(mod: ModSDKModAPI, lateHook: (callback: () => void) => void) {
        this.injections = new Map(injections.map(i => new i).map(injection => [injection.name, injection]));
        this.injections.forEach(injection => injection.hook(mod, lateHook));
        this.injections.forEach((i, name) => i.isWorking = () => this.working.has(name));

        setInterval(() => {
            const now = Date.now();
            this.working.forEach((time, name) => {
                if (time < now) this.working.delete(name);
                else if (Player?.MemberNumber) this.injections.get(name)?.update(Player);
            });
        }, 100);
    }

    doInject(name: InjectionType) {
        const injection = this.injections.get(name);
        if (!injection) return;

        const now = Date.now();
        let duration = injection.duration;

        if (injection.disperse) {
            const disperse = injection.disperse;
            if (disperse.mode === "all_cancel") {
                disperse.target.forEach(target => this.working.delete(target));
            } else if (disperse.mode === "timely_cancel") {
                disperse.target.forEach(target => {
                    const working = this.working.get(target);
                    if (working !== undefined) {
                        const remain = working - duration;
                        if (remain > now) this.working.set(target, remain);
                        else {
                            this.working.delete(target);
                            duration -= (working - now);
                        }
                    }
                });
            }
        }

        injection.onInject();

        if (injection.cumulate === "refresh") {
            this.working.set(name, Date.now() + duration);
        } else if (injection.cumulate === "add" && this.working.has(name)) {
            this.working.set(name, this.working.get(name)! + duration);
        }
    }


    static _instance: InjectionManager | undefined = undefined;

    static get instance() {
        return InjectionManager._instance as InjectionManager;
    }

    static init(mod: ModSDKModAPI, lateHook: (callback: () => void) => void) {
        if (InjectionManager._instance) return;
        InjectionManager._instance = new InjectionManager(mod, lateHook);
    }
}