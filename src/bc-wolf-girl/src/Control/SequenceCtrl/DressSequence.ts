import { DataManager } from "../../Data";
import { EILNetwork } from "../../Network";
import { ChatRoomAction } from "bc-utilities";
import { CheckItemsWork, CheckWork, CommonWork, DelayWork } from "../CommonWork";
import { IMessage, ParseMessage } from "../Message";
import { MessageWork, WaitResponseWork } from "../MessageWork";
import { OutfitItems, ToolsCrate } from "../OutfitCtrl";
import { ClothRemoveWork, ClothRestoreWork, ItemLockWork, ItemOptionWork, ItemPropertyWork, ItemRemoveWork, ItemWearWork } from "../OutfitCtrl";
import { OutfitFixWorkResult, OutfitFixWork } from "../OutfitCtrl/OutfitFixWork";
import { IsCollarOn, IsFullyDressed } from "../WolfGirlCtrl/Check";
import { TimedWork, TimedWorker } from "../Worker";
import { StdMissingAction } from "./ItemCmdSequence/CmdSequenceMessage";

export function DressSequence(net: EILNetwork, player: PlayerCharacter, target: Character) {
    const clothing_stash: Item[] = [];
    const craft = net.craft;
    const work_sequence: TimedWork[] = [
        new CheckWork((player) => {
            return IsFullyDressed(target) ? CheckWork.Stop : CheckWork.Continue;
        }, (pl, result) => {
            if (result.passed) return StdMissingAction;
        }),
        new MessageWork({ mode: "chat-action", msg: "Target selected, wolf girl identity chip detected, remote device connection opening" }),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "Remote connection activated, deploying portable wolf girl training facility maintenance pod" }),
        new MessageWork({ mode: "action", msg: "{player} openes a small partition on the side of his glasses, and an auxiliary positioning beacon floats out and soon hovers behind {target}" }, { target }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "There seems to be some small ripples in the space, and with a small cyclone, a complex maintenance cabin filled with exquisite equipment appears behind {target}, and several mechanical arms stretch out from it and pull her into the maintenance cabin." }, { target }),
        new ItemWearWork([ToolsCrate], target),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "Target detected, maintenance bay secured and locked. Scanning size and collecting data" }),
        new ItemOptionWork(target, [{ target: ToolsCrate.Asset.Group, option: { "w": 1, "l": 2, "a": 1, "d": 0, "t": 0, "h": 4 } }]),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "Confirmed trainer is {player}, confirmed training kit installation target is {target}" }, { target }),
        new MessageWork({ mode: "chat-action", msg: "After collecting the body information, start installing the training components" }),
        new MessageWork({ mode: "chat-action", msg: "Clothes are being removed. Please close your eyes and hold your breath." }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "A mechanical arm extends from the top of the equipment compartment, surrounding {target}'s body and spraying solvent. Soon, {target}'s clothes melt bit by bit, and the dissolved clothes flow down along the body to the bottom of the maintenance compartment and are discharged." }, { target }),
        new ClothRemoveWork(target, clothing_stash),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "Confirmed that the clothes have been cleaned" }),
        new MessageWork({ mode: "action", msg: "Several mechanical arms extend from the upper and lower parts of the maintenance cabin, take the limbs of {target} from the cabin's fixing system, and stretch them out forcefully." }, { target }),
        new ItemOptionWork(target, [{ target: ToolsCrate.Asset.Group, option: { "w": 1, "l": 3, "a": 3, "d": 0, "t": 0, "h": 4 } }]),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "{target}, are you willing to be trained to be a wolf girl? Please answer with yes or no. If yes, does it mean that you will lose enough but still retain a little autonomy, or does it mean gaining and owning for you?" }, { target }),
        new MessageWork({ mode: "chat-action", msg: "Please answer yes or no. Of course, remaining silent and refusing to answer is also an option." }),
        new WaitResponseWork(target, {
            accept: /^(?!.*no).*/g,
            accept_msg: { mode: "chat-action", msg: "Willingness confirmed, installation process continuing" },
            reject: /No/g,
            reject_msg: { mode: "action", msg: "Regardless of the answer, the maintenance cabin is still faithfully executing the program and continuing the installation process." }
        }, 15 * 1000, (player, target) => {
            ParseMessage({ mode: "action", msg: "The reply waiting time has timed out, it is considered as default and the next installation process is in progress" }, { player, target });
        }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "With the help of the mechanical arm, several delicate cuffs are installed on {target}. The small mechanical locking sound is faint but clearly audible." }, { target }),
        ...(['ItemArms', 'ItemFeet', 'ItemLegs'] as AssetGroupItemName[]).map(e => new ItemWearWork([e], target)),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "Restrain self-examination" }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "The cuffs on {target} vibrate slightly, and a small lock icon lights up." }, { target }),
        new ItemLockWork(['ItemArms', 'ItemFeet', 'ItemLegs'], target),
        new MessageWork({ mode: "chat-action", msg: "Confirmed to be installed in place and locked" }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "Two more sophisticated robotic arms extend from both sides and gently pinch {target}'s nipples." }, { target }),
        new MessageWork({ mode: "action", msg: "It seems to be just a cold touch, followed by a tight feeling and pulling force that makes {target} realize that a prop has been installed on her nipple." }, { target }),
        new ItemWearWork(['ItemNipplesPiercings', 'ItemNipples'], target),
        new MessageWork({ mode: "chat-action", msg: "Confirmed that the components are installed properly" }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "The robot arm lets go of {target}'s nipple, move down little by little, and stop at {target}'s lower abdomen. The robot arm gently separates the labia and foreskin, exposing the tender clitoris" }, { target }),
        new MessageWork({ mode: "action", msg: "The pleasure brought by the tightness on the clitoris is obviously more obvious, and at the same time, the pleasure brought by the sudden fullness in the vagina and the back hole is in contrast, making {target}'s body unconsciously twist slightly in the restraint of the maintenance cabin" }, { target }),
        new ItemWearWork(['ItemVulvaPiercings', 'ItemVulva', 'ItemButt'], target),
        new MessageWork({ mode: "chat-action", msg: "Restrain self-examination" }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "A small vibration brings {target} some insignificant pleasure, and then a beeping sound indicates that the locking is completed sounds. What does this mean?" }, { target }),
        new ItemLockWork(['ItemVulvaPiercings', 'ItemVulva', 'ItemButt', 'ItemNipplesPiercings'], target),
        new MessageWork({ mode: "chat-action", msg: "Confirmed to be installed in place and locked" }),
        new MessageWork({ mode: "action", msg: "Just like the automated maintenance corridor outside Tony Stark's building in New York, the robotic arms lifts up several armor-like equipments. The equipments have been preheated long ago, so hopefully they will not bring chill to {target}, maybe?" }, { target }),
        new MessageWork({ mode: "action", msg: "The chest, torso, and hips are covered with warmth, accompanied by the subtle vibrations of the mechanical combination. It seems that it was just a set of extremely close-fitting and comfortable underwear that was put on the body in this way." }, { target }),
        new ItemWearWork(['ItemBreast', 'ItemPelvis', 'ItemTorso', 'ItemTorso2'], target),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "Restrain self-examination" }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "The beeping sound rings out again, and the number of lock icons displayed on {target} increase. Is it announcing loss or possession?" }, { target }),
        new ItemLockWork(['ItemBreast', 'ItemPelvis', 'ItemTorso', 'ItemTorso2'], target),
        new MessageWork({ mode: "chat-action", msg: "Confirmed to be installed in place and locked" }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "A barrel-shaped structure connected to several sophisticated devices slowly decend and cover {target}'s head. The brief bright light and loud noise make {target} close her eyes." }, { target }),
        new ItemWearWork(['ItemEars', 'ItemHead'], target),
        new MessageWork({ mode: "action", msg: "After the brief trance and dizziness ends, {target} does not have much time to notice the new equipment in front of her eyes and ears, because the mechanical claws gently pinch her nose, forcing her to open her mouth to breathe." }, { target }),
        new MessageWork({ mode: "action", msg: "But it is obviously a conspiracy of the maintenance cabin, because soon a ball gag is stuffed into her mouth, and the mouthpiece and accessories follow." }, { target }),
        new ItemWearWork(['ItemMouth', 'ItemMouth2', 'ItemMouth3'], target),
        new DelayWork(5000),
        new ItemPropertyWork(target, [{ group: 'ItemMouth2', property: { OverridePriority: 1 } }, { group: 'ItemMouth3', property: { OverridePriority: 1 } }]),
        new MessageWork({ mode: "action", msg: "The muzzle's camouflage is quickly activated, completely exposing {target}'s face and the ball gag in her mouth." }, { target }),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "Restrain self-examination" }),
        new DelayWork(5000),
        new ItemLockWork(['ItemEars', 'ItemHead', 'ItemMouth', 'ItemMouth2', 'ItemMouth3'], target),
        new MessageWork({ mode: "action", msg: "A lock icon lights up in the air in front of the ball, but unfortunately it is a holographic projection that cannot be blocked." }, { target }),
        new ItemPropertyWork(target, [{ group: 'ItemMouth3', property: { OverridePriority: { "Straps": 1, "Nose": 1, "Mask": 1, "IconLock": 42, "IconMute": 1, "IconX": 1 } } }]),
        new ItemOptionWork(target, [{ target: 'ItemMouth3', option: { "n": 0, "h": 0, "s": 1 } }]),
        new MessageWork({ mode: "chat-action", msg: "Confirmed to be installed in place and locked" }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "The mechanical arms holding {target}'s limbs lift her body slightly. The previously installed cuffs seem to have activated some kind of working mode, causing {target}'s hands and feet to lose strength temporarily." }, { target }),
        new ItemWearWork(['ItemHands', 'ItemBoots'], target),
        new MessageWork({ mode: "action", msg: "While {target}'s hands and feet are naturally stretched, several robotic arms deftly put gloves and high heels on her body, carefully adjusting the position to ensure comfort." }, { target }),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "Restrain self-examination" }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "With a slight tightening feeling coming from the wrists and ankles, {target} seems to have successfully controlled her hands and feet. She will get used to the warm wrapping feeling and hazy touch eventually, right?" }, { target }),
        new ItemLockWork(['ItemHands', 'ItemBoots'], target),
        new MessageWork({ mode: "chat-action", msg: "Confirmed to be installed in place and locked" }),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "The control core and brand name will be installed soon. I wish {target} to become an excellent wolf girl in advance." }, { target }),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "The delicate collar is quickly placed around {target}'s neck, and then slowly begins to tighten until the collar is slightly embedded in the neck. Even so, the tightening of the collar does not affect the smooth breathing and blood flow at all." }, { target }),
        new ItemWearWork(['ItemNeck'], target),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "The last robotic arm approaches {target} little by little. The name tag on it indicating {target}'s name with a string of numbers. Perhaps this will be the last time she is called by this name." }, { target }),
        new ItemWearWork(['ItemNeckAccessories'], target),
        new ItemPropertyWork(target, [{ group: 'ItemNeckAccessories', property: { Text: target.MemberNumber?.toString() ?? "" } }]),
        new MessageWork({ mode: "chat-action", msg: "Control core self-checking" }),
        new DelayWork(5000),
        new ItemLockWork(['ItemNeck', 'ItemNeckAccessories'], target),
        new MessageWork({ mode: "chat-action", msg: "Confirmed that it is installed in place and locked, and that connections are successfully established with all components" }),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "Rebuilding {target_wg}'s clothing according to settings" }, { target }),
        new ClothRestoreWork(target, clothing_stash),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "Trainer {player}, {target_wg} has installed the training kit and the kit has been initialized. I wish you a happy game." }, { target }),
        new ItemOptionWork(target, [{ target: ToolsCrate.Asset.Group, option: { "w": 1, "l": 0, "a": 0, "d": 0, "t": 0, "h": 0 } }]),
        new ItemOptionWork(target, [
            { target: 'ItemArms', option: { typed: 1 } },
            { target: 'ItemFeet', option: { typed: 2 }, },
            { target: 'ItemLegs', option: { typed: 2 } },
            { target: 'ItemHands', option: { typed: 0 } }
        ]),
        new DelayWork(5000),
        new MessageWork({ mode: "action", msg: "The maintenance hatch opens, and the mechanical arm pushes {target_wg} out. Then it begins to gradually become distorted and transparent, and the small auxiliary positioning beacon behind {target_wg} automatically returns to the trainer {player}'s wolf trainer multi-purpose auxiliary glasses." }, { target }),
        new ItemRemoveWork(target, [ToolsCrate]),
    ];
    TimedWorker.global.push({ description: "Dress Sequence", works: work_sequence });
}

