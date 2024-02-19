import { IInjection, DisperseMode, CummlateMode, InjectionType, DisperseSetting } from "./IInjection";


export class Inhibitor extends IInjection {
    cumulate: CummlateMode = 'add';
    name: InjectionType = "inhibitor";
    duration = 15 * 60 * 1000;
    disperse: DisperseSetting = {
        mode: "timely_cancel",
        target: ['aphrodisiac']
    };

    onInject(): void {
        if (Player?.ArousalSettings?.Progress)
            Player.ArousalSettings.Progress = 0;
    }

    savedArousal: number = -1;

    update(player: PlayerCharacter): void {
        if (player?.ArousalSettings?.Progress === undefined) return;

        if (this.isWorking() && this.savedArousal !== -1) {
            const diff = player.ArousalSettings.Progress - this.savedArousal;
            if (diff > 0) player.ArousalSettings.Progress -= diff * 0.5;
        }
        this.savedArousal = player.ArousalSettings.Progress;
    }
}
