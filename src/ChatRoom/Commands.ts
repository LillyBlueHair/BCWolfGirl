import { PermissionCheck } from "../Control/Permmission";
import { GetWolfGrilName, RunControls } from "../Control/WolfGirlCtrl";
import { EILNetwork } from "../Network";
import { AppearanceUpdate } from "../utils/Apperance";

interface CommandTemplate {
    match: RegExp;
    run(player: Character, sender: number | Character, content: RegExpExecArray): boolean;
}

const cmds: CommandTemplate[] = [
    {
        match: /(关闭|基础|完全)听觉限制/,
        run(player, sender, content) {
            return RunControls(player, "HearingCtrl", (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                return "total";
            })());
        }
    },
    {
        match: /(关闭|基础|完全)视觉限制/,
        run(player, sender, content) {
            return RunControls(player, "VisionCtrl", (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                return "total";
            })());
        }
    },
    {
        match: /(关闭|基础|完全)语言限制/,
        run(player, sender, content) {
            return RunControls(player, "VoiceCtrl", (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                return "total";
            })());
        }
    },
    {
        match: /(关闭|基础|完全)手臂限制/,
        run(player, sender, content) {
            return RunControls(player, "HandsCtrl", (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                return "total";
            })());
        }
    },
    {
        match: /(关闭|基础|完全)行走限制/,
        run(player, sender, content) {
            return RunControls(player, "FeetCtrl", (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "基础") return "base";
                return "total";
            })());
        }
    },
    {
        match: /(关闭|寸止|拒绝)高潮锁/,
        run(player, sender, content) {
            return RunControls(player, "ArousalCtrl", (() => {
                if (content[1] === "寸止") return "edge";
                if (content[1] === "拒绝") return "deny";
                return "off";
            })());
        }
    },
    {
        match: /(关闭|打开|最大)振动器/,
        run(player, sender, content) {
            return RunControls(player, "ToysCtrl", (() => {
                if (content[1] === "关闭") return "off";
                if (content[1] === "打开") return "open";
                return "max";
            })());
        }
    },
]

function Strip(src: string) {
    return src.replace(/^[\s\p{P}]*/u, "");
}

export function RunCommands(player: Character, sender: number | Character, content: string) {
    content = Strip(content);
    const wgname = GetWolfGrilName(player);
    if (!content.startsWith(wgname)) return false;
    content = content.slice(wgname.length);
    content = Strip(content);

    for (const cmd of cmds) {
        const result = cmd.match.exec(content);
        if (result) {
            EILNetwork.Access().then(net => {
                if (!PermissionCheck(player, sender, net)) return;
                cmd.run(player, sender, result);
                AppearanceUpdate(player);
            });
            return
        }
    }
}