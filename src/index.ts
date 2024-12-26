import { TAvalon } from "./avalon"
import { RecentTeam as recentTeam } from "./quest"

export { Create as CreateAvalon, UpdateRecentTeamMember, UpdateRecentTeamVote, UpdateResentQuestVote, SetNextLadyOfTheLake, Assassinate, SetExcalibur } from "./avalon"
export { defaultRuleForNumberOfPlayer as DefaultRuleForNumberOfPlayer } from "./rule"
export const RecentTeam = (avalon: TAvalon) => {
    return recentTeam(avalon.quests)
}
export type { TAvalon } from "./avalon"
export type { TQuest, TTeam } from "./quest"
export type { TRule } from "./rule"