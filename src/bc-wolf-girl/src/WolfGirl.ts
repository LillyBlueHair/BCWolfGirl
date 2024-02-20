import bcMod from 'bondage-club-mod-sdk'
import { CUSTOM_ACTION_TAG, GIT_REPO, ModName, ModVersion, SCRIPT_ID } from './Definition';
import { BeepRawHandler, ChatRoomHandler } from './ChatRoom/Handler';
import { TimedWorker } from "./Control/Worker";
import { DialogInventoryBuildHandler } from './Control/OutfitCtrl';
import { ChatRoomAction } from 'bc-utilities';
import { EILNetwork } from './Network';
import { CtrlHook, IsPlayerWolfGirl } from './Control/WolfGirlCtrl';
import { OrgasmMonitor } from 'bc-utilities';
import { DataManager } from './Data';
import { TaskCtrl } from "./Control/TaskCtrl/TaskCtrl";
import { RegisterActivities } from './ChatRoom/Activity';
import { ChatRoomWork } from './Control/RoomCtrl/Work';
import { InjectionManager } from './Control/Injection';
import { DrinkHook } from './Control/Drink';
import { InitChatCmds } from './ChatRoom/OutfitCheckChatCmd';
import { TaskCtrlInit } from './Control/TaskCtrl';
import { TimedSummary } from './Control/TimedSummary';
import { ToolsSafety } from './Control/ToolsSafety';

(function () {
    if (window.__load_flag__) return;
    window.__load_flag__ = false;

    const this_script_src = document.getElementById(SCRIPT_ID)?.getAttribute('src');
    if (!this_script_src) {
        console.error('WolfGirlLoader not found.');
        return;
    }
    const asset_url = this_script_src.substring(0, this_script_src.lastIndexOf('/') + 1) + 'assets/';


    const mod = bcMod.registerMod({
        name: ModName,
        fullName: ModName,
        version: ModVersion,
        repository: GIT_REPO
    });
    const lateHooks: (() => void)[] = [];
    const lateHook = (callback: () => void) => lateHooks.push(callback);

    DataManager.init(mod, `${ModName} v${ModVersion} loaded.`);

    TimedWorker.init(1000);
    TimedSummary.init(1000);
    TaskCtrlInit(1000);
    ToolsSafety.init(10000);
    EILNetwork.init(asset_url);
    ChatRoomAction.init(CUSTOM_ACTION_TAG);

    ChatRoomRegisterMessageHandler(ChatRoomHandler());
    mod.hookFunction('ServerAccountBeep', 2, (args, next) => {
        next(args);
        if (Player) BeepRawHandler(Player, args[0]);
    });

    mod.hookFunction('DialogInventoryBuild', 1, (args, next) => {
        next(args);
        DialogInventoryBuildHandler(args[0] as Character, args[2] as boolean);
    });

    CtrlHook(mod, lateHook);

    RegisterActivities(mod, lateHook);

    ChatRoomWork.init(mod, lateHook);
    InjectionManager.init(mod, lateHook);
    DrinkHook(mod, lateHook);

    const orgasm = new OrgasmMonitor(mod);

    orgasm.AddOrgasmEvent((player) => {
        if (IsPlayerWolfGirl(player))
            DataManager.arousal.orgasm += 1;
        TaskCtrl.instance.onOrgasm(player);
    });

    orgasm.AddResistEvent((player) => {
        if (IsPlayerWolfGirl(player))
            DataManager.arousal.resist += 1;
        TaskCtrl.instance.onResist(player);
    });

    orgasm.AddRuinedEvent((player) => {
        if (IsPlayerWolfGirl(player))
            DataManager.arousal.ruined += 1;
    });

    lateHooks.push(() => InitChatCmds());

    (async () => {
        while (typeof (window as any).Player === 'undefined')
            await new Promise(resolve => setTimeout(resolve, 500));
        lateHooks.forEach(hook => hook());
    })();

    window.__load_flag__ = true;
    console.log(`${ModName} v${ModVersion} loaded.`);
})()