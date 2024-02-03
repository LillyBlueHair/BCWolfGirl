import bcMod from 'bondage-club-mod-sdk'
import { CUSTOM_ACTION_TAG, ModName, ModVersion } from './Definition';
import { BeepRawHandler, ChatRoomHandler } from './ChatRoom/Handler';
import { TimedWorker } from "./Control/Worker";
import { DialogInventoryBuildHandler } from './Control/OutfitCtrl';
import { ChatRoomAction } from './utils/ChatMessages';
import { EILNetwork } from './Network';
import { CtrlHook, IsPlayerWolfGirl } from './Control/WolfGirlCtrl';
import { OrgasmMonitor } from './utils/Orgasm';
import { DataManager } from './Data';
import { TaskCtrl } from "./Control/TaskCtrl/TaskCtrl";
import { RegisterActivities } from './ChatRoom/Activity';
import { ChatRoomWork } from './Control/RoomCtrl/Work';

(function () {
    if (window.BCWorlGirl_Loaded) return;
    window.BCWorlGirl_Loaded = false;

    const this_script_src = document.getElementById('WolfGirlLoader')?.getAttribute('src');
    if (!this_script_src) {
        console.log('WolfGirlLoader not found.');
        return;
    }
    const asset_url = this_script_src.substring(0, this_script_src.lastIndexOf('/') + 1) + 'assets/';

    TimedWorker.init(1000);
    TaskCtrl.init(1000);
    EILNetwork.init(asset_url);
    ChatRoomAction.init(CUSTOM_ACTION_TAG);

    const mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion });

    ChatRoomRegisterMessageHandler(ChatRoomHandler());
    mod.hookFunction('ServerAccountBeep', 2, (args, next) => {
        next(args);
        if (Player) BeepRawHandler(Player, args[0]);
    });

    mod.hookFunction('DialogInventoryBuild', 1, (args, next) => {
        next(args);
        DialogInventoryBuildHandler(args[0] as Character, args[2] as boolean);
    });

    DataManager.init(mod, `${ModName} v${ModVersion} loaded.`);

    CtrlHook(mod);

    RegisterActivities(mod);

    ChatRoomWork.init(mod);

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

    window.BCWorlGirl_Loaded = true;
    console.log(`${ModName} v${ModVersion} loaded.`);
})()