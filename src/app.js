// src/app.js

// Fetch football data from an open API and display it
async function fetchFootballData() {
    // Fetch both teams and league table concurrently
    const leagueTeamsUrl = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League';
    const leagueTableUrl = 'https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4328&s=2023-2024'; // Example: league table
    try {
        const [teamsRes, tableRes] = await Promise.all([
            fetch(leagueTeamsUrl),
            fetch(leagueTableUrl)
        ]);
        const teamsData = await teamsRes.json();
        const tableData = await tableRes.json();
        const teams = teamsData.teams || [];
        // Optionally, you can use tableData for more info
        renderFootballData(teams);
        renderAdditionalInfo(teams);
    } catch (error) {
        document.getElementById('football-data').innerHTML = '<p class="text-red-500">Failed to load football data.</p>';
    }
}

function renderFootballData(teams) {
    const container = document.getElementById('football-data');
    if (!teams.length) {
        container.innerHTML = '<p>No teams found.</p>';
        return;
    }
    // Add a modal container for popups
    container.innerHTML = `
        <section class="w-full">
            <h3 class="text-lg font-bold mb-4">Football API Data</h3>
            <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                ${teams.map((team, idx) => {
                    let badgeUrl = team.strTeamBadge || team.strBadge || team.strTeamLogo || team.strLogo;
                    if (badgeUrl && badgeUrl.startsWith('http://')) {
                        badgeUrl = badgeUrl.replace('http://', 'https://');
                    }
                    if (!badgeUrl) {
                        badgeUrl = 'https://www.thesportsdb.com/images/media/team/badge/uwrpvw1448813372.png';
                    }
                    return `
                    <section class="border rounded p-4 flex flex-col items-center bg-white shadow hover:shadow-lg transition cursor-pointer h-full" onclick="showTeamPopup(${idx})" aria-label="Team card">
                        <img src="${badgeUrl}" alt="${team.strTeam} badge" class="w-20 h-20 object-contain mb-2" />
                        <header class="font-bold text-center text-lg mb-1">${team.strTeam}</header>
                        <p class="text-sm text-gray-600 text-center mb-1">${team.strCountry} &bull; Founded: ${team.intFormedYear || 'N/A'}</p>
                    </section>
                    `;
                }).join('')}
            </section>
            <section id="team-popup-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
                <section id="team-popup-content" class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
                    <button onclick="closeTeamPopup()" class="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl">&times;</button>
                    <section id="team-popup-body"></section>
                </section>
            </section>
        </section>
    `;
    // Store teams globally for popup access
    window._footballTeams = teams;
}

// Add Premier League info to the aside
function renderAdditionalInfo(teams) {
    const aside = document.querySelector('aside');
    if (!aside) return;
    const numTeams = teams.length;
    const stadiumTeams = teams.filter(t => t.strStadium && t.strTeam).slice(0, 10);
    const cities = teams.map(t => t.strStadiumLocation).filter(Boolean).slice(0, 10);
    const managers = teams.map(t => t.strManager).filter(Boolean).slice(0, 10);
    const years = teams.map(t => t.intFormedYear).filter(Boolean).slice(0, 10);
    const capacities = teams.map(t => t.intStadiumCapacity).filter(Boolean).slice(0, 10);
    const websites = teams.map(t => t.strWebsite).filter(Boolean).slice(0, 10);
    const descriptions = teams.map(t => t.strDescriptionEN).filter(Boolean).slice(0, 2);
    aside.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Premier League Info</h3>
        <p class="mb-2">Number of teams: <b>${numTeams}</b></p>
        <p class="mb-2">Sample stadiums:</p>
        <ul class="list-disc list-inside text-sm text-gray-700 mb-2">
            ${stadiumTeams.map((t, i) => `<li><b>${t.strStadium}</b> (Team: ${t.strTeam}${cities[i] ? `, ${cities[i]}` : ''}${years[i] ? `, Founded: ${years[i]}` : ''}${managers[i] ? `, Manager: ${managers[i]}` : ''}${capacities[i] ? `, Capacity: ${capacities[i]}` : ''}${websites[i] ? `, <a href='${websites[i].startsWith('http') ? websites[i] : 'https://' + websites[i]}' target='_blank' class='text-blue-600 underline'>Website</a>` : ''})</li>`).join('')}
        </ul>
    `;
}

// Show popup with extra info
window.showTeamPopup = function(idx) {
    const team = window._footballTeams[idx];
    let badgeUrl = team.strTeamBadge || team.strBadge || team.strTeamLogo || team.strLogo;
    if (badgeUrl && badgeUrl.startsWith('http://')) {
        badgeUrl = badgeUrl.replace('http://', 'https://');
    }
    if (!badgeUrl) {
        badgeUrl = 'https://www.thesportsdb.com/images/media/team/badge/uwrpvw1448813372.png';
    }
    document.getElementById('team-popup-body').innerHTML = `
        <section class="flex flex-col items-center">
            <img src="${badgeUrl}" alt="${team.strTeam} badge" class="w-24 h-24 object-contain mb-2" />
            <header class="font-bold text-center text-xl mb-1">${team.strTeam}</header>
            <p class="text-sm text-gray-600 text-center mb-1">${team.strCountry} &bull; Founded: ${team.intFormedYear || 'N/A'}</p>
            <p class="text-sm text-gray-700 mb-1"><b>Stadium:</b> ${team.strStadium || 'N/A'}</p>
            <p class="text-xs text-gray-500 mb-1">${team.strDescriptionEN ? team.strDescriptionEN.substring(0, 300) + '...' : ''}</p>
            <nav class="text-xs"><a href="${team.strWebsite ? (team.strWebsite.startsWith('http') ? team.strWebsite : 'https://' + team.strWebsite) : '#'}" target="_blank" class="text-blue-600 hover:underline">${team.strWebsite ? 'Website' : ''}</a></nav>
        </section>
    `;
    document.getElementById('team-popup-modal').classList.remove('hidden');
}

window.closeTeamPopup = function() {
    document.getElementById('team-popup-modal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    fetchFootballData();
});