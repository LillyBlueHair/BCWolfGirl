import { CheckItem, OutfitItems } from "../Control/OutfitCtrl";
import { CheckItemRaw } from "../Control/OutfitCtrl/Utils";
import { ModName, ModVersion } from "../Definition";
import { EILNetwork } from "../Network";
import { GatherAppMap } from "../utils/Apperance";
import { ChatRoomAction } from "../utils/ChatMessages";

const WolfGirlCmds: ICommand[] = [
    {
        Tag: "wolfgirl",
        Action: ChatCmdRouter
    }
]

const CmdDetails: Map<string, (...args: string[]) => void> = new Map()

function ChatCmdRouter(args: string, command: string) {
    const [, ...parts] = command.split(" ");
    const cmd = parts?.shift();
    if (!cmd || !CmdDetails.has(cmd)) {
        ChatRoomAction.instance.LocalInfo(`指令错误，可以使用的指令：wolfgirl <${[...CmdDetails.keys()].join("|")}> <参数>`);
        return;
    }
    CmdDetails.get(cmd)?.(...parts);
}

function ChatCmdOutfitCheck(...args: string[]) {
    const targetN = parseInt(args[0]);
    if (isNaN(targetN)) {
        ChatRoomAction.instance.LocalInfo("指令错误，参数：wolfgirl check <目标ID>");
        return;
    }
    const target = ChatRoomCharacter.find(c => c.MemberNumber === targetN);
    if (!target) {
        ChatRoomAction.instance.LocalInfo("指令错误，目标不存在");
        return;
    }

    const app_map = GatherAppMap(target);
    const craft = EILNetwork.Access.craft;

    ChatRoomAction.instance.LocalInfo(`>> ${ModName} ${ModVersion} 调试模式\n`);

    OutfitItems.forEach((i, idx) => {
        const target_item = app_map.get(i.Asset.Group);
        const msglist: string[] = []

        msglist.push(`>> 检查工作 序列${idx + 1}`)
        msglist.push(`  物品: ${i.Asset.Name}`)
        msglist.push(`  位置: ${i.Asset.Group}`)
        msglist.push(`  配置：${i.Craft.Name}`)

        if (!target_item) {
            msglist.push(`  穿戴: undefined`)
            msglist.push(`  结论: 未通过`)
        } else {
            msglist.push(`  穿戴: ${target_item.Asset.Name}`)
            msglist.push(`  颜色: ${target_item.Color}`)

            const check = CheckItem(target, i, craft);
            const checkRaw = CheckItemRaw(target_item, i, craft);

            if (!check) {
                msglist.push(`  CheckItem: ${check}`)
            } else {
                msglist.push(`  CheckItem: ${check}`)
                msglist.push(`  CheckItemRaw: ${checkRaw}`)
                msglist.push(`  LockedBy: ${target_item.Property?.LockedBy}`)
                msglist.push(`  TypeRecord: ${JSON.stringify(target_item.Property?.TypeRecord)}`)
            }

            msglist.push(`  结论: ${check && checkRaw ? "通过" : "未通过"}`)
        }

        ChatRoomAction.instance.LocalInfo(msglist.join("\n") + "\n");
    })
}

export function InitChatCmds() {
    CmdDetails.set("check", ChatCmdOutfitCheck);
    CommandCombine(WolfGirlCmds);
}