/**
 * Represents a claim object that can contain multiple claims.
 */
export interface ClaimObject {
    all?: string[],
    any?: string[],
}

/**
 * Represents a claim that can be a string or an object containing claims.
 * This is useful for defining permissions or roles in a security context.
 * It allows for both simple string claims and more complex claims that can include multiple values.
 * For example:
 * - A simple claim: 'admin'
 * - A complex claim: { all: ['read', 'write']'] }
 * 
 */
export type ClaimLike = string | ClaimObject;

export type ShowCondition = ClaimObject | 'set' | 'unset';
