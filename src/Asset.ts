export class EILManger {
    private members: number[] = []

    fetch(asset_url: string) {
        fetch(asset_url + 'EIL.json').then((res) => {
            if (!res.ok) { throw new Error('EIL.json not found.'); }
            return res.json();
        }).then((eil) => {
            this.members = JSON.parse(eil)["uids"];
        })
    }

    isEIL(uid: number) {
        return this.members.includes(uid);
    }
}

