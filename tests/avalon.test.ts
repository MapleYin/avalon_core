import { Create, UpdateRecentTeamMember, UpdateRecentTeamVote, UpdateResentQuestVote, SetNextLadyOfTheLake, TAvalon } from "../src/avalon"
import { TQuest, TTeam } from "../src/quest"
import { defaultRuleForNumberOfPlayer, TRule } from "../src/rule"

const createTeamVotes = (count: number, success: boolean): TTeam["votes"] => {
    let maxSuccessCount = success ? Math.floor(count / 2) + 1 : Math.floor(count / 2)
    return Array.from({ length: count }, (v, i) => {
        return { player: i, vote: i < maxSuccessCount }
    })
}
type TStep = {
    member: number[]
    teamVotes: TTeam["votes"]
    questVotes: boolean[]
}
const runQuest = (game: TAvalon, rule: TRule, step: TStep[]) => {
    step.forEach(({ member, teamVotes, questVotes }) => {
        UpdateRecentTeamMember(game, member)
        UpdateRecentTeamVote(game, rule, teamVotes)
        UpdateResentQuestVote(game, rule, questVotes)
    })
}

describe("Avalon Game", () => {

    it("should create a new Avalon game", () => {
        const rule = defaultRuleForNumberOfPlayer(7)!
        const game = Create(rule)
        expect(game.quests.length).toBe(5)
        expect(game.stage).toBe("team")
        expect(game.players.length).toBe(7)
        expect(game.lancelotSwitch).toBeUndefined()
    })

    it("should update recent team members", () => {
        const rule = defaultRuleForNumberOfPlayer(5)!
        const game = Create(rule)
        const members = [0, 1]
        UpdateRecentTeamMember(game, members)
        expect(game.quests[0].teams[0].members).toEqual(members)
    })

    it("should update recent team vote", () => {
        const rule = defaultRuleForNumberOfPlayer(5)!
        const game = Create(rule)
        const votes = createTeamVotes(rule.numberOfPlayer, false)
        UpdateRecentTeamMember(game, [0, 1])
        UpdateRecentTeamVote(game, rule, votes)
        expect(game.quests[0].teams[0].votes).toEqual(votes)
        expect(game.stage).toBe("team")
    })

    it("should update recent quest vote", () => {
        const rule = defaultRuleForNumberOfPlayer(5)!
        const game = Create(rule)
        const teamVotes = createTeamVotes(rule.numberOfPlayer, true)
        const votes = [true, false]
        UpdateRecentTeamMember(game, [0, 1])
        UpdateRecentTeamVote(game, rule, teamVotes)
        UpdateResentQuestVote(game, rule, votes)
        expect(game.quests[0].result?.votes).toEqual(votes)
        expect(game.quests[0].state).toBe("finished")
    })

    it("should set next Lady of the Lake", () => {
        const rule = defaultRuleForNumberOfPlayer(5)!
        rule.hasLadyOfTheLake = true
        const game = Create(rule)
        const nextLadyOfTheLake = 2

        runQuest(game, rule, [{
            member: [0, 1],
            teamVotes: createTeamVotes(rule.numberOfPlayer, true),
            questVotes: [true, false]
        }, {
            member: [2, 3, 1],
            teamVotes: createTeamVotes(rule.numberOfPlayer, true),
            questVotes: [true, false, true]
        }])
        expect(game.stage).toBe("ladyOfTheLake")
        SetNextLadyOfTheLake(game, rule, nextLadyOfTheLake)
        expect(game.quests[1].nextLadyOfTheLake).toBe(nextLadyOfTheLake)
        expect(game.stage).toBe("team")
    })
})