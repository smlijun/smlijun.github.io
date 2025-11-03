document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSmoothScroll();
    initScrollAnimations();
    loadVulnerabilityStats();
    
    if (window.location.pathname.includes('vulnerabilities.html')) {
        loadVulnerabilities();
    }
});

async function loadVulnerabilityStats() {
    try {
        const response = await fetch('vulnerabilities.json');
        const data = await response.json();
        
        const totalCVEs = data.vendors.reduce((sum, vendor) => sum + vendor.vulnerabilities.length, 0);
        const totalVendors = data.vendors.length;
        
        const totalCVEsElement = document.getElementById('total-cves');
        const totalVendorsElement = document.getElementById('total-vendors');
        const ctaCVECountElement = document.getElementById('cta-cve-count');
        
        if (totalCVEsElement) {
            totalCVEsElement.textContent = `${totalCVEs}+`;
        }
        
        if (totalVendorsElement) {
            totalVendorsElement.textContent = totalVendors;
        }
        
        if (ctaCVECountElement) {
            ctaCVECountElement.textContent = `${totalCVEs}+`;
        }
        
    } catch (error) {
        console.error('Failed to load vulnerability stats:', error);
    }
}

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.stat-card, .research-card, .timeline-item, .competition-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function getVendorLogo(logoType) {
    const logos = {
        microsoft: `
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="18" height="18" fill="#00A4EF"/>
                <rect x="22" width="18" height="18" fill="#FFB900"/>
                <rect y="22" width="18" height="18" fill="#7FBA00"/>
                <rect x="22" y="22" width="18" height="18" fill="#F25022"/>
            </svg>
        `,
        apple: `
            <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                <path d="M30.5 19.9c0-3.8 3.1-5.6 3.2-5.7-1.8-2.6-4.5-3-5.5-3-2.3-.2-4.5 1.4-5.7 1.4-1.2 0-3-1.3-5-1.3-2.5.1-4.9 1.5-6.2 3.8-2.6 4.6-.7 11.4 1.9 15.1 1.3 1.8 2.8 3.9 4.8 3.8 1.9-.1 2.7-1.2 5-1.2 2.3 0 3 1.2 5 1.2 2.1 0 3.4-1.9 4.6-3.7 1.5-2.1 2.1-4.1 2.1-4.2-.1 0-4-.1-4-6.2zM26.6 8.8c1.1-1.3 1.8-3.1 1.6-4.9-1.5.1-3.4 1-4.5 2.3-1 1.1-1.8 2.9-1.6 4.6 1.7.1 3.4-.9 4.5-2z"/>
            </svg>
        `,
        oss: `
            <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                <path d="M20 3C10.6 3 3 10.6 3 20s7.6 17 17 17 17-7.6 17-17S29.4 3 20 3zm0 2c8.3 0 15 6.7 15 15s-6.7 15-15 15S5 28.3 5 20 11.7 5 20 5zm-1 5v6h-6v4h6v6h4v-6h6v-4h-6v-6h-4z"/>
            </svg>
        `,
        enterprise: `
            <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                <rect x="5" y="10" width="30" height="25" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                <rect x="10" y="15" width="7" height="5" fill="currentColor"/>
                <rect x="23" y="15" width="7" height="5" fill="currentColor"/>
                <rect x="10" y="23" width="7" height="5" fill="currentColor"/>
                <rect x="23" y="23" width="7" height="5" fill="currentColor"/>
            </svg>
        `
    };
    return logos[logoType] || logos.oss;
}

function getSeverityClass(severity) {
    const map = {
        'critical': 'severity-critical',
        'high': 'severity-high',
        'medium': 'severity-medium',
        'low': 'severity-low'
    };
    return map[severity.toLowerCase()] || 'severity-medium';
}

function createVulnerabilityCard(vuln) {
    const cardClass = vuln.highlight ? 'vuln-card vuln-card-highlight' : 'vuln-card';
    const cveLink = vuln.url ? `<a href="${vuln.url}" target="_blank" class="vuln-cve">${vuln.cve}</a>` : `<span class="vuln-cve">${vuln.cve}</span>`;
    
    let detailsHtml = '';
    if (vuln.details && vuln.details.length > 0) {
        detailsHtml = `
            <ul class="vuln-details">
                ${vuln.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
        `;
    }

    let descriptionHtml = '';
    if (vuln.description) {
        descriptionHtml = `<p class="vuln-description">${vuln.description}</p>`;
    }

    const tagsHtml = vuln.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

    return `
        <div class="${cardClass}">
            <div class="vuln-header">
                ${cveLink}
                <span class="vuln-severity ${getSeverityClass(vuln.severity)}">${vuln.severity}</span>
            </div>
            <h3 class="vuln-title">${vuln.title}</h3>
            ${descriptionHtml}
            ${detailsHtml}
            <div class="vuln-tags">
                ${tagsHtml}
            </div>
        </div>
    `;
}

function createVendorSection(vendor, isLight) {
    const sectionClass = isLight ? 'section section-light' : 'section';
    const logoClass = vendor.logo === 'apple' ? 'vendor-logo apple-logo' : 
                      vendor.logo === 'oss' ? 'vendor-logo oss-logo' : 
                      vendor.logo === 'enterprise' ? 'vendor-logo enterprise-logo' : 
                      'vendor-logo';

    const vulnerabilitiesHtml = vendor.vulnerabilities.map(vuln => createVulnerabilityCard(vuln)).join('');

    return `
        <section class="${sectionClass}">
            <div class="container">
                <div class="vendor-section">
                    <div class="vendor-header">
                        <div class="${logoClass}">
                            ${getVendorLogo(vendor.logo)}
                        </div>
                        <div>
                            <h2>${vendor.name}</h2>
                            <p class="vendor-description">${vendor.description}</p>
                        </div>
                    </div>
                    <div class="vuln-grid">
                        ${vulnerabilitiesHtml}
                    </div>
                </div>
            </div>
        </section>
    `;
}

async function loadVulnerabilities() {
    try {
        const response = await fetch('vulnerabilities.json');
        const data = await response.json();
        
        const totalCVEs = data.vendors.reduce((sum, vendor) => sum + vendor.vulnerabilities.length, 0);
        const totalVendors = data.vendors.length;
        const enterpriseBugs = data.vendors
            .find(v => v.id === 'enterprise')?.vulnerabilities
            .find(v => v.cve === 'NDA')?.description.match(/\d+/)?.[0] || '70+';

        const summaryTotalCVEs = document.querySelector('#summary-total-cves');
        const summaryTotalVendors = document.querySelector('#summary-total-vendors');
        
        if (summaryTotalCVEs) {
            summaryTotalCVEs.textContent = `${totalCVEs}+`;
        }
        
        if (summaryTotalVendors) {
            summaryTotalVendors.textContent = totalVendors;
        }

        const vendorsContainer = document.getElementById('vendors-container');
        if (vendorsContainer) {
            vendorsContainer.innerHTML = data.vendors.map((vendor, index) => 
                createVendorSection(vendor, index % 2 === 0)
            ).join('');
        }

        initScrollAnimations();
    } catch (error) {
        console.error('Failed to load vulnerabilities:', error);
    }
}

