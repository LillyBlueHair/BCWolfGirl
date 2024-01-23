import { DataManager } from "../../Data";
import { ParseMessage } from "../Message";

export function IncreaseAndMessage(player: Character, points: number) {
    DataManager.points.points += points;
    ParseMessage({ mode: "chat-action", msg: `{player_wg}的奖励点数增加了${points}点。` }, { player })
}
