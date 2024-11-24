import { ArousalCtrlSequence, FeetCtrlSequence, FuturisticPublicCtrlSequence, HandsCtrlSequence, HearingCtrlSequence, ToysCtrlSequence, VisionCtrlSequence, VoiceCtrlSequence } from "../../Control/SequenceCtrl/ItemCmdSequence";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites } from "../Prerequistes";

export const ItemCmds: CommandTemplate[] = [
    {
        match: /^((关闭|基础|完全)听觉限制)|(hearing limitation (off|basic|full))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            HearingCtrlSequence(player, (() => {
                if (content[2] === "关闭" || content[4].toLowerCase() === "off") return "off";
                if (content[2] === "基础" || content[4].toLowerCase() === "basic") return "base";
                if (content[2] === "完全" || content[4].toLowerCase() === "full") return "total";
                return "total";
            })())
        }
    },
    {
        match: /^((关闭|基础|完全)视觉限制)|(visual restrictions (off|basic|full))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            VisionCtrlSequence(player, (() => {
                if (content[2] === "关闭" || content[4].toLowerCase() === "off") return "off";
                if (content[2] === "基础" || content[4].toLowerCase() === "basic") return "base";
                if (content[2] === "完全" || content[4].toLowerCase() === "full") return "total";
                return "total";
            })());
        }
    },
    {
        match: /^((关闭|基础|完全)语言限制)|(language restrictions (off|basic|full))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            VoiceCtrlSequence(player, (() => {
                if (content[2] === "关闭" || content[4].toLowerCase() === "off") return "off";
                if (content[2] === "基础" || content[4].toLowerCase() === "basic") return "base";
                if (content[2] === "完全" || content[4].toLowerCase() === "full") return "total";
                return "total";
            })());
        }
    },
    {
        match: /^((关闭|基础|完全)手臂限制)|(arm restraint (off|basic|full))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            HandsCtrlSequence(player, (() => {
                if (content[2] === "关闭" || content[4].toLowerCase() === "off") return "off";
                if (content[2] === "基础" || content[4].toLowerCase() === "basic") return "base";
                if (content[2] === "完全" || content[4].toLowerCase() === "full") return "total";
                return "total";
            })());
        }
    },
    {
        match: /^((关闭|基础|完全)行走限制)|(leg restraint (off|basic|full))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            FeetCtrlSequence(player, (() => {
                if (content[2] === "关闭" || content[4].toLowerCase() === "off") return "off";
                if (content[2] === "基础" || content[4].toLowerCase() === "basic") return "base";
                if (content[2] === "完全" || content[4].toLowerCase() === "full") return "total";
                return "total";
            })());
        }
    },
    {
        match: /^((关闭|寸止|拒绝)高潮锁)|(orgasm lock (off|edge|deny))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            ArousalCtrlSequence(player, (() => {
                if (content[2] === "关闭" || content[4].toLowerCase() === "off") return "off";
                if (content[2] === "寸止" || content[4].toLowerCase() === "edge") return "edge";
                if (content[2] === "拒绝" || content[4].toLowerCase() === "deny") return "deny";
                return "off";
            })());
        }
    },
    {
        match: /^((关闭|打开|最大)振动器)|(vibrator (off|on|max))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            ToysCtrlSequence(player, (() => {
                if (content[2] === "关闭" || content[4].toLowerCase() === "off") return "off";
                if (content[2] === "打开" || content[4].toLowerCase() === "on") return "open";
                if (content[2] === "最大" || content[4].toLowerCase() === "max") return "max";
                return "max";
            })());
        }
    },
    {
        match: /^((关闭|打开)公开操作权限)|(public operation permissions (close|open))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            FuturisticPublicCtrlSequence(player, (() => {
                if (content[2] === "关闭" || content[4].toLowerCase() === "close") return "close";
                if (content[2] === "打开" || content[4].toLowerCase() === "open") return "open";
                return "open";
            })());
        }
    },
];
