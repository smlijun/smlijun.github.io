document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSmoothScroll();
    initStickyNav();
    initScrollSpy();
    initReveal();
    const path = window.location.pathname;
    if (path.endsWith('vulnerabilities.html') || path.endsWith('/vulnerabilities')) {
        loadVulnerabilities();
    }
    if (path.endsWith('blog.html') || path.endsWith('/blog')) {
        loadBlog();
    }
});

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Fade in a translucent bottom border on the sticky nav once the page is scrolled.
function initStickyNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const update = () => nav.classList.toggle('scrolled', window.scrollY > 6);
    update();
    window.addEventListener('scroll', update, { passive: true });
}

// Highlight the nav link for whichever section is crossing the middle of the viewport.
function initScrollSpy() {
    const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (!links.length) return;
    const pairs = links
        .map(link => {
            const sec = document.getElementById(link.getAttribute('href').slice(1));
            return sec ? { link, sec } : null;
        })
        .filter(Boolean);
    if (!pairs.length) return;

    let active = null;
    const setActive = link => {
        if (active === link) return;
        if (active) active.classList.remove('active');
        active = link;
        if (link) link.classList.add('active');
    };

    const io = new IntersectionObserver(entries => {
        const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) {
            const pair = pairs.find(p => p.sec === visible[0].target);
            if (pair) setActive(pair.link);
        }
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.05, 0.1] });

    pairs.forEach(p => io.observe(p.sec));
}

// Observe targets and add `.in` as they scroll into view (CSS handles the fade-up).
function revealAll(targets) {
    if (prefersReducedMotion()) return;
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    targets.forEach(t => io.observe(t));
}

function initReveal() {
    revealAll(document.querySelectorAll('header.intro .intro-text, section.block'));
}

function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = cur === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', next);
            applyTheme(next);
        });
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? 'dark' : 'light';
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function renderVuln(vuln) {
    const sev = (vuln.severity || 'medium').toLowerCase();
    const cveText = escapeHtml(vuln.cve);
    const cveCell = vuln.url
        ? `<a href="${escapeHtml(vuln.url)}" target="_blank" rel="noopener">${cveText}</a>`
        : cveText;
    const descHtml = vuln.description
        ? `<span class="desc">${escapeHtml(vuln.description)}</span>`
        : '';
    return `
        <li>
            <div class="cve">${cveCell}</div>
            <div class="title">${escapeHtml(vuln.title)}${descHtml}</div>
            <div class="sev ${sev}">${escapeHtml(sev)}</div>
        </li>
    `;
}

function renderVendor(vendor) {
    const items = vendor.vulnerabilities.map(renderVuln).join('');
    return `
        <section class="vendor-block">
            <h3 class="vendor-name">${escapeHtml(vendor.name)}</h3>
            <p class="vendor-desc">${escapeHtml(vendor.description || '')}</p>
            <ul class="vuln-list">${items}</ul>
        </section>
    `;
}

async function loadBlog() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('post');
    const container = document.getElementById('blog-content');
    const titleEl = document.getElementById('page-title');
    const subEl = document.getElementById('page-sub');
    if (!container) return;

    try {
        const response = await fetch('posts.json');
        const data = await response.json();
        const posts = (data.posts || []).slice().sort((a, b) =>
            (b.date || '').localeCompare(a.date || ''));

        if (slug) {
            const post = posts.find(p => p.slug === slug);
            if (!post) {
                container.innerHTML = '<p class="blog-empty">Post not found.</p>';
                return;
            }
            const md = await fetch(`posts/${post.slug}.md`).then(r => r.text());
            if (titleEl) titleEl.textContent = post.title;
            if (subEl) subEl.textContent = post.date || '';
            container.innerHTML = `
                <article class="blog-post">
                    ${typeof marked !== 'undefined' ? marked.parse(md) : `<pre>${escapeHtml(md)}</pre>`}
                    <p class="blog-back"><a href="blog.html">← all posts</a></p>
                </article>
            `;
            return;
        }

        if (posts.length === 0) {
            if (subEl) subEl.textContent = 'coming soon';
            container.innerHTML = '<p class="blog-empty">No posts yet.</p>';
            return;
        }

        if (subEl) subEl.textContent = `${posts.length} post${posts.length === 1 ? '' : 's'}`;
        container.innerHTML = `
            <ul class="list">
                ${posts.map(p => `
                    <li>
                        <div class="when">${escapeHtml(p.date || '')}</div>
                        <div class="what">
                            <a href="blog.html?post=${encodeURIComponent(p.slug)}">${escapeHtml(p.title)}</a>
                            ${p.summary ? `<span class="venue">${escapeHtml(p.summary)}</span>` : ''}
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    } catch (err) {
        console.error('Failed to load blog:', err);
        container.innerHTML = '<p class="blog-empty">Failed to load posts.</p>';
    }
}

async function loadVulnerabilities() {
    try {
        const response = await fetch('vulnerabilities.json');
        const data = await response.json();

        const totalCVEs = data.vendors.reduce((s, v) => s + v.vulnerabilities.length, 0);
        const totalVendors = data.vendors.length;

        const totalEl = document.getElementById('summary-total-cves');
        if (totalEl) totalEl.textContent = `${totalCVEs}+`;
        const vendEl = document.getElementById('summary-total-vendors');
        if (vendEl) vendEl.textContent = totalVendors;

        const container = document.getElementById('vendors-container');
        if (container) {
            container.innerHTML = data.vendors.map(renderVendor).join('');
            revealAll(container.querySelectorAll('.vendor-block'));
        }
    } catch (error) {
        console.error('Failed to load vulnerabilities:', error);
    }
}
