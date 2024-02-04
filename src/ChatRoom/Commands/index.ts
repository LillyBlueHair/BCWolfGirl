import { ItemCmds } from "./ItemCmds";
import { OutfitCmds } from "./OutfitCmds";
import { PermCmds } from "./PermCmds";
import { RoomCmds } from "./RoomCmds";
import { TaskPointsCmds, SelfPointCmds } from "./PointsCmds";
import { StatCmds } from "./StatCmds";
import { InjectionCmds, InjectionSwitchCmds } from "./InjectionCmds";

export const Commands = [ItemCmds, RoomCmds, PermCmds, OutfitCmds, StatCmds, TaskPointsCmds, InjectionCmds].flat();

export const PointCommands = [SelfPointCmds].flat();

export const InjectionSwCommands = [InjectionSwitchCmds].flat();