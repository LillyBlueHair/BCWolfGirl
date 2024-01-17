import bcMod from 'bondage-club-mod-sdk'
import { ModName, ModVersion, Repository } from './Definition';

(function () {
    if (window.BCWorlGril_Loaded) return;
    window.BCWorlGril_Loaded = false;

    let mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion, repository: Repository });


    window.BCWorlGril_Loaded = true;

    console.log(`${ModName} v${ModVersion} loaded.`);
})()