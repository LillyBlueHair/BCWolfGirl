import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { ParseMessage } from "../Message";

export function DrinkAphrodisiac(player: Character) {
    ParseMessage({ mode: "local", msg: "刚刚喝下的东西让你兴奋异常" });
    player.ArousalSettings.Progress = 100;
    ActivityOrgasmPrepare(player, false);
}

let RedbullDrinkTimeout = 0;

export function DrinkRedbull(player: Character) {
    ParseMessage({ mode: "local", msg: "你喝下了一罐红牛，感觉充满了力量, 似乎能挣脱一切束缚" });
    RedbullDrinkTimeout = Date.now() + 15 * 60 * 1000;
}

export function DrinkHook(mod: ModSDKModAPI, lateHook: (callback: () => void) => void) {
    mod.hookFunction("DialogStruggleStart", 1, (args, next) => {
        const [C, Action, PrevItem, NextItem] = args as [Character, string, Item, Item];
        if (C.MemberNumber === Player?.MemberNumber && RedbullDrinkTimeout > Date.now() && Action === "ActionStruggle") {
            PrevItem.Difficulty = -50;
            RedbullDrinkTimeout = 0;
        }
        return next(args);
    });
}