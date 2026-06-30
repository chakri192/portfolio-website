// ── Theme: apply saved preference before first paint ──────────────────────────
(function () {
  if (localStorage.getItem('theme') === 'light')
    document.documentElement.setAttribute('data-theme', 'light');
})();

// ── Theme toggle ──────────────────────────────────────────────────────────────
const MOON = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
const SUN  = `
  <circle cx="12" cy="12" r="5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;

function isLight() {
  return document.documentElement.getAttribute('data-theme') === 'light';
}

function syncIcon() {
  const icon = document.getElementById('toggle-icon');
  if (icon) icon.innerHTML = isLight() ? SUN : MOON;
}

document.addEventListener('DOMContentLoaded', () => {
  syncIcon();
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (isLight()) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
    syncIcon();
  });
});

// ── Scroll reveal ─────────────────────────────────────────────────────────────
const fades = document.querySelectorAll('.fade');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.1 });
fades.forEach(el => io.observe(el));

document.querySelector('.hero').classList.add('in');

// ── Active nav highlight ──────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ── GitHub API ────────────────────────────────────────────────────────────────
const GITHUB_USER = 'chakri192';
const SKIP_REPOS  = ['chakri192', 'portfolio-website'];

const LANG_DOT = {
  'C':          'lang-c',
  'Python':     'lang-py',
  'JavaScript': 'lang-js',
  'HTML':       'lang-html',
  'Shell':      'lang-sh',
};

function langDotClass(lang) { return LANG_DOT[lang] || 'lang-c'; }

function makeProjectItem(repo) {
  const dot  = repo.language ? `<span class="lang-dot ${langDotClass(repo.language)}"></span>` : '';
  const desc = repo.description || 'No description provided.';
  const tags = [];
  if (repo.language) tags.push(repo.language);
  if (repo.topics?.length) repo.topics.slice(0, 4).forEach(t => tags.push(t));

  return `
    <div class="project-item fade in">
      <div>
        <div class="project-name">${dot}${repo.name}</div>
        <div class="project-desc">${desc}</div>
        <div class="project-tags">
          ${tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
      </div>
      <a href="${repo.html_url}" target="_blank" class="project-link">View &nearr;</a>
    </div>
  `;
}

async function renderProjects() {
  const list = document.getElementById('projects-list');
  if (!list) return;
  try {
    const res  = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`);
    if (!res.ok) throw new Error('API error');
    const repos    = await res.json();
    const filtered = repos.filter(r => !r.fork && !SKIP_REPOS.includes(r.name));
    list.innerHTML = filtered.length
      ? filtered.map(makeProjectItem).join('')
      : '<div class="project-item fade in"><div><div class="project-desc" style="color:var(--text-2)">No projects found.</div></div></div>';
  } catch {
    list.innerHTML = '<div class="project-item fade in"><div><div class="project-desc" style="color:var(--text-2)">Could not load projects.</div></div></div>';
  }
}

renderProjects();
