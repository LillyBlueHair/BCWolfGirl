import { DataManager } from "../../Data";
import { ActivityInfo, ActivityTriggerMode, CheckOutfitItemCE, CustomBCActivity, ExtendedActivityPrerequisite, ExtendedBCActivity, IActivityCustom, IActivityPrerequisite } from "bc-utilities";
import { StartStashPopSequence } from "../../Control/SequenceCtrl/StashSequence";
import { StartStashSequence } from "../../Control/SequenceCtrl/StashSequence";
import { ModOrSelfPrerequisites } from "../Prerequistes";
import { OutfitItemsMap } from "../../Control/OutfitCtrl";

const strings: { [index: string]: string } = {
    "Label-ChatOther-ItemNeck-WolfGirlItemsSwitch": "Toggle-Wolf-Girl-Item-Mode",
    "Label-ChatSelf-ItemNeck-WolfGirlItemsSwitch": "Toggle-Wolf-Girl-Item-Mode",
    "Label-ChatOther-ItemPelvis-WolfGirlItemsSwitch": "Toggle-Wolf-Girl-Item-Mode",
    "Label-ChatSelf-ItemPelvis-WolfGirlItemsSwitch": "Toggle-Wolf-Girl-Item-Mode",

    "ChatOther-ItemNeck-WolfGirlItemsSwitch": "SourceCharacter gently touches TargetCharacter's collar, and a faint light turns on.",
    "ChatSelf-ItemNeck-WolfGirlItemsSwitch": "SourceCharacter gently touches her collar, and a faint light flickers on.",
    "ChatOther-ItemPelvis-WolfGirlItemsSwitch": "SourceCharacter gently touches TargetCharacter's training underwear, and a faint light turns on.",
    "ChatSelf-ItemPelvis-WolfGirlItemsSwitch": "SourceCharacter lightly touches her training underwear, and a faint light flickers on.",
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