import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { CummlateMode, DisperseSetting, IInjection, InjectionType } from "./IInjection";


export class Anesthetic extends IInjection {
    cumulate: CummlateMode = "refresh";
    name: InjectionType = "anesthetic";
    duration = 15 * 60 * 1000;
    disperse = undefined;

    onInject(): void {
        if (Player?.ArousalSettings?.Progress !== undefined) {
            Player.ArousalSettings.Progress = 0;
            CharacterSetFacialExpression(Player, "Eyes", "Closed");
        }

        if (CurrentCharacter) {
            if (CurrentCharacter.FocusGroup) {
                CurrentCharacter.FocusGroup = null;
            }
            CurrentCharacter = null;
        }
    }

    update(player: PlayerCharacter): void {
        const input = ElementValue("InputChat");
        const rnd = Math.random();
        if (rnd < 0.1) {
            ElementValue("InputChat", input.substring(1));
        } else if (rnd < 0.6) {
            ElementValue("InputChat", input.replace(/^([z\.]*)./, "$1z"));
        } else {
            ElementValue("InputChat", input.replace(/^([z\.]*)./, "$1."));
        }
    }

    hook(mod: ModSDKModAPI, lateHook: (callback: () => void) => void) {
        lateHook(() => {
            mod.hookFunction('Player.CanWalk', 1, (args, next) => {
                if (this.isWorking()) return false;
                return next(args);
            });

            mod.hookFunction('Player.GetBlurLevel', 1, (args, next) => {
                const result = next(args);
                if (this.isWorking()) return result + 3;
                return result;
            });
        });

        mod.hookFunction('ChatRoomFocusCharacter', 1, (args, next) => {
            if (this.isWorking()) return;
            return next(args);
        });

        mod.hookFunction('SpeechGetGagLevel', 1, (args, next) => {
            const result = next(args);
            if ((args[0] as Character).IsPlayer() && this.isWorking()) return result + 2;
            return result;
        });
    }
}
