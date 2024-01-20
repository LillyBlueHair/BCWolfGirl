interface EILData {
    uids: number[];
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
    }

    isEIL(uid: number): boolean {
        return this._data.uids.includes(uid);
    }

    craft(): { uid: number, name: string } {
        return this._data.craft;
    }

    static Access: () => Promise<EILNetwork> = () => {
        throw new Error('EILNetwork is not ready.');
    }

    private static last_fetched: EILNetwork | undefined = undefined;

    static init(asset_url: string) {
        EILNetwork.Access = () => {
            if (EILNetwork.last_fetched !== undefined) {
                if (Date.now() - EILNetwork.last_fetched.Time < 1000 * 60 * 10) {
                    return Promise.resolve(EILNetwork.last_fetched);
                }
            }
            return fetch(asset_url + 'EIL.json').then((res) => {
                if (!res.ok) { throw new Error('EIL.json not found.'); }
                return res.json() as Promise<EILData>;
            }).then(d => {
                const network = new EILNetwork(d);
                EILNetwork.last_fetched = network;
                EILNetwork.last_fetched.Time = Date.now();
                return network;
            });
        }
    }
}