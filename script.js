/* ============================================
   PORTFOLIO JS - NATAN ALFARIZQI
   Navigation, Tech Stack, Discord, GitHub
   ============================================ */

// --- 1. CONFIGURATION ---
const PERSON_INFO = {
  discordId: '304067207120289814'
};
const GITHUB_USERNAME = 'cxvu';
const GITHUB_API_BASE = 'https://api.github.com';

function escapeHtml(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// --- 2. TECH STACK DATA ---
const TECH_STACK = [
  { name: 'HTML5', img: 'img/tech/html.png' },
  { name: 'CSS3', img: 'img/tech/css.png' },
  { name: 'JavaScript', img: 'img/tech/javascript.png' },
  { name: 'Node.js', img: 'img/tech/nodejs.png' },
  { name: 'Next.js', img: 'img/tech/nextjs.png' },
  { name: 'Tailwind', img: 'img/tech/tailwind.png' },
  { name: 'Python', img: 'img/tech/python.png' },
  { name: 'GitHub', img: 'img/tech/github.png' },
  { name: 'Cloudflare', img: 'img/tech/cloudflare.png' },
  { name: 'Vercel', img: 'img/tech/vercel.png' },
  { name: 'NPM', img: 'img/tech/npm.png' },
  { name: 'Bun', img: 'img/tech/bunjs.png' },
  { name: 'VS Code', img: 'img/tech/vscode.png' },
  { name: 'Notepad++', img: 'img/tech/notepadplusplus.png' },
  { name: 'Sublime Text', img: 'img/tech/sublimetext.png' }
];

// --- 4. DOM ELEMENTS ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// --- 5. PAGE NAVIGATION ---
function initNavigation() {
  const navItems = $$('.nav-item');
  const pages = $$('.page');

  function navigateTo(pageId) {
    navItems.forEach(item => item.classList.remove('active'));
    pages.forEach(page => page.classList.remove('active'));
    const activeNav = $(`.nav-item[data-page="${pageId}"]`);
    const activePage = $(`#page-${pageId}`);
    if (activeNav) activeNav.classList.add('active');
    if (activePage) activePage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

  const hash = window.location.hash.replace('#', '');
  if (hash && $(`#page-${hash}`)) navigateTo(hash);
  else navigateTo('profile');
}

// --- 6. TECH STACK RENDERING ---
function renderTechStack() {
  const track = $('#tech-track');
  if (!track) return;
  const items = TECH_STACK.map(tech =>
    `<div class="tech-item">
      <img class="tech-icon" src="${tech.img}" alt="${tech.name}" draggable="false">
      <span>${tech.name}</span>
    </div>`
  ).join('');
  track.innerHTML = items + items;
}

// --- 7. DISCORD (Lanyard REST) ---
function statusDotHtml(statusValue) {
  switch (statusValue) {
    case "online":
      return `<div class="status-dot online-dot" aria-label="online"></div>`;
    case "idle":
      return `<div class="status-dot idle-dot" aria-label="idle"></div>`;
    case "dnd":
      return `<div class="status-dot dnd-dot" aria-label="dnd"></div>`;
    case "streaming":
      return `<div class="status-dot streaming-dot" aria-label="streaming"></div>`;
    case "offline":
    default:
      return `<div class="status-dot offline-dot" aria-label="offline"></div>`;
  }
}

function getDiscordStatusLabel(statusValue) {
  switch (statusValue) {
    case "online": return "Online";
    case "idle": return "Idle";
    case "dnd": return "Dnd";
    case "streaming": return "Streaming";
    case "offline": default: return "Offline";
  }
}

async function loadDiscordStatus() {
  const avatarEl = $('#discord-avatar');
  const nameEl = $('#discord-display-name');
  const wrap = document.getElementById("discord-status");

  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${PERSON_INFO.discordId}?t=${Date.now()}`);
    const json = await res.json();
    if (!json.success) throw new Error('Lanyard error');
    const d = json.data;

    if (nameEl) nameEl.textContent = d.discord_user?.global_name || d.discord_user?.username || 'Unknown';
    if (avatarEl && d.discord_user?.avatar) {
      const ext = d.discord_user.avatar.startsWith('a_') ? 'gif' : 'png';
      avatarEl.src = `https://cdn.discordapp.com/avatars/${PERSON_INFO.discordId}/${d.discord_user.avatar}.${ext}?size=256`;
    }

    // Status dot
    if (wrap) {
      const activities = d.activities || [];
      const isStreaming = activities.some((a) => a.type === 1);
      const statusForIcon = isStreaming ? "streaming" : d.discord_status;
      const customStatus = activities.find((a) => a.type === 4)?.state || null;
      wrap.innerHTML = `
        <div class="status-inline">
          <div class="status-dot-group">${statusDotHtml(statusForIcon)}</div>
          <span class="status-text">${escapeHtml(getDiscordStatusLabel(statusForIcon))}</span>
          ${customStatus ? `<span class="status-custom">- ${escapeHtml(customStatus)}</span>` : ""}
        </div>`;
    }

    const actSection = $('#activity-section');
    const actCard = $('#discord-activity');
    const activities = d.activities || [];
    const nonSpotify = activities.filter(a => a.name !== 'Spotify');
    if (actSection && actCard) {
      if (nonSpotify.length > 0) {
        actSection.style.display = 'block';
        const act = nonSpotify[0];
        actCard.innerHTML = `
          <div class="activity-type">${act.type === 0 ? 'Playing' : act.type === 1 ? 'Streaming' : act.type === 2 ? 'Listening' : act.type === 3 ? 'Watching' : 'Activity'}</div>
          <div class="activity-name">${escapeHtml(act.name)}</div>
          ${act.details ? `<div class="activity-details">${escapeHtml(act.details)}</div>` : ''}
          ${act.state ? `<div class="activity-details">${escapeHtml(act.state)}</div>` : ''}
          ${act.assets?.large_image ? `<img class="activity-image" src="https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.large_image}.png" alt="${escapeHtml(act.name)}" onerror="this.style.display='none'">` : ''}
        `;
      } else { actSection.style.display = 'none'; }
    }

    const spotSection = $('#spotify-section');
    const spotCard = $('#spotify-activity');
    const spotify = activities.find(a => a.name === 'Spotify');
    if (spotSection && spotCard) {
      if (spotify) {
        spotSection.style.display = 'block';
        const song = spotify.assets?.large_image ? `https://i.scdn.co/image/${spotify.assets.large_image.replace('spotify:', '')}` : '';
        spotCard.innerHTML = `
          ${song ? `<img class="album-art" src="${song}" alt="Album art">` : ''}
          <div class="spotify-info">
            <div class="track-name">${escapeHtml(spotify.details || 'Unknown Track')}</div>
            <div class="artist-name">${escapeHtml(spotify.state || 'Unknown Artist')}</div>
          </div>
        `;
      } else { spotSection.style.display = 'none'; }
    }

  } catch (err) {
    console.error('Error fetching Discord:', err);
  }
}

