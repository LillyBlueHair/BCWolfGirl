import { EILNetwork } from "../Network";

export function PermissionCheck(player: Character, sender: number | Character, net: EILNetwork) {
    const senderNumber = typeof sender === "number" ? sender : sender.MemberNumber;
    if (player.Ownership && player.Ownership.MemberNumber === senderNumber) return true;
    if (player.Lovership && player.Lovership.some(e => e.MemberNumber === senderNumber)) return true;
    if (net.isEIL(senderNumber)) return true;
    return false;
}