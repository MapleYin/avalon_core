import { TCharacterKey } from "./character"
import { randomArray } from "./tools";

type TVisibilityRule = {
    title: string;
    characters: TCharacterKey[];
    canSee: TCharacterKey[];
}

/**
 * Represents the rules for a game.
 */
export type TRule = {
    /**
     * The characters involved in the game.
     */
    characters: TCharacterKey[];

    /**
     * The visibility rules for the characters.
     */
    characterVisibilitiesRules: TVisibilityRule[];

    /**
     * The number of players in the game.
     */
    numberOfPlayer: number;

    /**
     * The quest details for the game.
     */
    quest: {
        /**
         * The configuration for each quest.
         */
        each: {
            /**
             * The number of members required for the quest.
             */
            numberOfMebers: number;

            /**
             * Indicates if two failures are needed.
             */
            needTwoFailure?: true
        }[];

        /**
         * The team configuration for the game.
         */
        team: {
            /**
             * The maximum count of summon teams.
             */
            maxCountOfSummonTeam: number;

            /**
             * The mode of the team configuration.
             */
            mode: "each" | "whole";
        };
    };

    /**
     * Indicates if the Lady of the Lake is present.
     */
    hasLadyOfTheLake?: true;

    /**
     * Indicates if Excalibur is enabled.
     */
    enableExcalibur?: true;

    /**
     * The rule for Lancelot.
     */
    lancelot?: "rule1" | "rule2" | "rule3";
}

export const RandomLancelotSwitchForRule1 = () => {
    return randomArray([true, true, false, false, false])
}
export const RandomLancelotSwitchForRule2 = () => {
    return randomArray([true, true, false, false, false, false, false]).slice(0, 5)
}

const defaultVisibilityRules: TVisibilityRule[] = [{
    title: "可看到的坏人",
    characters: ["merlin"],
    canSee: ["morgana", "minion", "assassin", "oberon", "lancelot_evil"]
}, {
    title: "梅林/莫甘娜",
    characters: ["percival"],
    canSee: ["merlin", "morgana"]
}, {
    title: "可看到的队友",
    characters: ["morgana", "assassin", "mordred", "minion"],
    canSee: ["morgana", "assassin", "mordred", "minion", "lancelot_evil"]
}]

export const lancelotVisibilityRule: TVisibilityRule = {
    title: "可看到的彼此",
    characters: ["lancelot_good", "lancelot_evil"],
    canSee: ["lancelot_good", "lancelot_evil"]
}

export const defaultRuleForNumberOfPlayer = (numberOfPlayer: number): TRule | undefined => {
    const rule = innerRules.find(item => item.numberOfPlayer === numberOfPlayer)
    if (!rule) {
        return
    }
    return {
        characters: rule.characters,
        numberOfPlayer,
        characterVisibilitiesRules: defaultVisibilityRules,
        quest: {
            team: {
                maxCountOfSummonTeam: 5,
                mode: "each"
            },
            each: rule.quests
        }
    }
}

const innerRules: { numberOfPlayer: number, characters: TCharacterKey[], quests: { numberOfMebers: number, needTwoFailure?: true }[] }[] = [{
    numberOfPlayer: 5,
    characters: ["merlin", "percival", "loyalServant", "morgana", "assassin"],
    quests: [
        { numberOfMebers: 2 },
        { numberOfMebers: 3 },
        { numberOfMebers: 2 },
        { numberOfMebers: 3 },
        { numberOfMebers: 3 }
    ]
}, {
    numberOfPlayer: 6,
    characters: ["merlin", "percival", "loyalServant", "loyalServant", "morgana", "assassin"],
    quests: [
        { numberOfMebers: 2 },
        { numberOfMebers: 3 },
        { numberOfMebers: 4 },
        { numberOfMebers: 3 },
        { numberOfMebers: 4 }
    ]
}, {
    numberOfPlayer: 7,
    characters: ["merlin", "percival", "loyalServant", "loyalServant", "morgana", "assassin", "oberon"],
    quests: [
        { numberOfMebers: 2 },
        { numberOfMebers: 3 },
        { numberOfMebers: 3 },
        { numberOfMebers: 4, needTwoFailure: true },
        { numberOfMebers: 4 }
    ]
}, {
    numberOfPlayer: 8,
    characters: ["merlin", "percival", "loyalServant", "loyalServant", "loyalServant", "morgana", "assassin", "minion"],
    quests: [
        { numberOfMebers: 3 },
        { numberOfMebers: 4 },
        { numberOfMebers: 4 },
        { numberOfMebers: 5, needTwoFailure: true },
        { numberOfMebers: 5 }
    ]
}, {
    numberOfPlayer: 9,
    characters: ["merlin", "percival", "loyalServant", "loyalServant", "loyalServant", "loyalServant", "mordred", "morgana", "assassin"],
    quests: [
        { numberOfMebers: 3 },
        { numberOfMebers: 4 },
        { numberOfMebers: 4 },
        { numberOfMebers: 5, needTwoFailure: true },
        { numberOfMebers: 5 }
    ]
}, {
    numberOfPlayer: 10,
    characters: ["merlin", "percival", "loyalServant", "loyalServant", "loyalServant", "loyalServant", "mordred", "morgana", "assassin", "oberon"],
    quests: [
        { numberOfMebers: 3 },
        { numberOfMebers: 4 },
        { numberOfMebers: 4 },
        { numberOfMebers: 5, needTwoFailure: true },
        { numberOfMebers: 5 }
    ]
}]

