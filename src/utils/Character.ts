
export function ExtractMemberNumber(target: number | Character): number {
    return typeof target === "number" ? target : target.MemberNumber;
}