export function GatherAppMap(C: Character) {
    return new Map<string, Item>(C.Appearance.map(i => [i.Asset.Group.Name, i]));
}