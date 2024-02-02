import { ItemCmds } from "./ItemCmds";
import { OutfitCmds } from "./OutfitCmds";
import { PermCmds } from "./PermCmds";
import { RoomCmds } from "./RoomCmds";
import { TaskPointsCmds, SelfPointCmds } from "./PointsCmds";
import { StatCmds } from "./StatCmds";

export const Commands = [ItemCmds, RoomCmds, PermCmds, OutfitCmds, StatCmds, TaskPointsCmds].flat();

export const PointCommands = [SelfPointCmds].flat();