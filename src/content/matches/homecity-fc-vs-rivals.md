
---
import BaseLayout from "../layouts/BaseLayout.astro";
import "../styles/match-center.css";
import { getCollection, getEntry } from "astro:content";

const homepageEntry = await getEntry("homepage", "homepage");

const selectedLeague = homepageEntry?.data.standingsLeague ?? "Thika League";
const selectedSeason = homepageEntry?.data.standingsSeason ?? "2026/27";

// Use Kenya's local date when selecting upcoming fixtures.
const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Africa/Nairobi",
});

const allMatches = await getCollection("matches");

const allStandings = await getCollection("standings");

const upcomingMatches = allMatches
    .filter(({ data }) =>
        data.matchStatus === "upcoming" &&
        data.matchDate >= today
    )
    .sort((a, b) =>
        a.data.matchDate.localeCompare(b.data.matchDate) ||
        a.data.kickoffTime.localeCompare(b.data.kickoffTime)
    );

const completedMatches = allMatches
    .filter(({ data }) =>
        data.matchStatus === "completed" &&
        data.homeScore !== undefined &&
        data.awayScore !== undefined
    )
    .sort((a, b) =>
        b.data.matchDate.localeCompare(a.data.matchDate)
    );

const nextMatch = upcomingMatches[0];

const latestResults = completedMatches.slice(0, 5);

const upcomingFriendlies = upcomingMatches.filter(({ data }) =>
    data.competition.toLowerCase().includes("friendly")
);

const leagueStandings = allStandings
    .filter(({ data }) =>
        data.league === selectedLeague &&
        data.season === selectedSeason
    )
    .sort((a, b) => a.data.position - b.data.position);

const postponedMatches = allMatches
    .filter(({ data }) =>
        data.matchStatus === "postponed" &&
        data.matchDate >= today
    )
    .sort((a, b) => a.data.matchDate.localeCompare(b.data.matchDate));

const cancelledMatches = allMatches
    .filter(({ data }) =>
        data.matchStatus === "cancelled" &&
        data.matchDate >= today
    )
    .sort((a, b) => a.data.matchDate.localeCompare(b.data.matchDate));

function formatMatchDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-KE", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Africa/Nairobi",
    });
}

function formatShortDate(date: string) {
    const parsed = new Date(`${date}T00:00:00`);

    return {
        day: parsed.toLocaleDateString("en-KE", {
            day: "2-digit",
            timeZone: "Africa/Nairobi",
        }),
        month: parsed.toLocaleDateString("en-KE", {
            month: "short",
            timeZone: "Africa/Nairobi",
        }).toUpperCase(),
        year: parsed.toLocaleDateString("en-KE", {
            year: "numeric",
            timeZone: "Africa/Nairobi",
        }),
    };
}

function getResultOutcome(
    homeTeam: string,
    awayTeam: string,
    homeScore: number,
    awayScore: number,
) {
    const clubName = "homecity fc";
    const homeIsClub = homeTeam.toLowerCase() === clubName;
    const awayIsClub = awayTeam.toLowerCase() === clubName;

    if (!homeIsClub && !awayIsClub) {
        if (homeScore > awayScore) return "HOME WIN";
        if (awayScore > homeScore) return "AWAY WIN";
        return "DRAW";
    }

    const clubScore = homeIsClub ? homeScore : awayScore;
    const opponentScore = homeIsClub ? awayScore : homeScore;

    if (clubScore > opponentScore) return "WIN";
    if (clubScore < opponentScore) return "LOSS";
    return "DRAW";
}

function outcomeClass(outcome: string) {
    if (outcome === "WIN" || outcome === "HOME WIN" || outcome === "AWAY WIN") {
        return "win";
    }

    if (outcome === "LOSS") return "loss";

    return "draw";
}
---

<BaseLayout
    title="Match Centre | Homecity FC"
    description="Fixtures, results and league standings — follow every Homecity FC match."
    activePage="match-center"
