// Scroll reveal
const fades = document.querySelectorAll('.fade');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.1 });
fades.forEach(el => io.observe(el));

// Hero loads immediately
document.querySelector('.hero').classList.add('in');

// Active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ── GitHub API: auto-fetch and render projects ──────────────────────────────

const GITHUB_USER = 'chakri192';
const SKIP_REPOS = ['chakri192', 'portfolio-website'];

const LANG_DOT = {
  'C':          'lang-c',
  'Python':     'lang-py',
  'JavaScript': 'lang-js',
  'HTML':       'lang-html',
  'Shell':      'lang-sh',
};

function langDotClass(lang) {
  return LANG_DOT[lang] || 'lang-c';
}

function makeProjectItem(repo) {
  const dot = repo.language ? `<span class="lang-dot ${langDotClass(repo.language)}"></span>` : '';
  const desc = repo.description || 'No description provided.';
  const tags = [];
  if (repo.language) tags.push(repo.language);
  if (repo.topics && repo.topics.length) repo.topics.slice(0, 4).forEach(t => tags.push(t));

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
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`
    );
    if (!res.ok) throw new Error('API error');
    const repos = await res.json();
    const filtered = repos.filter(r => !r.fork && !SKIP_REPOS.includes(r.name));

    if (!filtered.length) {
      list.innerHTML = '<div class="project-item fade in"><div><div class="project-desc" style="color:var(--text-2)">No projects found.</div></div></div>';
      return;
    }

    list.innerHTML = filtered.map(makeProjectItem).join('');
  } catch (e) {
    list.innerHTML = '<div class="project-item fade in"><div><div class="project-desc" style="color:var(--text-2)">Could not load projects.</div></div></div>';
  }
}

renderProjects();
