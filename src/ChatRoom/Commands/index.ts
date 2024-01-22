import { ItemCmds } from "./ItemCmds";
import { OutfitCmds } from "./OutfitCmds";
import { PermCmds } from "./PermCmds";
import { RoomCmds } from "./RoomCmds";
import { ModPointsCmds, SelfPointCmds } from "./PointsCmds";
import { ArousalCmds } from "./ArousalCmds";

export const Commands = [ItemCmds, RoomCmds, PermCmds, OutfitCmds, ArousalCmds, ModPointsCmds].flat();

export const PointCommands = [SelfPointCmds].flat();