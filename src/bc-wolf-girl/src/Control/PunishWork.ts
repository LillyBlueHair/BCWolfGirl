import { OutfitItemsMap } from "./OutfitCtrl";
import { TimedWork, TimedWorkState } from "./Worker";

function IsSimpleChat(msg: string) {
    return msg.trim().length > 0 && !msg.startsWith("/") && !msg.startsWith("(") && !msg.startsWith("*");
}

function ChatRoomInterceptMessage(cur_msg: string, msg: string) {
    if (!cur_msg) return;
    ElementValue("InputChat", cur_msg + "... " + msg);
    ChatRoomSendChat();
}

export function DoSinglePunish(player: PlayerCharacter, item: Item | undefined) {
    if (CurrentCharacter !== null)
        CurrentCharacter.FocusGroup = null;
    CurrentCharacter = null;
    if (CurrentScreen === 'Preference')
        CommonSetScreen("Character", "InformationSheet");
    if (CurrentScreen === 'ChatAdmin')
        CommonSetScreen('Online', 'ChatRoom');
    if (CurrentScreen === 'InformationSheet')
        CommonSetScreen(InformationSheetPreviousModule, InformationSheetPreviousScreen);
    let msg = ElementValue("InputChat");
    if (IsSimpleChat(msg))
        ChatRoomInterceptMessage(msg, '');

    const MemberNumber = player.MemberNumber;

    if (!MemberNumber) return;

    const intensity = 2;

    const Dictionary = [
        { Tag: "DestinationCharacterName", Text: CharacterNickname(player), MemberNumber: MemberNumber },
        { Tag: "AssetName", AssetName: item?.Asset.Name, GroupName: item?.Asset.Group.Name },
        { ShockIntensity: intensity * 1.5 },
        { FocusGroupName: item?.Asset.Group.Name },
        { Automatic: true }
    ];

    if (CurrentScreen == "ChatRoom")
        ChatRoomMessage({ Content: 'TriggerShock' + intensity, Type: "Action", Sender: MemberNumber, Dictionary: Dictionary });

    InventoryShockExpression(player);
}

export class PunishWork extends TimedWork {
    private _timer: number;
    static punish_flag = false;

    constructor(timer: number) {
        super();
        this._timer = timer;
    }

    private first_run = false;
    run(player: PlayerCharacter): TimedWorkState {
        if (!this.first_run) {
            this.first_run = true;
            this._timer = Date.now() + this._timer;
        }

        if (!PunishWork.punish_flag) return TimedWorkState.finished;

        const collar = InventoryGet(player, "ItemNeck");
        if (!collar) return TimedWorkState.interrupted;

        DoSinglePunish(player, collar);

        if (Date.now() > this._timer) return TimedWorkState.finished;
        return TimedWorkState.running;
    }
}

export class RandomSinglePunishWork extends TimedWork {
    run(player: PlayerCharacter): TimedWorkState {
        const items = player.Appearance.filter(i => i.Asset.Group.Name.startsWith("Item"));
        const item = items[Math.floor(Math.random() * items.length)];
        const oi = OutfitItemsMap.get(item.Asset.Group.Name);
        if (oi) {
            DoSinglePunish(player, item);
        }
        return TimedWorkState.finished;
    }
}


export function StopPunish(player: PlayerCharacter) {
    PunishWork.punish_flag = false;
}