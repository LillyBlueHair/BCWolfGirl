import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { ActivityInfo, ActivityFacility } from "bc-utilities";
import { CanSwitchWGItem, WolfGirlItemsSwitch } from "./WolfGirlItemsSwitch";
import { InjectingExtend, InjectedExtend } from "./InjectionExtend";
import { DrinkExtend } from "./DrinkExtend";

export class ActivityProvider {
    private facility: ActivityFacility<CustomActivities, CustomPrerequisites>;

    readonly injector: InjectingExtend;

    constructor(mod: ModSDKModAPI) {
        this.injector = new InjectingExtend;

        this.facility = new ActivityFacility(mod);
        this.facility.addPrerequisite(new CanSwitchWGItem);
        this.facility.addActivity(new WolfGirlItemsSwitch);
        this.facility.addActivityExtension(this.injector);
        this.facility.addActivityExtension(new InjectedExtend);
        this.facility.addActivityExtension(new DrinkExtend);
    }

    static init(mod: ModSDKModAPI) {
        this._instance = new ActivityProvider(mod);
    }

    static run(player: PlayerCharacter, sender: Character, info: ActivityInfo) {
        this._instance?.facility.run(player, sender, info);
    }

    private static _instance: ActivityProvider;
    static get instance(): ActivityProvider {
        return this._instance;
    }
}