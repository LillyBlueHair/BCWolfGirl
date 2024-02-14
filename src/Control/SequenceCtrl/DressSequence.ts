import { DataManager } from "../../Data";
import { EILNetwork } from "../../Network";
import { ChatRoomAction } from "../../bc-utilities/ChatMessages";
import { CheckWork, CommonWork, DelayWork } from "../CommonWork";
import { IMessage, ParseMessage } from "../Message";
import { MessageWork, WaitResponseWork } from "../MessageWork";
import { CheckItem, OutfitItemType, OutfitItemsMap, ToolsCrate, ToolsInjector, ToolsVisor } from "../OutfitCtrl";
import { ClothRemoveWork, ClothRestoreWork, ItemLockWork, ItemOptionWork, ItemPropertyWork, ItemRemoveWork, ItemWearWork } from "../OutfitCtrl";
import { OutfitFixWorkResult, OutfitFixWork } from "../OutfitCtrl/OutfitFixWork";
import { IsFullyDressed } from "../WolfGirlCtrl/Check";
import { TimedWork, TimedWorker } from "../Worker";
import { StdMissingAction } from "./ItemCmdSequence/CmdSequenceMessage";

export function DressSequence(net: EILNetwork, player: Character, target: Character) {
    const clothing_stash: Item[] = [];
    const craft = net.craft;
    const work_sequence: TimedWork[] = [
        new CheckWork((player) => {
            return IsFullyDressed(target) ? CheckWork.Stop : CheckWork.Continue;
        }, (pl, result) => {
            if (result.passed) return StdMissingAction;
        }),
        new MessageWork("chat-action", "已选定目标，检测到植入狼女身份芯片，正在打开远程设备连接"),
        new DelayWork(5000),
        new MessageWork("chat-action", "远程连接已激活，正在部署便携狼女训练设施维护舱"),
        new MessageWork("action", "{player}的眼镜侧面打开一个小小的隔板，一枚辅助定位信标从中飘出，很快悬停在了{target}身后", target),
        new DelayWork(5000),
        new MessageWork("action", "空间似乎有些小小的涟漪，而随着一阵小小的气旋，一个充满了精妙器械的复杂维护舱出现在了{target}身后，从中伸出几只机械臂将她拉入了维护舱", target),
        new ItemWearWork([ToolsCrate], target, craft),
        new DelayWork(5000),
        new MessageWork("chat-action", "已检测到目标，维护舱室已进行拘束并锁定。正在扫描体型并收集数据"),
        new ItemOptionWork(target, [{ target: ToolsCrate.Asset.Group, option: { "w": 1, "l": 2, "a": 1, "d": 0, "t": 0, "h": 4 } }]),
        new DelayWork(5000),
        new MessageWork("action", "已确认训练师为{player}，确认训练套件安装目标为{target}", target),
        new MessageWork("chat-action", "身体信息收集完毕，开始安装训练组件"),
        new MessageWork("chat-action", "正在清除衣物，请闭眼并屏住呼吸"),
        new DelayWork(5000),
        new MessageWork("action", "装备舱室上方伸出一个机械臂，环绕着{target}的身体喷洒着溶解剂，很快，{target}的衣服就一点点溶化，被溶解的衣物顺着身体向下流淌到了维护舱底部被排出", target),
        new ClothRemoveWork(target, clothing_stash),
        new DelayWork(5000),
        new MessageWork("chat-action", "已确认衣物清理完毕"),
        new MessageWork("action", "维护舱室上下各伸出数个机械臂，从舱室固定系统中接过{target}的四肢，强硬的伸展开", target),
        new ItemOptionWork(target, [{ target: ToolsCrate.Asset.Group, option: { "w": 1, "l": 3, "a": 3, "d": 0, "t": 0, "h": 4 } }]),
        new DelayWork(5000),
        new MessageWork("chat-action", "{target}，请问你是否愿意接受训练成为一位狼女？请使用愿意与不愿意回答，而若愿意，这意味着你将失去足够多，但仍能保有少部分自主，亦或者对你而言，这意味着得到与拥有？", target),
        new MessageWork("chat-action", "请回答愿意或者不愿意，当然，沉默拒绝回答也是可选项之一"),
        new WaitResponseWork(target, {
            accept: /([^不]|^)愿意/g,
            accept_msg: { mode: "chat-action", msg: "意愿已确认，正在继续安装流程" },
            reject: /不愿意/g,
            reject_msg: { mode: "action", msg: "而无论回答如何，维护舱终究仍在在忠实的执行程序，继续着安装进程" }
        }, 15 * 1000, (player, target) => {
            ParseMessage({ mode: "action", msg: "回复等待已超时，视作默认，正在进行下个安装流程" }, { player, target });
        }),
        new DelayWork(5000),
        new MessageWork("action", "在机械臂的辅助下，数个精巧的铐环被安装到了{target}身上，小小的机械锁定声响虽然微弱，但却清晰可辨", target),
        ...['ItemArms', 'ItemFeet', 'ItemLegs'].map(e => new ItemWearWork([e], target, craft)),
        new DelayWork(5000),
        new MessageWork("chat-action", "拘束自检中"),
        new DelayWork(5000),
        new MessageWork("action", "{target}身上的铐环随着一阵轻微的震动，亮起一个小小的锁定图标", target),
        new ItemLockWork(['ItemArms', 'ItemFeet', 'ItemLegs'], target),
        new MessageWork("chat-action", "已确认安装到位并锁定"),
        new DelayWork(5000),
        new MessageWork("action", "两个更为精巧的机械臂从两侧伸出，轻轻捏住{target}的乳头", target),
        new MessageWork("action", "似乎只是一阵冰凉的触感，随即而来的紧束感与拉力让{target}知道乳头上也已经被安装了道具", target),
        new ItemWearWork(['ItemNipplesPiercings', 'ItemNipples'], target, craft),
        new MessageWork("chat-action", "已确认组件安装到位"),
        new DelayWork(5000),
        new MessageWork("action", "机械臂放开了{target}的乳头，一点点向下，停在了{target}的小腹，机械臂轻轻分开阴唇与包皮，暴露出稚嫩的阴蒂", target),
        new MessageWork("action", "阴蒂上的紧束感带来的快感显然要更为明显，而与此同时小穴与后穴中突然袭击的充盈感带来的愉悦与之相衬，令{target}的身体不自觉的在维护舱的拘束中微微扭动", target),
        new ItemWearWork(['ItemVulvaPiercings', 'ItemVulva', 'ItemButt'], target, craft),
        new MessageWork("chat-action", "拘束自检中"),
        new DelayWork(5000),
        new MessageWork("action", "一阵小小的震动为{target}带去些微微不足道的快感，锁定完成的滴声随即响起，这意味着什么呢？", target),
        new ItemLockWork(['ItemVulvaPiercings', 'ItemVulva', 'ItemButt', 'ItemNipplesPiercings'], target),
        new MessageWork("chat-action", "已确认安装到位并锁定"),
        new MessageWork("action", "如同托尼斯塔克在纽约的大楼外的自动维护廊道一般，机械臂们前后举起了数个似乎是战甲一样的装具，装具们早已有过预热，希望并不会为{target}带来寒意，也许吧？", target),
        new MessageWork("action", "胸部，躯干，胯部，温暖的包覆伴随着机械组合动作的细微震动，似乎只是一套极为贴身且足够舒适的内衣被采用这样的方式穿上了身体", target),
        new ItemWearWork(['ItemBreast', 'ItemPelvis', 'ItemTorso', 'ItemTorso2'], target, craft),
        new DelayWork(5000),
        new MessageWork("chat-action", "拘束自检中"),
        new DelayWork(5000),
        new MessageWork("action", "滴声再次响起，{target}身上显示着的锁定图标增加了一些，在宣告着失去，还是在宣告着拥有？", target),
        new ItemLockWork(['ItemBreast', 'ItemPelvis', 'ItemTorso', 'ItemTorso2'], target),
        new MessageWork("chat-action", "已确认安装到位并锁定"),
        new DelayWork(5000),
        new MessageWork("action", "一个连接着数个精巧装置的桶型结构缓缓下降，罩住了{target}的脑袋，短暂的强光与爆鸣令{target}闭上了双眼", target),
        new ItemWearWork(['ItemEars', 'ItemHead'], target, craft),
        new MessageWork("action", "短暂的恍惚与眩晕结束后，{target}并没有太多时间察觉眼前与耳边新增的设备，因为机械爪温柔的捏住了她的鼻子，强迫着她张嘴呼吸", target),
        new MessageWork("action", "但是显然这是维护舱的阴谋，因为很快一个口球就被塞入了她的口中，而口套与附件也随之而来", target),
        new ItemWearWork(['ItemMouth', 'ItemMouth2', 'ItemMouth3'], target, craft),
        new DelayWork(5000),
        new ItemPropertyWork(target, [{ group: 'ItemMouth2', property: { OverridePriority: 1 } }, { group: 'ItemMouth3', property: { OverridePriority: 1 } }]),
        new MessageWork("action", "口套的拟态伪装很快启动，完全暴露出{target}的脸与口中紧咬着的口球", target),
        new DelayWork(5000),
        new MessageWork("chat-action", "拘束自检中"),
        new DelayWork(5000),
        new ItemLockWork(['ItemEars', 'ItemHead', 'ItemMouth', 'ItemMouth2', 'ItemMouth3'], target),
        new MessageWork("action", "口球前方的空中亮起了一个锁定图标，不过很可惜，它是无法被遮挡的全息投影", target),
        new ItemPropertyWork(target, [{ group: 'ItemMouth3', property: { OverridePriority: { "Straps": 1, "Nose": 1, "Mask": 1, "IconLock": 42, "IconMute": 1, "IconX": 1 } } }]),
        new ItemOptionWork(target, [{ target: 'ItemMouth3', option: { "n": 0, "h": 0, "s": 1 } }]),
        new MessageWork("chat-action", "已确认安装到位并锁定"),
        new DelayWork(5000),
        new MessageWork("action", "抓着{target}四肢的机械臂微微将她的身体提起，先前安装的铐环此刻似乎启动了某种工作模式，令{target}的手脚短暂的失去了力量", target),
        new ItemWearWork(['ItemHands', 'ItemBoots'], target, craft),
        new MessageWork("action", "趁着{target}手脚自然舒展的时候，数个机械臂灵巧的将手套与高跟鞋套在了她的身上，精心调整着位置以保证穿戴的舒适", target),
        new DelayWork(5000),
        new MessageWork("chat-action", "拘束自检中"),
        new DelayWork(5000),
        new MessageWork("action", "随着手腕与脚腕处传来的些微紧束感，{target}似乎成功得以控制手脚，温暖的包覆感与朦胧的触觉终会习惯的，不是吗？", target),
        new ItemLockWork(['ItemHands', 'ItemBoots'], target),
        new MessageWork("chat-action", "已确认安装到位并锁定"),
        new DelayWork(5000),
        new MessageWork("chat-action", "即将安装控制核心与名牌，提前预祝{target}成为优秀狼女", target),
        new DelayWork(5000),
        new MessageWork("action", "精巧的项圈很快搭上了{target}的脖颈，随即缓缓开始收紧，直到项圈微微有些嵌入脖颈，虽然如此，但项圈的紧固丝毫不影响呼吸的顺畅与血液的流动", target),
        new ItemWearWork(['ItemNeck'], target, craft),
        new DelayWork(5000),
        new MessageWork("action", "而最后一个机械臂一点点靠近了{target}，上面晃荡着的名牌以一串数字指代着{target}的名字，也许这会是我们最后一次使用这个名字称呼她了", target),
        new ItemWearWork(['ItemNeckAccessories'], target, craft),
        new ItemPropertyWork(target, [{ group: 'ItemNeckAccessories', property: { Text: target.MemberNumber.toString() } }]),
        new MessageWork("chat-action", "控制核心自检中"),
        new DelayWork(5000),
        new ItemLockWork(['ItemNeck', 'ItemNeckAccessories'], target),
        new MessageWork("chat-action", "已确认安装到位并锁定，且与各部件成功建立连接"),
        new DelayWork(5000),
        new MessageWork("chat-action", "依据设置，正在重建{target_wg}服装", target),
        new ClothRestoreWork(target, clothing_stash),
        new DelayWork(5000),
        new MessageWork("chat-action", "训练师{player}，{target_wg}已安装完训练套件，套件初始化完毕，祝您玩的开心", target),
        new ItemOptionWork(target, [{ target: ToolsCrate.Asset.Group, option: { "w": 1, "l": 0, "a": 0, "d": 0, "t": 0, "h": 0 } }]),
        new ItemOptionWork(target, [
            { target: 'ItemArms', option: { typed: 1 } },
            { target: 'ItemFeet', option: { typed: 2 }, },
            { target: 'ItemLegs', option: { typed: 2 } },
            { target: 'ItemHands', option: { typed: 0 } }
        ]),
        new DelayWork(5000),
        new MessageWork("action", "维护舱仓门打开，机械臂将{target_wg}推出，随后开始渐渐变得扭曲，透明，而{target_wg}身后小小的辅助定位信标则自动回到了训练师{player}的狼女训练师多用途辅助眼镜中", target),
        new ItemRemoveWork(target, [ToolsCrate]),
    ];
    TimedWorker.global.push({ description: "Dress Sequence", works: work_sequence });
}

