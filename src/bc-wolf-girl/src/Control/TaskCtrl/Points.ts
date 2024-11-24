import { DataManager } from "../../Data";
import { ParseMessage } from "../Message";

export function IncreaseAndMessage(player: PlayerCharacter, points: number) {
    DataManager.points.points += points;
    ParseMessage({ mode: "chat-action", msg: `{player_wg}'s bonus points increased by ${points} points.` }, { player })
}