>
    <!-- PAGE HERO -->
    <section
        class="page-hero"
        style="background-image: url('/images/matchday.png');"
    >
        <div class="page-hero-overlay"></div>

        <div class="page-hero-content">
            <span class="page-label">MATCH CENTRE</span>

            <h1>
                FOLLOW THE <span>ACTION.</span>
            </h1>

            <p>
                Stay up to date with Homecity FC fixtures,
                results, friendlies and league standings.
            </p>
        </div>
    </section>

    <!-- NEXT MATCH -->
    <section class="next-match-section">
        <div class="section-container">
            <div class="section-heading">
                <span>NEXT MATCH</span>
                <h2>THE NEXT BATTLE</h2>
            </div>

            {nextMatch ? (
                <div class="next-match-card">
                    <div class="match-date">
                        <span>
                            {new Date(`${nextMatch.data.matchDate}T00:00:00`)
                                .toLocaleDateString("en-KE", {
                                    weekday: "long",
                                    timeZone: "Africa/Nairobi",
                                })
                                .toUpperCase()}
                        </span>

                        <strong>
                            {formatShortDate(nextMatch.data.matchDate).day}
                        </strong>

                        <span>
                            {formatShortDate(nextMatch.data.matchDate).month}
                            {" "}
                            {formatShortDate(nextMatch.data.matchDate).year}
                        </span>
                    </div>

                    <div class="match-teams">
                        <div class="team home-team">
                            <div class="team-name">
                                {nextMatch.data.homeTeam}
                            </div>
                            <span>
                                {nextMatch.data.homeTeam.toLowerCase() === "homecity fc"
                                    ? "HOME"
                                    : "HOME TEAM"}
                            </span>
                        </div>

                        <div class="match-vs">
                            <strong>VS</strong>
                            <span>{nextMatch.data.kickoffTime}</span>
                        </div>

                        <div class="team away-team">
                            <div class="team-name">
                                {nextMatch.data.awayTeam}
                            </div>
                            <span>
                                {nextMatch.data.awayTeam.toLowerCase() === "homecity fc"
                                    ? "AWAY"
                                    : "AWAY TEAM"}
                            </span>
                        </div>
                    </div>

                    <div class="match-details">
                        <span>
                            <i class="fas fa-trophy"></i>
                            {nextMatch.data.competition}
                        </span>

                        <span>
                            <i class="fas fa-location-dot"></i>
                            {nextMatch.data.venue}
                        </span>
                    </div>
                </div>
            ) : (
                <div class="next-match-card">
                    <p class="match-meta">
                        No upcoming fixtures are currently scheduled.
                        Check back for updates.
                    </p>
                </div>
            )}
        </div>
    </section>

    <!-- LATEST RESULTS -->
    <section class="results-section">
        <div class="section-container">
            <div class="section-heading">
                <span>LATEST RESULTS</span>
                <h2>HOW WE'VE DONE</h2>
            </div>

            {latestResults.length > 0 ? (
                <div class="results-grid">
                    {latestResults.map(({ data }) => {
                        const homeScore = data.homeScore!;
                        const awayScore = data.awayScore!;
                        const outcome = getResultOutcome(
                            data.homeTeam,
                            data.awayTeam,
                            homeScore,
                            awayScore,
                        );
                        const date = formatShortDate(data.matchDate);

                        return (
                            <article class="result-card">
                                <div class="result-date">
                                    <strong>{date.day}</strong>
                                    <span>
                                        {date.month}<br />
                                        {date.year}
                                    </span>
                                </div>

                                <div class="result-teams">
                                    <strong>{data.homeTeam}</strong>
                                    <span>{homeScore} - {awayScore}</span>
                                    <strong>{data.awayTeam}</strong>
                                </div>

                                <div class={`result-status ${outcomeClass(outcome)}`}>
                                    {outcome}
                                </div>

                                <div class="result-venue">
                                    {data.venue}
                                </div>

                                {data.reportUrl && (
                                    <a href={data.reportUrl}>
                                        Read Match Report
                                    </a>
                                )}
                            </article>
                        );
                    })}
                </div>
            ) : (
                <p class="match-meta">
                    No completed results are available yet.
                </p>
            )}
        </div>
    </section>

    <!-- FRIENDLIES -->
    <section class="friendlies-section">
        <div class="section-container">
            <div class="section-heading">
                <span>PRE-SEASON &amp; SPECIAL MATCHES</span>
                <h2>FRIENDLIES</h2>
            </div>

            {upcomingFriendlies.length > 0 ? (
                <div class="friendlies-grid">
                    {upcomingFriendlies.map(({ data }) => {
                        const date = formatShortDate(data.matchDate);

                        return (
                            <article class="friendly-card">
                                <div class="friendly-date">
                                    <strong>{date.day}</strong>
                                    <span>{date.month}<br />{date.year}</span>
                                </div>

                                <div class="friendly-details">
                                    <span class="friendly-label">
                                        FRIENDLY
                                    </span>

                                    <div class="friendly-teams">
                                        <strong>{data.homeTeam}</strong>
                                        <span>VS</span>
                                        <strong>{data.awayTeam}</strong>
                                    </div>

                                    <p>
                                        <i class="fas fa-location-dot"></i>
                                        {data.venue}
                                    </p>
                                </div>

                                <div class="friendly-time">
                                    <strong>{data.kickoffTime}</strong>
                                    <span>
                                        {data.homeTeam.toLowerCase() === "homecity fc"
                                            ? "HOME"
                                            : data.awayTeam.toLowerCase() === "homecity fc"
                                                ? "AWAY"
                                                : "FIXTURE"}
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <p class="match-meta">
                    No upcoming friendly matches have been added.
                </p>
            )}
        </div>
    </section>

    <!-- UPCOMING FIXTURES -->
    <section class="fixtures-section">
        <div class="section-container">
            <div class="section-heading">
                <span>WHAT'S COMING</span>
                <h2>UPCOMING FIXTURES</h2>
            </div>

            {upcomingMatches.length > 0 ? (
                <div class="fixtures-list">
                    {upcomingMatches.map(({ data }) => {
                        const date = formatShortDate(data.matchDate);

                        return (
                            <article class="fixture-row">
                                <div class="fixture-date">
                                    <strong>{date.day}</strong>
                                    <span>{date.month}<br />{date.year}</span>
                                </div>

                                <div class="fixture-teams">
                                    <strong>{data.homeTeam}</strong>
                                    <span>VS</span>
                                    <strong>{data.awayTeam}</strong>
                                </div>

                                <div class="fixture-time">
                                    {data.kickoffTime}
                                </div>

                                <div class="fixture-venue">
                                    {data.venue}
                                    <p>{data.competition}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <p class="match-meta">
                    No upcoming fixtures have been added.
                </p>
            )}

            {(postponedMatches.length > 0 || cancelledMatches.length > 0) && (
                <div class="fixture-notices">
                    {postponedMatches.map(({ data }) => (
                        <p>
                            <strong>POSTPONED:</strong> {data.homeTeam} vs{" "}
                            {data.awayTeam} — {formatMatchDate(data.matchDate)}
                        </p>
                    ))}

                    {cancelledMatches.map(({ data }) => (
                        <p>
                            <strong>CANCELLED:</strong> {data.homeTeam} vs{" "}
                            {data.awayTeam} — {formatMatchDate(data.matchDate)}
                        </p>
                    ))}
                </div>
            )}
        </div>
    </section>

    <!-- LEAGUE TABLE -->
    <section class="table-section">
        <div class="section-container">
            <div class="section-heading">
                <span>LEAGUE STANDINGS</span>
                <h2>THE TABLE</h2>
                <p>{selectedLeague} · {selectedSeason}</p>
            </div>

            {leagueStandings.length > 0 ? (
                <div class="table-wrapper">
                    <table class="league-table">
                        <thead>
                            <tr>
                                <th>POS</th>
                                <th>TEAM</th>
                                <th>P</th>
                                <th>W</th>
                                <th>D</th>
                                <th>L</th>
                                <th>GD</th>
                                <th>PTS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {leagueStandings.map(({ data }) => {
                                const goalDifference =
                                    data.goalsFor - data.goalsAgainst;

                                return (
                                    <tr class={
                                        data.team.toLowerCase() === "homecity fc"
                                            ? "homecity-row"
                                            : ""
                                    }>
                                        <td>{data.position}</td>
                                        <td>
                                            <strong>{data.team}</strong>
                                        </td>
                                        <td>{data.played}</td>
                                        <td>{data.wins}</td>
                                        <td>{data.draws}</td>
                                        <td>{data.losses}</td>
                                        <td>
                                            {goalDifference > 0
                                                ? `+${goalDifference}`
                                                : goalDifference}
                                        </td>
                                        <td>
                                            <strong>{data.points}</strong>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p class="match-meta">
                    Standings have not been added for {selectedLeague}{" "}
                    ({selectedSeason}). Add the team records through the CMS
                    to display the league table.
                </p>
            )}
        </div>
    </section>

    <!-- MATCHDAY CTA -->
    <section
        class="matchday-cta"
        style="background-image: url('/images/matchday.png');"
    >
        <div class="cta-overlay"></div>

        <div class="cta-content">
            <span>MATCHDAY IS BETTER TOGETHER</span>
            <h2>SEE YOU AT KIPARA.</h2>

            <p>
                Bring the energy. Bring the passion.
                Stand with Homecity FC.
            </p>

            <a href="/support" class="cta-button">
                SUPPORT THE CLUB
                <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    </section>
</BaseLayout>
