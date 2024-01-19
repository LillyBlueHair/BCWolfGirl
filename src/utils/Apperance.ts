export function AppearanceUpdate(C: Character, Group?: string) {
    if (CurrentScreen !== 'ChatRoom') CharacterRefresh(C);
    else if (Group) ChatRoomCharacterItemUpdate(C, Group);
    else ChatRoomCharacterUpdate(C);
}