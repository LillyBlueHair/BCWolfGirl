import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { CummlateMode, DisperseSetting, IInjection, InjectionType } from "./IInjection";


export class Aphrodisiac extends IInjection {
    disperse: DisperseSetting = {
        target: ['inhibitor'],
        mode: "timely_cancel"
    }
    cumulate: CummlateMode = "add";
    name: InjectionType = "aphrodisiac";
    duration = 15 * 60 * 1000;

    savedArousal: number = -1;

    update(player: Character): void {
        if (this.isWorking() && this.savedArousal !== -1) {
            const diff = player.ArousalSettings.Progress - this.savedArousal;
            player.ArousalSettings.Progress += diff;
        }
        this.savedArousal = player.ArousalSettings.Progress;
    }

    hook(mod: ModSDKModAPI): void {
        mod.hookFunction('ChatRoomDrawArousalScreenFilter', 1, (args, next) => {
            if (!args[3] || args[3] < 60) args[3] = 60;
            return next(args);
        });
    }
}
