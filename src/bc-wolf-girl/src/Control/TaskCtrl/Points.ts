import { DataManager } from "../../Data";
import { ParseMessage } from "../Message";

export function IncreaseAndMessage(player: PlayerCharacter, points: number) {
    DataManager.points.points += points;
    ParseMessage({ mode: "chat-action", msg: `{player_wg}的奖励积分增加了${points}点。` }, { player })
}
