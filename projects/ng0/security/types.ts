export interface ClaimObject {
    all?: string[],
    any?: string[],
}

export type ClaimLike = string | ClaimObject;
