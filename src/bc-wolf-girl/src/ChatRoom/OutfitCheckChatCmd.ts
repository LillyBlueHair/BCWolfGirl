import { OutfitItems } from "../Control/OutfitCtrl";
import { DefaultCheckItemOnTarget, DefaultCheckOutfitItem } from "../Control/OutfitCtrl/Utils";
import { ModName, ModVersion } from "../Definition";
import { EILNetwork } from "../Network";
import { GatherAppMap } from "../utils/Apperance";
import { ChatRoomAction } from "bc-utilities";

const CmdDetails: Map<string, (...args: string[]) => void> = new Map([["check", ChatCmdOutfitCheck]])

const WolfGirlCmds: ICommand[] = [
    {
        Tag: "wolfgirl",
        Description: `<${[...CmdDetails.keys()].join("|")}> <Parameters> : WolfGirl Mod Commands`,
        Action: ChatCmdRouter
    }
]

function ChatCmdRouter(args: string, command: string) {
    const [, ...parts] = command.split(" ");
    const cmd = parts?.shift();
    if (!cmd || !CmdDetails.has(cmd)) {
        ChatRoomAction.instance.LocalInfo(`Command error, you can use the command: wolfgirl<${[...CmdDetails.keys()].join("|")}> <parameter>`);
        return;
    }
    CmdDetails.get(cmd)?.(...parts);
}

function ChatCmdOutfitCheck(...args: string[]) { //TODO 
    const targetN = parseInt(args[0]);
    if (isNaN(targetN)) {
        ChatRoomAction.instance.LocalInfo("Command error: Usage: wolfgirl check <target ID>");
        return;
    }
    const target = ChatRoomCharacter.find(c => c.MemberNumber === targetN);
    if (!target) {
        ChatRoomAction.instance.LocalInfo("Command error: Target not found");
        return;
    }

    const app_map = GatherAppMap(target);
    const craft = EILNetwork.Access.craft;

    ChatRoomAction.instance.LocalInfo(`>> ${ModName} ${ModVersion} Debug Mode\n`);

    OutfitItems.forEach((i, idx) => {
        const target_item = app_map.get(i.Asset.Group);
        const msglist: string[] = []

        msglist.push(`>> Check work sequence${idx + 1}`)
        msglist.push(`  item: ${i.Asset.Name}`)
        msglist.push(`  position: ${i.Asset.Group}`)
        msglist.push(`  configuration：${i.Craft.Name}`)

        if (!target_item) {
            msglist.push(`  wearing: undefined`)
            msglist.push(`  concluding: failed`)
        } else {
            msglist.push(`  wearing: ${target_item.Asset.Name}`)
            msglist.push(`  color: ${target_item.Color}`)

            const check = DefaultCheckItemOnTarget(target, i);
            const checkRaw = DefaultCheckOutfitItem(target_item, i);

            if (!check) {
                msglist.push(`  CheckItemOnTarget: ${check}`)
            } else {
                msglist.push(`  CheckItemOnTarget: ${check}`)
                msglist.push(`  CheckOutfitItem: ${checkRaw}`)
                msglist.push(`  LockedBy: ${target_item.Property?.LockedBy}`)
                msglist.push(`  TypeRecord: ${JSON.stringify(target_item.Property?.TypeRecord)}`)
            }

            msglist.push(`  concluding: ${check && checkRaw ? "passed" : "failed"}`)
        }

        ChatRoomAction.instance.LocalInfo(msglist.join("\n") + "\n");
    })
}

export function InitChatCmds(lateHook: (callback: () => void) => void) {
    lateHook(() => CommandCombine(WolfGirlCmds))
}