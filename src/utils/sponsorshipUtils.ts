/**
 * Generate a unique ID from item name by converting to lowercase and replacing spaces with hyphens
 *
 * @param name - The item name to convert to an ID
 * @returns A lowercase, hyphenated ID string (e.g., "mobile-game-chance-square")
 *
 * @example
 * generateIdFromName("Mobile Game Chance Square") // returns "mobile-game-chance-square"
 * generateIdFromName("Ad Title Sponsorship") // returns "ad-title-sponsorship"
 */
export function generateIdFromName(name: string): string {
    return (
        name
            .toLowerCase()
            .replaceAll(' ', '-')
            // replaceAll doesn't support regex, so we use replace for pattern matching
            // eslint-disable-next-line unicorn/prefer-string-replace-all
            .replace(/[^\da-z-]/g, '')
    );
}
