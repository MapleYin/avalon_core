const C = <T extends string, P extends "good" | "evil" >(key: T, alignment: P) => {
    return {
        key,
        alignment
    }
}

export const merlin = C('merlin', "good")
export const percival = C('percival', "good")
export const loyalServant = C('loyalServant', "good")
export const lancelot_good = C('lancelot_good', "good")
export const morgana = C('morgana', "evil")
export const assassin = C('assassin', "evil")
export const oberon = C('oberon', "evil")
export const mordred = C('mordred', "evil")
export const minion = C('minion', "evil")
export const lancelot_evil = C('lancelot_evil', "evil")

export const Characters = [merlin, percival, loyalServant, morgana, assassin, oberon, mordred, minion, lancelot_good, lancelot_evil]
export type TAlignment = typeof Characters[number]["alignment"]
export type TCharacterKey = typeof Characters[number]["key"]