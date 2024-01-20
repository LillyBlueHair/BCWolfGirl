import bcMod from 'bondage-club-mod-sdk'
import { CUSTOM_ACTION_TAG, ModName, ModVersion } from './Definition';
import { BeepRawHandler, ChatRoomHandler } from './ChatRoom/Handler';
import { TimedWorker } from "./Control/Worker";
import { DialogInventoryBuildHandler } from './Control/OutfitCtrl';
import { ChatRoomAction } from './utils/ChatMessages';
import { EILNetwork } from './Network';
import { CtrlHook } from './Control/WolfGirlCtrl';

(function () {
    if (window.BCWorlGirl_Loaded) return;
    window.BCWorlGirl_Loaded = false;

    const this_script_src = document.getElementById('WolfGirlLoader')?.getAttribute('src');
    if (!this_script_src) {
        console.log('WolfGirlLoader not found.');
        return;
    }
    const asset_url = this_script_src.substring(0, this_script_src.lastIndexOf('/') + 1) + 'assets/';

    EILNetwork.init(asset_url);
    TimedWorker.init();
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
    CtrlHook(mod);

    window.BCWorlGirl_Loaded = true;
    console.log(`${ModName} v${ModVersion} loaded.`);
})()