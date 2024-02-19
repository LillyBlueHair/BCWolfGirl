export function AppearanceUpdate(C: Character, Group?: string) {
    if (CurrentScreen !== 'ChatRoom') CharacterRefresh(C);
    else if (Group) ChatRoomCharacterItemUpdate(C, Group);
    else ChatRoomCharacterUpdate(C);
}

export function GatherAppMap(C: Character) {
    return new Map<string, Item>(C.Appearance.map(i => [i.Asset.Group.Name, i]));
}