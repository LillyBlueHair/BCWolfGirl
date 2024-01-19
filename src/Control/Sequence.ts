import { OutfitItems } from "../OutfitCtrl/Definition";
import { ItemWearWork } from "../OutfitCtrl/OutfitWork";
import { OutfitWorker } from "../OutfitCtrl/OutfitWorker";

export function InitDressSequence(player: Character, target: Character) {
    OutfitItems.forEach(e => OutfitWorker.global.push(new ItemWearWork([e], target.MemberNumber)));
}