export function InitDressSequence(player: Character, target: Character) {
    if (!CheckItem(player, ToolsVisor) || !CheckItem(player, ToolsInjector)) return;

    ChatRoomAction.instance.LocalInfo(">> 正在连接Wolf Girl网络...");
    EILNetwork.force_fetch().then(net => {
        const work_sequence: TimedWork[] = [
            new MessageWork("local-status", "   ...已连接到Wolf Girl网络"),
            new MessageWork("local-status", ">> 权限检查开始"),
            new MessageWork("local-status", `   EIL网络管理员：${DataManager.permission.isEILNet(player) ? "通过" : "未通过"}`),
            new MessageWork("local-status", `   恋人权限：${DataManager.permission.isLover(player, target) ? "通过" : "未通过"}`),
            new MessageWork("local-status", `   主人权限：${DataManager.permission.isOwner(player, target) ? "通过" : "未通过"}`),
            new CheckWork((player) => {
                const passed = [
                    DataManager.permission.isEILNet(player),
                    DataManager.permission.isLover(player, target),
                    DataManager.permission.isOwner(player, target)
                ].some(i => i);
                if (passed) return CheckWork.Accepted;
                else return CheckWork.Rejected;
            }, (player, result) => {
                if (result.passed) return { mode: "local-status", msg: "   权限检查通过，启动安装流程" };
                else return { mode: "local-status", msg: "   指令已被拒绝，中止安装流程" };
            }),
            new CommonWork(() => {
                DressSequence(EILNetwork.Access, player, target);
            })
        ];
        TimedWorker.global.push({ description: "Init Dress Sequence", works: work_sequence });
    }).catch(e => {
        ChatRoomAction.instance.LocalInfo("...Wolf Girl 网络断开，已中止过程。");
    });
}