// --- 8. GITHUB API INTEGRATION ---
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', HTML: '#e34c26',
  CSS: '#563d7c', Java: '#b07219', 'C++': '#f34b7d', C: '#555555', Go: '#00ADD8',
  Rust: '#dea584', PHP: '#4F5D95', Ruby: '#701516', Swift: '#F05138',
  Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051', Lua: '#000080',
  'Jupyter Notebook': '#DA5B0B', 'C#': '#178600', Vue: '#41b883', Svelte: '#ff3e00',
};

async function fetchGitHubData() {
  const cache = { repos: [], user: null, totalStars: 0, languages: {} };
  try {
    const userRes = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
    if (userRes.ok) cache.user = await userRes.json();

    const reposRes = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
    if (reposRes.ok) cache.repos = await reposRes.json();

    cache.totalStars = cache.repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

    cache.repos.forEach(repo => {
      if (repo.language) {
        cache.languages[repo.language] = (cache.languages[repo.language] || 0) + 1;
      }
    });
  } catch (e) { console.warn('GitHub API error:', e); }
  return cache;
}

function animateNumber(el, target, duration = 800) {
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function renderRepos(repos) {
  const list = $('#repos-list');
  if (!list) return;
  const top = repos.filter(r => !r.fork).slice(0, 10);
  if (!top.length) { list.innerHTML = '<div class="repo-loading">No public repositories</div>'; return; }
  list.innerHTML = top.map(r => {
    const lang = r.language || 'Unknown';
    const color = LANG_COLORS[lang] || '#888';
    const desc = r.description ? `<div class="repo-desc">${escapeHtml(r.description.slice(0, 120))}</div>` : '';
    return `
      <a href="${r.html_url}" class="repo-card" target="_blank" rel="noopener noreferrer">
        <div class="repo-card-top">
          <span class="repo-icon">📁</span>
          <span class="repo-name">${escapeHtml(r.name)}</span>
        </div>
        ${desc}
        <div class="repo-bottom">
          <span class="repo-lang"><span class="lang-dot" style="background:${color}"></span>${lang}</span>
          <span>⭐ ${r.stargazers_count || 0}</span>
          <span>🍴 ${r.forks_count || 0}</span>
        </div>
      </a>`;
  }).join('');
}

async function updateStats() {
  const statsEls = $$('[data-github]');
  statsEls.forEach(el => el.classList.add('stat-loading'));

  const gh = await fetchGitHubData();

  statsEls.forEach(el => el.classList.remove('stat-loading'));

  if (gh.user) {
    const reposEl = $('[data-github="repos"]');
    const starsEl = $('[data-github="stars"]');
    const followersEl = $('[data-github="followers"]');
    const followingEl = $('[data-github="following"]');

    if (reposEl) animateNumber(reposEl, gh.user.public_repos || 0);
    if (starsEl) animateNumber(starsEl, gh.totalStars);
    if (followersEl) animateNumber(followersEl, gh.user.followers || 0);
    if (followingEl) animateNumber(followingEl, gh.user.following || 0);

    const avatar = $('#gh-avatar');
    const name = $('#gh-name');
    const username = $('#gh-username');
    const bio = $('#gh-bio');
    const location = $('#gh-location');
    const joined = $('#gh-joined');

    if (avatar) { avatar.src = gh.user.avatar_url; avatar.alt = gh.user.login; }
    if (name) name.textContent = gh.user.name || gh.user.login;
    if (username) username.textContent = `@${gh.user.login}`;
    if (bio) bio.textContent = gh.user.bio || '';
    if (location && gh.user.location) location.textContent = `📍 ${gh.user.location}`;
    else if (location) location.style.display = 'none';
    if (joined && gh.user.created_at) {
      const d = new Date(gh.user.created_at);
      joined.textContent = `Joined ${d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    }
  }

  renderRepos(gh.repos);

  const ghHandle = $('#github-handle');
  if (ghHandle && gh.user) ghHandle.textContent = `@${gh.user.login}`;
}

// --- 9. CLICK SOUND ---
function initClickSound() {
  const clickAudio = new Audio('audio/click.ogg');
  clickAudio.volume = 0.5;
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, .nav-item, .project-btn, .social-card, .tech-item');
    if (target) {
      clickAudio.currentTime = 0;
      clickAudio.play().catch(() => {});
    }
  });
}

// --- 10. INIT ---
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderTechStack();
  loadDiscordStatus();
  setInterval(loadDiscordStatus, 30000);
  updateStats();
  initClickSound();
});
