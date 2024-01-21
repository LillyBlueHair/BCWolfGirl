import { RunControls } from "../../Control/WolfGirlCtrl";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites } from "../Prerequistes";

export const ItemCmds: CommandTemplate[] = [
    {
        match: /^(关闭|基础|完全)听觉限制/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            return RunControls(player, "HearingCtrl", (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                return "total";
            })());
        }
    },
    {
        match: /^(关闭|基础|完全)视觉限制/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            return RunControls(player, "VisionCtrl", (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                return "total";
            })());
        }
    },
    {
        match: /^(关闭|基础|完全)语言限制/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            return RunControls(player, "VoiceCtrl", (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                return "total";
            })());
        }
    },
    {
        match: /^(关闭|基础|完全)手臂限制/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            return RunControls(player, "HandsCtrl", (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                return "total";
            })());
        }
    },
    {
        match: /^(关闭|基础|完全)行走限制/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            return RunControls(player, "FeetCtrl", (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                return "total";
            })());
        }
    },
    {
        match: /^(关闭|寸止|拒绝)高潮锁/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            return RunControls(player, "ArousalCtrl", (() => {
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
            return RunControls(player, "ToysCtrl", (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "打开") return "open";
                return "max";
            })());
        }
    },
    {
        match: /^(关闭|打开)公开操作权限/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            return RunControls(player, "FuturisticPublicCtrl", (() => {
                if (content[1] === "关闭") return "close";
                return "open";
            })());
        }
    },
];
