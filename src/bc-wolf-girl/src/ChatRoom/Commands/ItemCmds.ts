import { ArousalCtrlSequence, FeetCtrlSequence, FuturisticPublicCtrlSequence, HandsCtrlSequence, HearingCtrlSequence, ToysCtrlSequence, VisionCtrlSequence, VoiceCtrlSequence } from "../../Control/SequenceCtrl/ItemCmdSequence";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites } from "../Prerequistes";

export const ItemCmds: CommandTemplate[] = [
    {
        match: /^(关闭|基础|完全)听觉限制/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            HearingCtrlSequence(player, (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                if (content[1] === "完全") return "total";
                return "total";
            })())
        }
    },
    {
        match: /^(关闭|基础|完全)视觉限制/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            VisionCtrlSequence(player, (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                if (content[1] === "完全") return "total";
                return "total";
            })());
        }
    },
    {
        match: /^(关闭|基础|完全)语言限制/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            VoiceCtrlSequence(player, (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                if (content[1] === "完全") return "total";
                return "total";
            })());
        }
    },
    {
        match: /^(关闭|基础|完全)手臂限制/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            HandsCtrlSequence(player, (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                if (content[1] === "完全") return "total";
                return "total";
            })());
        }
    },
    {
        match: /^(关闭|基础|完全)行走限制/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            FeetCtrlSequence(player, (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                if (content[1] === "完全") return "total";
                return "total";
            })());
        }
    },
    {
        match: /^(关闭|寸止|拒绝)高潮锁/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            ArousalCtrlSequence(player, (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "寸止") return "edge";
                if (content[1] === "拒绝") return "deny";
                return "off";
            })());
        }
    },
    {
        match: /^(关闭|打开|最大)振动器/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            ToysCtrlSequence(player, (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "打开") return "open";
                if (content[1] === "最大") return "max";
                return "max";
            })());
        }
    },
    {
        match: /^(关闭|打开)公开操作权限/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            FuturisticPublicCtrlSequence(player, (() => {
                if (content[1] === "关闭") return "close";
                if (content[1] === "打开") return "open";
                return "open";
            })());
        }
    },
];
