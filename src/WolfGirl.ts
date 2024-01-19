import bcMod from 'bondage-club-mod-sdk'
import { ModName, ModVersion } from './Definition';
import { ChatRoomChatRawHandler } from './ChatRoom/Handler';
import { OutfitWorker } from './OutfitCtrl/OutfitWorker';

(function () {
    if (window.BCWorlGirl_Loaded) return;
    window.BCWorlGirl_Loaded = false;

    const this_script_src = document.getElementById('WolfGirlLoader')?.getAttribute('src');
    if (!this_script_src) {
        console.log('WolfGirlLoader not found.');
        return;
    }
    const asset_url = this_script_src.substring(0, this_script_src.lastIndexOf('/') + 1) + 'assets/';


    const mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion });

    mod.hookFunction('ChatRoomMessage', 10, (args, next) => {
        next(args);
        if (Player) ChatRoomChatRawHandler(Player, args[0]);
    });

    OutfitWorker.global = new OutfitWorker(1000);

    window.BCWorlGirl_Loaded = true;

    console.log(`${ModName} v${ModVersion} loaded.`);
})()