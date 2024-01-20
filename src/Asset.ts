interface EILData {
    uids: number[];
    craft: {
        uid: number;
        name: string;
    }
}

export class EILManger {
    private data: EILData | undefined;

    private static _instance: EILManger | undefined = undefined;

    static get instance(): EILManger {
        return EILManger._instance as EILManger;
    }

    static get isReady(): boolean {
        return EILManger._instance !== undefined;
    }

    static init(asset_url: string) {
        if (EILManger._instance) return;
        new EILManger(asset_url);
    }

    constructor(asset_url: string) {
        fetch(asset_url + 'EIL.json').then((res) => {
            if (!res.ok) { throw new Error('EIL.json not found.'); }
            return res.json();
        }).then((eil) => {
            this.data = eil;
            EILManger._instance = this;
        })
    }

    isEIL(uid: number) {
        return this.data?.uids.includes(uid) ?? false;
    }

    getCraft() {
        return this.data?.craft ?? undefined;
    }
}

