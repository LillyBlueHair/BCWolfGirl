import { DataManager } from "../Data";
import { AppearanceUpdate } from "../utils/Apperance";
import { CommonWork } from "./CommonWork";
import { MessageWork } from "./MessageWork";
import { ItemOptionWork, OutfitItemsMap } from "./OutfitCtrl";
import { GatherDataOutfitItem } from "./StashOutfit";
import { TimedWork, TimedWorkState, TimedWorker } from "./Worker";

function IsSimpleChat(msg: string) {
    return msg.trim().length > 0 && !msg.startsWith("/") && !msg.startsWith("(") && !msg.startsWith("*");
}

function ChatRoomInterceptMessage(cur_msg: string, msg: string) {
    if (!cur_msg) return;
    ElementValue("InputChat", cur_msg + "... " + msg);
    ChatRoomSendChat();
}

class PunishWork extends TimedWork {
    private _timer: number;

    constructor(timer: number) {
        super();
        this._timer = timer;
    }

    private first_run = false;
    run(player: Character): TimedWorkState {
        if (!this.first_run) {
            this.first_run = true;
            this._timer = Date.now() + this._timer;
        }

        const collar = InventoryGet(player, "ItemNeck");
        if (!collar) return TimedWorkState.interrupted;

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
        const intensity = 2;

        const Dictionary = [
            { Tag: "DestinationCharacterName", Text: CharacterNickname(player), MemberNumber: MemberNumber },
            { Tag: "AssetName", AssetName: collar.Asset.Name, GroupName: collar.Asset.Group.Name },
            { ShockIntensity: intensity * 1.5 },
            { FocusGroupName: collar.Asset.Group.Name },
        ];

        if (CurrentScreen == "ChatRoom")
            ChatRoomMessage({ Content: 'TriggerShock' + intensity, Type: "Action", Sender: player.MemberNumber, Dictionary: Dictionary });

        InventoryShockExpression(player);

        if (Date.now() > this._timer) return TimedWorkState.finished;
        return TimedWorkState.running;
    }
}


export function StartPunish(player: Character) {
    const time = DataManager.points.punish_time;

    const lock_down = [
        { target: "ItemEars", option: { typed: 3 } },
        { target: 'ItemEyes', option: { typed: 3 } },
        { target: 'ItemArms', option: { typed: 3 } },
        { target: 'ItemHands', option: { typed: 0 } },
        { target: 'ItemFeet', option: { typed: 1 } },
        { target: 'ItemLegs', option: { typed: 1 } }
    ]

    const stash = new Map<string, TypeRecord | null>(lock_down.map(
        i => [i.target, null]
    ));

    const works = [
        new CommonWork((player) => {
            player.Appearance.forEach(item => {
                if (stash.has(item.Asset.Group.Name) && item.Property?.TypeRecord)
                    stash.set(item.Asset.Group.Name, Object.assign({}, item.Property.TypeRecord));
            });
            lock_down.forEach(i => ItemOptionWork.ItemOptionSingleS(player, i));
        }),
        new MessageWork("action", `惩罚模式启动，持续时间预计${(time / 60 / 1000).toFixed(2)}分钟`),
        new PunishWork(time),
        new CommonWork((player) => {
            player.Appearance.forEach(item => {
                const record = stash.get(item.Asset.Group.Name);
                if (record) ExtendedItemSetOptionByRecord(player, item, record);
            });
            AppearanceUpdate(player);
        }),
    ];

    TimedWorker.global.push({ description: "punish work", works: works });
}

export function StopPunish(player: Character) {
    TimedWorker.global.skip_until(t => t.description === "punish work" && t.works.length > 1 && t.works.length < 4);
}