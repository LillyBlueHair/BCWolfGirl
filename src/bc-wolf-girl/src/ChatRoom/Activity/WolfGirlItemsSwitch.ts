import { DataManager } from "../../Data";
import { ActivityInfo, ActivityTriggerMode, CheckOutfitItemCE, CustomBCActivity, ExtendedActivityPrerequisite, ExtendedBCActivity, IActivityCustom, IActivityPrerequisite } from "bc-utilities";
import { StartStashPopSequence } from "../../Control/SequenceCtrl/StashSequence";
import { StartStashSequence } from "../../Control/SequenceCtrl/StashSequence";
import { ModOrSelfPrerequisites } from "../Prerequistes";
import { OutfitItemsMap } from "../../Control/OutfitCtrl";

const strings: { [index: string]: string } = {
    "Label-ChatOther-ItemNeck-WolfGirlItemsSwitch": "切换狼女物品模式",
    "Label-ChatSelf-ItemNeck-WolfGirlItemsSwitch": "切换狼女物品模式",
    "Label-ChatOther-ItemPelvis-WolfGirlItemsSwitch": "切换狼女物品模式",
    "Label-ChatSelf-ItemPelvis-WolfGirlItemsSwitch": "切换狼女物品模式",

    "ChatOther-ItemNeck-WolfGirlItemsSwitch": "SourceCharacter 轻轻触碰 TargetCharacter 的项圈，微弱的提示灯光微微亮起。",
    "ChatSelf-ItemNeck-WolfGirlItemsSwitch": "SourceCharacter 轻轻触碰自己的项圈，微弱的提示灯光微微亮起。",
    "ChatOther-ItemPelvis-WolfGirlItemsSwitch": "SourceCharacter 轻轻触碰 TargetCharacter 的训练内裤，微弱的提示灯光微微亮起。",
    "ChatSelf-ItemPelvis-WolfGirlItemsSwitch": "SourceCharacter 轻轻触碰自己的训练内裤，微弱的提示灯光微微亮起。",
};

const bodyParts: AssetGroupItemName[] = ["ItemNeck", "ItemPelvis"];

export class WolfGirlItemsSwitch extends IActivityCustom<CustomActivities, CustomPrerequisites> {
    constructor() {
        super(
            "onself",
            bodyParts,
            {
                Name: "WolfGirlItemsSwitch",
                MaxProgress: 0,
                Prerequisite: ["UseHands", "CanSwitchWGItem"],
                Target: bodyParts,
                TargetSelf: bodyParts
            },
            "Assets/Female3DCG/ItemNeck/Preview/FuturisticCollar.png"
        )
    }

    on(player: PlayerCharacter, sender: Character, info: ActivityInfo): void {
        if (info.TargetCharacter === player.MemberNumber) {
            if (ModOrSelfPrerequisites(player, sender)) {
                if (DataManager.outfit.items.size > 0) {
                    StartStashPopSequence(player);
                } else {
                    StartStashSequence(player);
                }
            }
        }
    }

    adjustDict(content: string, dict: any[]): any[] {
        dict.push({
            Tag: `MISSING ACTIVITY DESCRIPTION FOR KEYWORD ${content}`,
            Text: this.text(content)
        });
        return dict;
    }

    text(keyword: string) {
        return strings[keyword] ?? keyword;
    }
}

export class CanSwitchWGItem extends IActivityPrerequisite<CustomPrerequisites> {
    name: CustomPrerequisites = "CanSwitchWGItem";
    test(acting: Character, acted: Character, group: AssetGroup): boolean {
        if (!CheckOutfitItemCE(acted, OutfitItemsMap.get(group.Name), { lock: true })) return false;
        if (acted.IsPlayer()) {
            return DataManager.points.points > 10;
        }
        return true;
    }
}