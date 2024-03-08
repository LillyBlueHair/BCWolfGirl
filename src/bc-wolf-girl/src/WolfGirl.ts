import bcMod from 'bondage-club-mod-sdk'
import { CUSTOM_ACTION_TAG, GIT_REPO, ModName, ModVersion, SCRIPT_ID } from './Definition';
import { BeepHandler, BeepRawHandler, ChatHandler } from './ChatRoom/Handler';
import { TimedWorker } from "./Control/Worker";
import { ChatRoomAction, ChatRoomHandler } from 'bc-utilities';
import { EILNetwork } from './Network';
import { WolfGirlCtrlInit, IsPlayerWolfGirl } from './Control/WolfGirlCtrl';
import { OrgasmMonitor } from 'bc-utilities';
import { DataManager } from "./Data";
import { ChatRoomWork } from './Control/RoomCtrl/Work';
import { InjectionManager } from './Control/Injection';
import { InitChatCmds } from './ChatRoom/OutfitCheckChatCmd';
import { TaskCtrlInit } from './Control/TaskCtrl';
import { TimeStat } from './Control/TimeStat';
import { ToolsSafety } from './Control/ToolsSafety';
import { OrgasmPunishMode } from './Control/OrgasmPunishMode';
import { AdditionalInventoryInit } from './Control/OutfitCtrl/Inventory';
import { ActivityProvider } from './ChatRoom/Activity';

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

    OrgasmMonitor.init(mod).then(orgasm =>
        DataManager.init(mod, `${ModName} v${ModVersion} loaded.`).then(
            _ => {
                DataManager.arousal.setMonitor((pl) => IsPlayerWolfGirl(pl), orgasm);
                TaskCtrlInit(1000, orgasm);
                OrgasmPunishMode.init(orgasm);
            }));

    TimedWorker.init(1000);
    TimeStat.init(1000);
    ToolsSafety.init(10000);
    EILNetwork.init(asset_url);
    ChatRoomAction.init(CUSTOM_ACTION_TAG);

    BeepHandler(mod);
    ChatRoomHandler.init(mod).then(handler => ChatHandler(handler));
    AdditionalInventoryInit(mod);

    WolfGirlCtrlInit(mod, lateHook);

    ActivityProvider.init(mod);

    ChatRoomWork.init(mod, lateHook);
    InjectionManager.init(mod, lateHook);

    let initial_notify_not_shown = true;
    mod.hookFunction('ChatRoomRun', 20, (args, next) => {
        next(args);
        if (initial_notify_not_shown) {
            ChatRoomAction.instance.LocalAction(`EIL狼女训练套装智能化辅助系统 ${ModVersion} 已加载。`);
            initial_notify_not_shown = false;
        }
    });

    InitChatCmds(lateHook);

    (async () => {
        while (typeof (window as any).Player === 'undefined')
            await new Promise(resolve => setTimeout(resolve, 500));
        lateHooks.forEach(hook => hook());
    })();

    window.__load_flag__ = true;
    console.log(`${ModName} v${ModVersion} loaded.`);
})()