export function InitDressSequence(player: PlayerCharacter, target: Character) {
    ChatRoomAction.instance.LocalInfo(">> Connecting to Wolf Girl network...");
    EILNetwork.force_fetch().then(net => {
        const work_sequence: TimedWork[] = [
            new MessageWork({ mode: "local-status", msg: "   ...connected to the Wolf Girl network" }),
            new MessageWork({ mode: "local-status", msg: ">> Permission check starts" }),
            new MessageWork({ mode: "local-status", msg: `   EIL Network Administrator: ${DataManager.permission.isEILNet(player) ? "passed" : "Failed"}` }),
            new MessageWork({ mode: "local-status", msg: `   Lover permissions: ${DataManager.permission.isLover(player, target) ? "passed" : "Failed"}` }),
            new MessageWork({ mode: "local-status", msg: `   Owner permissions: ${DataManager.permission.isOwner(player, target) ? "passed" : "Failed"}` }),
            new CheckWork((player) => {
                const passed = [
                    DataManager.permission.isEILNet(player),
                    DataManager.permission.isLover(player, target),
                    DataManager.permission.isOwner(player, target)
                ].some(i => i);
                if (passed) return CheckWork.Accepted;
                else return CheckWork.Rejected;
            }, (player, result) => {
                if (result.passed) return { mode: "local-status", msg: "   The permission check passes and the installation process starts" };
                else return { mode: "local-status", msg: "   The command has been rejected, aborting the installation process" };
            }),
            new CommonWork(() => {
                DressSequence(EILNetwork.Access, player, target);
            })
        ];
        TimedWorker.global.push({ description: "Init Dress Sequence", works: work_sequence });
    }).catch(e => {
        ChatRoomAction.instance.LocalInfo("...Wolf Girl Network disconnected, aborting process.");
    });
}

