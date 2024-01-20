import bcMod from 'bondage-club-mod-sdk'
import { CUSTOM_ACTION_TAG, ModName, ModVersion } from './Definition';
import { ChatRoomChatRawHandler } from './ChatRoom/Handler';
import { TimedWorker } from "./Control/Worker";
import { EILManger } from './Asset';
import { DialogInventoryBuildHandler } from './Control/OutfitCtrl/Inventory';
import { ChatRoomAction } from './utils/ChatMessages';

(function () {
    if (window.BCWorlGirl_Loaded) return;
    window.BCWorlGirl_Loaded = false;

    const this_script_src = document.getElementById('WolfGirlLoader')?.getAttribute('src');
    if (!this_script_src) {
        console.log('WolfGirlLoader not found.');
        return;
    }
    const asset_url = this_script_src.substring(0, this_script_src.lastIndexOf('/') + 1) + 'assets/';

    EILManger.init(asset_url);
    TimedWorker.init();
    ChatRoomAction.init(CUSTOM_ACTION_TAG);

    const mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion });
    mod.hookFunction('ChatRoomMessage', 10, (args, next) => {
        next(args);
        if (Player) ChatRoomChatRawHandler(Player, args[0]);
    });

    mod.hookFunction('DialogInventoryBuild', 1, (args, next) => {
        next(args);
        DialogInventoryBuildHandler(args[0] as Character, args[2] as boolean);
    });

    window.BCWorlGirl_Loaded = true;
    console.log(`${ModName} v${ModVersion} loaded.`);
})()