export function DressFixSequence(sender: Character | number, player: Character) {
    const cannot_fix: IMessage = {
        mode: "chat-action",
        msg: "发现物品 {locked_items} 被锁定物品替代，无法自动修复，停止修复过程。"
    };

    const craft = EILNetwork.Access.craft;

    let cumm_counter = 0;

    const create_result_process = (msg: IMessage) => (result: OutfitFixWorkResult) => {
        if (result.ret === "canfix" && result.counter) { cumm_counter += result.counter; return msg; }
        else if (result.ret === "blocked") return cannot_fix;
    };

    const work_sequence: TimedWork[] = [
        new CheckWork(() => {
            if (CheckItem(player, OutfitItemsMap.get('ItemNeck') as OutfitItemType)) return CheckWork.Accepted;
            return CheckWork.Rejected;
        }, (pl, result) => {
            if (!result.passed) return { mode: "chat-action", msg: "警告，中央控制核心丢失，请前往EIL或寻找EIL人员进行处理" };
        }),
        new MessageWork("chat-action", "已收到指令，维护模式已开启"),
        new MessageWork("chat-action", "远程连接已激活，正在部署便携狼女训练设施维护舱"),
        new DelayWork(5000),
        new MessageWork("chat-action", "空间似乎有些小小的涟漪，而随着一阵小小的气旋，一个充满了精妙器械的复杂维护舱出现在了{player_wg}身后，从中伸出几只机械臂将她拉入了维护舱"),
        new ItemWearWork([ToolsCrate], player, craft),
        new DelayWork(5000),
        new MessageWork("chat-action", "已检测到目标，维护舱室已进行拘束并锁定。正在扫描"),
        new ItemOptionWork(player, [{ target: ToolsCrate.Asset.Group, option: { "w": 1, "l": 2, "a": 2, "d": 0, "t": 0, "h": 4 } }]),
        new CheckWork(() => {
            if (IsFullyDressed(player)) return CheckWork.Stop;
            else return CheckWork.Continue;
        }, (pl, r) => {
            if (r.passed) return { mode: "chat-action", msg: "组件扫描完成，全部在线且运转正常，能源核心已充能完毕，维护模式已结束，请退出维护模式" };
            else return { mode: "chat-action", msg: "组件扫描完成，发现部分组件缺失或离线，进入修复模式" };
        }),
        new MessageWork("chat-action", "维护舱很快伸出了几个机械臂，在{player_wg}身前上下扫描着，淡蓝色的光束照射在她身上，似乎能够看透一切"),
        new OutfitFixWork(sender, [
            { target: "ItemEars" },
            { target: "ItemHead" },
            { target: "ItemMouth" },
            { target: "ItemMouth2", property: { OverridePriority: 1 } },
            {
                target: "ItemMouth3",
                option: { "n": 0, "h": 0, "s": 1 },
                property: { OverridePriority: { "Straps": 1, "Nose": 1, "Mask": 1, "IconLock": 42, "IconMute": 1, "IconX": 1 } }
            }
        ],
            create_result_process({
                mode: "chat-action",
                msg: "也许{player_wg}想要获得一些渴求，简单的视听能幻想这一切都没有发生，而进食人类的食物更能给予大脑错觉？亦或者是因为身体的封锁而想要用你的舌你的口进行一些淫亵的满足？究竟是命运无法撼动，还是你早已忘却了是何时为自己做下了选择？"
            })),
        new OutfitFixWork(sender, ['ItemBreast', 'ItemNipplesPiercings', 'ItemNipples'], create_result_process({
            mode: "action",
            msg: "丰满的乳房的确引人注目，但是随意暴露出这已经不属于你的资产是否有些僭越？维护舱将用一个小小的电击器分别电击了下{player_wg}的两侧乳头，随后重新开始了安装组件"
        })),
        new OutfitFixWork(sender, ['ItemHands',
            { target: 'ItemArms', option: { typed: 1 } }], create_result_process({
                mode: "action",
                msg: "似乎{player_wg}弄丢了她的手环和手套，看起来是想要做一些什么大幅度动作的样子，是尝试一些淫靡的行动？也许只是单纯的想要感受触摸？不过维护舱并没有在意她的目的是什么，只是忠实的执行着指令，将一套全新的设备安装回了{player_wg}身上"
            })),
        new OutfitFixWork(sender, [{ target: 'ItemTorso' }, { target: 'ItemTorso2' }, { target: 'ItemNeckAccessories', property: { Text: player.MemberNumber.toString() } }], create_result_process({
            mode: "chat-action",
            msg: "外部通讯束带模块与药剂注射模块或身份标签异常，的确这几个模块十分容易出现损坏或者缺失，正在修复，但请注意，维修费用并不会因此而有任何折扣"
        })),
        new OutfitFixWork(sender, ['ItemVulva', 'ItemPelvis', 'ItemButt', 'ItemVulvaPiercings'], create_result_process({
            mode: "chat-action",
            msg: "你的身体，你的呼吸，甚至你的思想，你的灵魂，都属于你的主人，自然高潮的权利也不属于你，你所能被允许获得的快感是为了提示你的身份，而高潮的欢愉则是主人给予的赏赐，偷食禁果自然会有严厉的惩处"
        })),
        new OutfitFixWork(sender, ['ItemBoots',
            { target: 'ItemFeet', option: { typed: 2 }, },
            { target: 'ItemLegs', option: { typed: 2 } }], create_result_process({
                mode: "action",
                msg: "看起来{player_wg}的行走控制器不翼而飞，要卸下这个着实是有些难度，是想要逃脱吗？可是自成为狼女之后，保有的自由难道还不够吗？可惜的是，除非主人允许，否则无论如何都无法逃离。嗯，也许该将这个消息告知主人。维护舱轻微的电击了下{player_wg}，随后为她安装上全新的控制器}"
            })),
        new MessageWork("chat-action", "组件修复完毕，依据组件丢失情况，已扣相应奖励积分。重新扫描并自检中"),
        new CommonWork((player) => {
            DataManager.points.points -= cumm_counter;
            ParseMessage({ mode: "local", msg: `已扣除${cumm_counter}点数，当前点数${DataManager.points.points}` });
        }),
        new DelayWork(5000),
        new CheckWork(() => {
            if (IsFullyDressed(player)) return CheckWork.Stop;
            else return CheckWork.Continue;
        }, (pl, r) => {
            if (r.passed) return { mode: "chat-action", msg: "组件扫描完成，全部在线且运转正常，能源核心已充能完毕，维护模式已结束，请退出维护模式" };
            else return { mode: "chat-action", msg: "错误：组件修复失败，仍有未穿戴组件" };
        }),
    ];

    TimedWorker.global.push({ description: "DressFixSequence", works: work_sequence });
}