export function DressFixSequence(sender: Character | number, player: PlayerCharacter) {
    const cannot_fix: IMessage = {
        mode: "chat-action",
        msg: "Found item {locked_items} replaced by locked item, cannot be automatically repaired, stopping the repair process."
    };

    const craft = EILNetwork.Access.craft;

    let cumm_counter = 0;

    const create_result_process = (msg: IMessage) => (result: OutfitFixWorkResult) => {
        if (result.ret === "canfix" && result.counter) { cumm_counter += result.counter; return msg; }
        else if (result.ret === "blocked") return cannot_fix;
    };

    const work_sequence: TimedWork[] = [
        new CheckWork(() => {
            if (IsCollarOn(player)) return CheckWork.Accepted;
            return CheckWork.Rejected;
        }, (pl, result) => {
            if (!result.passed) return { mode: "chat-action", msg: "Warning, the central control core is lost, please go to EIL or find EIL personnel to handle it" };
        }),
        new MessageWork({ mode: "chat-action", msg: "Instructions received, maintenance mode enabled" }),
        new MessageWork({ mode: "chat-action", msg: "Remote connection activated, deploying portable wolf girl training facility maintenance pod" }),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "There seems to be some small ripples in the space, and with a small cyclone, a complex maintenance cabin filled with exquisite equipment appears behind {player_wg}, and several mechanical arms stretch out from it and pull her into the maintenance cabin." }),
        new ItemWearWork([ToolsCrate], sender, ItemWearWork.TARGET_ACTING),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "Target detected, maintenance bay secured and locked. Scanning" }),
        new ItemOptionWork(player, [{ target: ToolsCrate.Asset.Group, option: { "w": 1, "l": 2, "a": 2, "d": 0, "t": 0, "h": 4 } }]),
        new CheckWork(() => {
            if (IsFullyDressed(player)) return CheckWork.Stop;
            else return CheckWork.Continue;
        }, (pl, r) => {
            if (r.passed) return { mode: "chat-action", msg: "Component scan completed, all online and functioning normally, energy core fully charged, maintenance mode ended, please exit maintenance mode" };
            else return { mode: "chat-action", msg: "Component scan completed, found some components missing or offline, entered repair mode" };
        }),
        new MessageWork({ mode: "chat-action", msg: "Several mechanical arms quickly extend from the maintenance cabin and scan up and down in front of {player_wg}. A light blue beam shines on her, seeming able to see through everything." }),
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
                msg: "Maybe {player_wg} wants to satisfy some cravings. Simple audio-visual experience can make her imagine that nothing has happened, and eating human food can give her brain an illusion? Or maybe she want to use her tongue and mouth to satisfy some obscene things because of the blockage of her body? Is fate unchangeable, or has she long forgotten when she made the choice for herself?"
            })),
        new OutfitFixWork(sender, ['ItemBreast', 'ItemNipplesPiercings', 'ItemNipples'], create_result_process({
            mode: "action",
            msg: "The plump breasts are indeed eye-catching, but is it a bit presumptuous to expose this asset that no longer belongs to you, no? The maintenance cabin uses a small electric shocker to shock {player_wg}'s nipples on both sides, and then resumes the installation of components."
        })),
        new OutfitFixWork(sender, ['ItemHands',
            { target: 'ItemArms', option: { typed: 1 } }], create_result_process({
                mode: "action",
                msg: "It seems that {player_wg} has lost her bracelet and gloves. She seems to want to do something drastic. Was she trying some lewd actions? Or maybe she just wanted to feel the touch? However, the maintenance cabin doesn't care what her purpose was. It just faithfully follows the instructions and installs a new set of equipment back on {player_wg}."
            })),
        new OutfitFixWork(sender, [{ target: 'ItemTorso' }, { target: 'ItemTorso2' }, { target: 'ItemNeckAccessories', property: { Text: player.MemberNumber?.toString() ?? "" } }], create_result_process({
            mode: "chat-action",
            msg: "The external communication belt module, the drug injection module or the identity tag are abnormal. It is true that these modules are very easy to be damaged or lost. They are being repaired, but please note that there will be no discount on the repair cost."
        })),
        new OutfitFixWork(sender, ['ItemVulva', 'ItemPelvis', 'ItemButt', 'ItemVulvaPiercings'], create_result_process({
            mode: "chat-action",
            msg: "Your body, your breath, even your thoughts and your soul all belong to your master. Naturally, the right to orgasm does not belong to you. The pleasure you are allowed to obtain is to remind you of your identity, and the joy of orgasm is a reward from the master. Eating the forbidden fruit will naturally be severely punished."
        })),
        new OutfitFixWork(sender, ['ItemBoots',
            { target: 'ItemFeet', option: { typed: 2 }, },
            { target: 'ItemLegs', option: { typed: 2 } }], create_result_process({
                mode: "action",
                msg: "It looks like {player_wg}'s walking controller is missing. It's really difficult to remove it. Is she trying to escape? But since she became a wolf girl, isn't the freedom she has enough? Unfortunately, unless the master allows it, she can't escape anyway. Well, maybe I should tell the master about this. The maintenance cabin gives {player_wg} a slight electric shock, and then isntalls a new controller for her."
            })),
        new MessageWork({ mode: "chat-action", msg: "The component has been repaired. The corresponding reward points have been deducted according to the component loss situation. Rescanning and self-checking" }),
        new CommonWork((player) => {
            DataManager.points.points -= cumm_counter;
            ParseMessage({ mode: "local", msg: `${cumm_counter} points have been deducted, current points are ${DataManager.points.points}` });
        }),
        new DelayWork(5000),
        new CheckItemsWork(OutfitItems, (player, result) => {
            DataManager.statistics.set_last_fix_time(Date.now());
            DataManager.outfit.items = [];
            if (result.missing.length === 0) {
                ParseMessage({ mode: "chat-action", msg: "Component scan completed, all online and functioning normally, energy core fully charged, maintenance mode ended, please exit maintenance mode" }, { player });
            } else {
                const missing_formated = result.missing.map(g => g.Craft.Name).join(", ");
                ParseMessage({ mode: "chat-action", msg: "Error: Component repair failed, there are still unworn components: {missing_formated}" }, { player }, { missing_formated });
            }
        })
    ];

    TimedWorker.global.push({ description: "DressFixSequence", works: work_sequence });
}

