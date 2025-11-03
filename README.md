# DongJun Kim - Personal Portfolio

A modern, professional personal website showcasing security research, vulnerability disclosures, and professional experience.

## Features

- **Responsive Design**: Mobile-friendly layout with modern UI/UX
- **Dynamic Vulnerability Management**: JSON-based vulnerability database for easy updates
- **Smooth Animations**: Scroll-triggered animations and smooth transitions
- **Professional Styling**: Inspired by MSRC, Toss, and Palantir design systems

## Structure

```
.
├── index.html              # Main homepage
├── vulnerabilities.html    # Vulnerability disclosures page
├── vulnerabilities.json    # Vulnerability database (edit this to add new CVEs)
├── styles.css             # Global styles
├── main.js                # JavaScript functionality
└── README.md              # This file
```

## How to Add New Vulnerabilities

Simply edit `vulnerabilities.json` to add or update vulnerability information:

```json
{
  "vendors": [
    {
      "id": "microsoft",
      "name": "Microsoft",
      "description": "Windows kernel and user-mode privilege escalation vulnerabilities",
      "logo": "microsoft",
      "vulnerabilities": [
        {
          "cve": "CVE-2025-XXXXX",
          "title": "Vulnerability Title",
          "description": "Optional description",
          "severity": "high",
          "tags": ["Windows", "LPE"],
          "url": "https://msrc.microsoft.com/..."
        }
      ]
    }
  ]
}
```

### Vulnerability Fields

- **cve**: CVE identifier or other reference (e.g., "CVE-2025-12345", "ZDI-CAN-12345", "NDA")
- **title**: Short vulnerability title
- **description**: (Optional) Detailed description
- **severity**: "critical", "high", "medium", or "low"
- **tags**: Array of tags for categorization
- **url**: (Optional) Link to advisory or disclosure
- **highlight**: (Optional) Set to `true` for special highlighting
- **details**: (Optional) Array of bullet points for additional information

## Deployment

### GitHub Pages

1. Push all files to your GitHub repository
2. Go to repository Settings → Pages
3. Select the branch (usually `main`) and root folder
4. Your site will be available at `https://yourusername.github.io/repository-name/`

### Custom Domain

1. Add a `CNAME` file with your domain name
2. Configure DNS settings with your domain provider
3. Enable "Enforce HTTPS" in GitHub Pages settings

## Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #0064FF;
    --secondary-color: #202632;
    /* ... */
}
```

### Profile Photo

Replace the SVG placeholder in `index.html` with an `<img>` tag:

```html
<div class="profile-card">
    <img src="path/to/your/photo.jpg" alt="Profile Photo" style="width: 200px; border-radius: 50%;">
</div>
```

## Technologies Used

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Google Fonts (Inter)

## License

All content is proprietary. Please do not reuse without permission.

---

© 2025 DongJun Kim. All rights reserved.

