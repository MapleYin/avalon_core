import { Create, UpdateRecentTeamMember, UpdateRecentTeamVote, UpdateResentQuestVote, SetNextLadyOfTheLake, TAvalon } from "../src/avalon"
import { TQuest, TTeam } from "../src/quest"
import { TRule } from "../src/rule"

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
const runQuest = (game: TAvalon, step: TStep[]) => {
    step.forEach(({ member, teamVotes, questVotes }) => {
        UpdateRecentTeamMember(game, member)
        UpdateRecentTeamVote(game, teamVotes)
        UpdateResentQuestVote(game, questVotes)
    })
}

describe("Avalon Game", () => {
    const mockRule: TRule = {
        numberOfPlayer: 7,
        characters: ["merlin", "percival", "loyalServant", "loyalServant", "morgana", "assassin", "oberon"],
        quest: {
            each: [
                { numberOfMebers: 2 },
                { numberOfMebers: 3 },
                { numberOfMebers: 3 },
                { numberOfMebers: 4, needTwoFailure: true },
                { numberOfMebers: 4 }
            ],
            team: {
                maxCountOfSummonTeam: 5,
                mode: "each"
            }
        },
        characterVisibilitiesRules: [{
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
    }

    it("should create a new Avalon game", () => {
        const game = Create({ numberOfPlayer: 7 })
        expect(game.rule).toEqual(mockRule)
        expect(game.quests.length).toBe(5)
        expect(game.stage).toBe("team")
        expect(game.players.length).toBe(7)
        expect(game.lancelotSwitch).toBeUndefined()
    })

    it("should update recent team members", () => {
        const game = Create({ numberOfPlayer: 5 })
        const members = [0, 1]
        UpdateRecentTeamMember(game, members)
        expect(game.quests[0].teams[0].members).toEqual(members)
    })

    it("should update recent team vote", () => {
        const config = { numberOfPlayer: 5 }
        const game = Create(config)
        const votes = createTeamVotes(config.numberOfPlayer, false)
        UpdateRecentTeamMember(game, [0, 1])
        UpdateRecentTeamVote(game, votes)
        expect(game.quests[0].teams[0].votes).toEqual(votes)
        expect(game.stage).toBe("team")
    })

    it("should update recent quest vote", () => {
        const config = { numberOfPlayer: 5 }
        const game = Create(config)
        const teamVotes = createTeamVotes(config.numberOfPlayer, true)
        const votes = [true, false]
        UpdateRecentTeamMember(game, [0, 1])
        UpdateRecentTeamVote(game, teamVotes)
        UpdateResentQuestVote(game, votes)
        expect(game.quests[0].result?.votes).toEqual(votes)
        expect(game.quests[0].state).toBe("finished")
    })

    it("should set next Lady of the Lake", () => {
        const game = Create({ numberOfPlayer: 5, hasLadyOfTheLake: true })
        const nextLadyOfTheLake = 2

        runQuest(game, [{
            member: [0, 1],
            teamVotes: createTeamVotes(game.rule.numberOfPlayer, true),
            questVotes: [true, false]
        }, {
            member: [2, 3, 1],
            teamVotes: createTeamVotes(game.rule.numberOfPlayer, true),
            questVotes: [true, false, true]
        }])
        expect(game.stage).toBe("ladyOfTheLake")
        SetNextLadyOfTheLake(game, nextLadyOfTheLake)
        expect(game.quests[1].nextLadyOfTheLake).toBe(nextLadyOfTheLake)
        expect(game.stage).toBe("team")
    })
})