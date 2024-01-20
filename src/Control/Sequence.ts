import { EILNetwork } from "../Network";
import { ChatRoomAction } from "../utils/ChatMessages";
import { CheckWork, DelayWork } from "./CommonWork";
import { MessageWork } from "./MessageWork";
import { ToolsCrate, ToolsInjector, ToolsVisor } from "./OutfitCtrl";
import { ClothRemoveWork, ClothRestoreWork, ItemLockWork, ItemOptionWork, ItemPropertyWork, ItemRemoveWork, ItemWearWork } from "./OutfitCtrl";
import { CheckItem } from "./OutfitCtrl";
import { TimedWork, TimedWorker } from "./Worker";

function DressSequence(net: EILNetwork, player: Character, target: Character) {
    const clothing_stash: Item[] = [];
    TimedWorker.global.pause();
    const work_sequence: TimedWork[] = [
        new CheckWork(() => {
            if (net.isEIL(player.MemberNumber)) return true;
            if (target.Ownership && target.Ownership.MemberNumber === player.MemberNumber) return true;
            if (target.Lovership && target.Lovership.some(e => e.MemberNumber === player.MemberNumber)) return true;
            return false;
        }, {
            mode: "local",
            passed: "<INFO> 授权请求成功。",
            failed: "<ERROR> 授权失败，已中止过程。"
        }),
        new MessageWork("chat-action", "已选定目标，检测到植入狼女身份芯片，正在打开远程设备连接"),
        new DelayWork(5),
        new MessageWork("chat-action", "远程连接已激活，正在部署便携狼女训练设施维护舱"),
        new MessageWork("action", "{player}的眼镜侧面打开一个小小的隔板，一枚辅助定位信标从中飘出，很快悬停在了{target}身后", target),
        new DelayWork(5),
        new MessageWork("action", "空间似乎有些小小的涟漪，而随着一阵小小的气旋，一个充满了精妙器械的复杂维护舱出现在了{target}身后，从中伸出几只机械臂将她拉入了维护舱", target),
        new ItemWearWork([ToolsCrate], target),
        new DelayWork(5),
        new MessageWork("chat-action", "已检测到目标，维护舱室已进行拘束并锁定。正在扫描体型并收集数据"),
        new ItemOptionWork(target, [{ group: ToolsCrate.Asset.Group, option: { "w": 1, "l": 2, "a": 1, "d": 0, "t": 0, "h": 4 } }]),
        new DelayWork(5),
        new MessageWork("action", "已确认训练师为{player}，确认训练套件安装目标为{target}", target),
        new MessageWork("chat-action", "身体信息收集完毕，开始安装训练组件"),
        new MessageWork("chat-action", "正在清除衣物，请闭眼并屏住呼吸"),
        new ClothRemoveWork(target, clothing_stash),
        new DelayWork(5),
        new MessageWork("action", "装备舱室上方伸出一个机械臂，环绕着{target}的身体喷洒着溶解剂，很快，{target}的衣服就一点点溶化，被溶解的衣物顺着身体向下流淌到了维护舱底部被排出", target),
        new DelayWork(5),
        new MessageWork("chat-action", "已确认衣物清理完毕"),
        new MessageWork("action", "维护舱室上下各伸出数个机械臂，从舱室固定系统中接过{target}的四肢，强硬的伸展开", target),
        new ItemOptionWork(target, [{ group: ToolsCrate.Asset.Group, option: { "w": 1, "l": 3, "a": 3, "d": 0, "t": 0, "h": 4 } }]),
        new DelayWork(5),
        new MessageWork("action", "在机械臂的辅助下，数个精巧的铐环被安装到了{target}身上，小小的机械锁定声响虽然微弱，但却清晰可辨", target),
        ...['ItemArms', 'ItemFeet', 'ItemLegs'].map(e => new ItemWearWork([e], target)),
        new DelayWork(5),
        new MessageWork("chat-action", "拘束自检中"),
        new DelayWork(5),
        new MessageWork("action", "{target}身上的铐环随着一阵轻微的震动，亮起一个小小的锁定图标", target),
        new ItemLockWork(['ItemArms', 'ItemFeet', 'ItemLegs'], target),
        new MessageWork("chat-action", "已确认安装到位并锁定"),
        new DelayWork(5),
        new MessageWork("action", "两个更为精巧的机械臂从两侧伸出，轻轻捏住{target}的乳头", target),
        new MessageWork("action", "似乎只是一阵冰凉的触感，随即而来的紧束感与拉力让{target}知道乳头上也已经被安装了道具", target),
        new ItemWearWork(['ItemNipplesPiercings', 'ItemNipples'], target),
        new MessageWork("chat-action", "已确认组件安装到位"),
        new DelayWork(5),
        new MessageWork("action", "机械臂放开了{target}的乳头，一点点向下，停在了{target}的小腹，机械臂轻轻分开阴唇与包皮，暴露出稚嫩的阴蒂", target),
        new MessageWork("action", "阴蒂上的紧束感带来的快感显然要更为明显，而与此同时小穴与后穴中突然袭击的充盈感带来的愉悦与之相衬，令{target}的身体不自觉的在维护舱的拘束中微微扭动", target),
        new ItemWearWork(['ItemVulvaPiercings', 'ItemVulva', 'ItemButt'], target),
        new MessageWork("chat-action", "拘束自检中"),
        new DelayWork(5),
        new MessageWork("action", "一阵小小的震动为{target}带去些微微不足道的快感，锁定完成的滴声随即响起，这意味着什么呢？", target),
        new ItemLockWork(['ItemNipplesPiercings', 'ItemVulvaPiercings', 'ItemVulva', 'ItemButt'], target),
        new MessageWork("chat-action", "已确认安装到位并锁定"),
        new MessageWork("action", "如同托尼斯塔克在纽约的大楼外的自动维护廊道一般，机械臂们前后举起了数个似乎是战甲一样的装具，装具们早已有过预热，希望并不会为{target}带来寒意，也许吧？", target),
        new MessageWork("action", "胸部，躯干，胯部，温暖的包覆伴随着机械组合动作的细微震动，似乎只是一套极为贴身且足够舒适的内衣被采用这样的方式穿上了身体", target),
        new ItemWearWork(['ItemBreast', 'ItemPelvis', 'ItemTorso', 'ItemTorso2'], target),
        new DelayWork(5),
        new MessageWork("chat-action", "拘束自检中"),
        new DelayWork(5),
        new MessageWork("action", "滴声再次响起，{target}身上显示着的锁定图标增加了一些，在宣告着失去，还是在宣告着拥有？", target),
        new ItemLockWork(['ItemBreast', 'ItemPelvis', 'ItemTorso', 'ItemTorso2'], target),
        new MessageWork("chat-action", "已确认安装到位并锁定"),
        new DelayWork(5),
        new MessageWork("action", "一个连接着数个精巧装置的桶型结构缓缓下降，罩住了{target}的脑袋，短暂的强光与爆鸣令{target}闭上了双眼", target),
        new ItemWearWork(['ItemEars', 'ItemHead'], target),
        new MessageWork("action", "短暂的恍惚与眩晕结束后，{target}并没有太多时间察觉眼前与耳边新增的设备，因为机械爪温柔的捏住了她的鼻子，强迫着她张嘴呼吸", target),
        new MessageWork("action", "但是显然这是维护舱的阴谋，因为很快一个口球就被塞入了她的口中，而口套与附件也随之而来", target),
        new ItemWearWork(['ItemMouth', 'ItemMouth2', 'ItemMouth3'], target),
        new DelayWork(5),
        new ItemPropertyWork(target, [{ group: 'ItemMouth2', property: { OverridePriority: 1 } }, { group: 'ItemMouth3', property: { OverridePriority: 1 } }]),
        new MessageWork("action", "口套的拟态伪装很快启动，完全暴露出{target}的脸与口中紧咬着的口球", target),
        new DelayWork(5),
        new MessageWork("chat-action", "拘束自检中"),
        new DelayWork(5),
        new ItemLockWork(['ItemEars', 'ItemHead', 'ItemMouth', 'ItemMouth2', 'ItemMouth3'], target),
        new MessageWork("action", "口球前方的空中亮起了一个锁定图标，不过很可惜，它是无法被遮挡的全息投影", target),
        new ItemPropertyWork(target, [{ group: 'ItemMouth3', property: { OverridePriority: { "Straps": 1, "Nose": 1, "Mask": 1, "IconLock": 42, "IconMute": 1, "IconX": 1 } } }]),
        new ItemOptionWork(target, [{ group: 'ItemMouth3', option: { "n": 0, "h": 0, "s": 1 } }]),
        new MessageWork("chat-action", "已确认安装到位并锁定"),
        new DelayWork(5),
        new MessageWork("action", "抓着{target}四肢的机械臂微微将她的身体提起，先前安装的铐环此刻似乎启动了某种工作模式，令{target}的手脚短暂的失去了力量", target),
        new ItemWearWork(['ItemHands', 'ItemBoots'], target),
        new MessageWork("action", "趁着{target}手脚自然舒展的时候，数个机械臂灵巧的将手套与高跟鞋套在了她的身上，精心调整着位置以保证穿戴的舒适", target),
        new DelayWork(5),
        new MessageWork("chat-action", "拘束自检中"),
        new DelayWork(5),
        new MessageWork("action", "随着手腕与脚腕处传来的些微紧束感，{target}似乎成功得以控制手脚，温暖的包覆感与朦胧的触觉终会习惯的，不是吗？", target),
        new ItemLockWork(['ItemHands', 'ItemBoots'], target),
        new MessageWork("chat-action", "已确认安装到位并锁定"),
        new DelayWork(5),
        new MessageWork("chat-action", "即将安装控制核心与名牌，提前预祝{target}成为优秀狼女", target),
        new DelayWork(5),
        new MessageWork("action", "精巧的项圈很快搭上了{target}的脖颈，随即缓缓开始收紧，直到项圈微微有些嵌入脖颈，虽然如此，但项圈的紧固丝毫不影响呼吸的顺畅与血液的流动", target),
        new ItemWearWork(['ItemNeck'], target),
        new DelayWork(5),
        new MessageWork("action", "而最后一个机械臂一点点靠近了{target}，上面晃荡着的名牌以一串数字指代着{target}的名字，也许这会是我们最后一次使用这个名字称呼她了", target),
        new ItemWearWork(['ItemNeckAccessories'], target),
        new ItemPropertyWork(target, [{ group: 'ItemNeckAccessories', property: { Text: target.MemberNumber.toString() } }]),
        new MessageWork("chat-action", "控制核心自检中"),
        new DelayWork(5),
        new ItemLockWork(['ItemNeck', 'ItemNeckAccessories'], target),
        new MessageWork("chat-action", "已确认安装到位并锁定，且与各部件成功建立连接"),
        new DelayWork(5),
        new MessageWork("chat-action", "依据设置，正在重建狼女{target_id}服装", target),
        new ClothRestoreWork(target, clothing_stash),
        new DelayWork(5),
        new MessageWork("chat-action", "训练师{player}，狼女{target_id}已安装完训练套件，套件初始化完毕，祝您玩的开心", target),
        new ItemOptionWork(target, [{ group: ToolsCrate.Asset.Group, option: { "w": 1, "l": 0, "a": 0, "d": 0, "t": 0, "h": 0 } }]),
        new ItemOptionWork(target, [
            { group: 'ItemArms', option: { typed: 1 } },
            { group: 'ItemFeet', option: { typed: 2 }, },
            { group: 'ItemLegs', option: { typed: 2 } },
            { group: 'ItemHands', option: { typed: 0 } }
        ]),
        new DelayWork(5),
        new MessageWork("action", "维护舱仓门打开，机械臂将狼女{target}推出，随后开始渐渐变得扭曲，透明，而狼女{target_id}身后小小的辅助定位信标则自动回到了训练师{player}的狼女训练师多用途辅助眼镜中", target),
        new ItemRemoveWork(target, [ToolsCrate]),
    ]
    TimedWorker.global.push(work_sequence);
    TimedWorker.global.resume();
}


export function InitDressSequence(player: Character, target: Character) {
    if (!CheckItem(player, ToolsVisor) || !CheckItem(player, ToolsInjector)) return;
    ChatRoomAction.instance.LocalAction("<INFO> 初始化 Wolf Girl 环境");
    EILNetwork.Access().then(net => {
        ChatRoomAction.instance.LocalAction("<INFO> 已经连接到 Wolf Girl 网络。");
        DressSequence(net, player, target);
    }).catch(e => {
        ChatRoomAction.instance.LocalAction("<ERROR> Wolf Girl 网络断开，已中止过程。");
    });
}