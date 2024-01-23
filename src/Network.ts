interface EILData {
    uids: number[];
    room: {
        name: string;
    },
    craft: {
        uid: number;
        name: string;
    }
}

export class EILNetwork {
    private _data: EILData;

    private Time: number = 0;

    constructor(data: EILData) {
        this._data = data;
        this.Time = Date.now();
    }

    isEIL(uid: number): boolean {
        return this._data.uids.includes(uid);
    }

    get craft(): { uid: number, name: string } {
        return this._data.craft;
    }

    get room(): { name: string } {
        return this._data.room;
    }

    static get Access(): EILNetwork {
        return EILNetwork._Access();
    }

    static _Access: () => EILNetwork = () => {
        throw new Error('EILNetwork is not ready.');
    }

    private static last_fetched: EILNetwork | undefined = undefined;

    static async fetch(asset_url: string): Promise<EILNetwork> {
        return fetch(asset_url + `EIL.json?t=${Date.now()}`).then((res) => {
            if (!res.ok) { throw new Error('EIL.json not found.'); }
            return res.json() as Promise<EILData>;
        }).then(d => EILNetwork.last_fetched = new EILNetwork(d));
    }

    static Wfetch: () => Promise<EILNetwork>;

    static init(asset_url: string) {
        return this.fetch(asset_url).then(d => {
            EILNetwork._Access = () => {
                if (EILNetwork.last_fetched) {
                    if (Date.now() - EILNetwork.last_fetched.Time < 60000)
                        EILNetwork.fetch(asset_url);
                }
                return EILNetwork.last_fetched as EILNetwork;
            }
            EILNetwork.Wfetch = () => EILNetwork.fetch(asset_url);
        });
    }
}