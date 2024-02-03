import { ModSDKModAPI } from "bondage-club-mod-sdk";

type OrgasmEvent = (player: Character) => void;

export class OrgasmMonitor {
    _OrgasmList = new Array<OrgasmEvent>;
    _ResistList = new Array<OrgasmEvent>;
    _RuinedList = new Array<OrgasmEvent>;

    constructor(mod: ModSDKModAPI, lateHook: (callback: () => void) => void) {
        mod.hookFunction('ActivityOrgasmStop', 9, (args, next) => {
            next(args);
            const C = args[0] as Character;
            const Progress = args[1] as number;

            if (Player && C.MemberNumber === Player.MemberNumber) {
                if (Progress < 25) this._OrgasmList.forEach(_ => _(C));
                else if (ActivityOrgasmRuined) this._RuinedList.forEach(_ => _(C));
                else this._ResistList.forEach(_ => _(C));
            }
        });
    }

    public AddOrgasmEvent(event: OrgasmEvent) {
        this._OrgasmList.push(event);
    }
    public AddResistEvent(event: OrgasmEvent) {
        this._ResistList.push(event);
    }
    public AddRuinedEvent(event: OrgasmEvent) {
        this._RuinedList.push(event);
    }
}