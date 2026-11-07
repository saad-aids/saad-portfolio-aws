# M. Saad M. Sadik Shaikh — Portfolio & AWS Student Builder Challenge Showcase

> Personal portfolio engineered with the AWS Student Builder Challenge visual identity, featuring interactive persona role-switching, a simulated terminal CLI, grassroots AI education logs, and production-grade cloud architectures.

[![Live Demo](https://img.shields.io/badge/Live_Demo-AWS_Amplify-FF9900?style=for-the-badge&logo=aws-amplify&logoColor=white)]([LIVE_URL])
[![GitHub Stars](https://img.shields.io/github/stars/saad-aids?style=for-the-badge&logo=github&color=100c30)](https://github.com/saad-aids)
[![License: MIT](https://img.shields.io/badge/License-MIT-bafc36?style=for-the-badge&color=bafc36&labelColor=100c30)](LICENSE)

---

## 🌐 Live Demo

The portfolio is deployed on AWS and accessible at:  
👉 **[[LIVE_URL]]([LIVE_URL])**

---

## 🎩 How to Find the Creative Feature

The portfolio includes two distinct signature interactive features:

### 1. The Interactive Hat Rack (Hero Section)
* **Location:** Directly beneath the introductory bio and action buttons in the Hero section (`#hero`).
* **Visual Hint:** A floating neon-lime hint pill labeled **"Psst... try on a hat"** pulses with an animated radar indicator on first load.
* **How to Interact:**
  * **Mouse / Touch:** Click or tap any of the four custom SVG hats:
    1. **The Builder** 👷‍♂️ — AWS cloud backends, Boto3 workflows, and token guardrails.
    2. **The Founder** 🎩 — Practical AI automation for grassroots businesses across Maharashtra.
    3. **The Teacher** 🎓 — Shivkunj AI Initiative demystifying AI for school students.
    4. **The Dealer** 🧢 — Sadik Motors Junnar; the source of mechanical grit and operational discipline.
  * **Keyboard:** Press `Tab` to navigate directly to the hat toolbar. Use `Enter` or `Space` to activate hats.
  * **What Happens:** Selecting a hat dynamically swaps root CSS color variables, updates the hero tagline, and slides in an interactive story card with behind-the-scenes engineering facts.
  * **Secret Easter Egg:** Try on all four hats in a single session to unlock the special **"Full Quad-Persona" achievement banner** with an animated confetti burst!

### 2. The Floating Interactive Terminal CLI (Bottom-Right)
* **Location:** A fixed floating button in the bottom-right corner displaying `>_ type help` with a blinking green cursor.
* **How to Interact:** Click the launcher button or press `Alt + T` (or type in the mobile bottom drawer) to open an in-browser Linux-style terminal.
* **Commands to Try:**
  * `help` — Lists all available shell commands and navigation shortcuts.
  * `about` — Prints Saad's journey from Junnar to AI & AWS leadership.
  * `skills` — Categorized breakdown of cloud, data, and machine learning competencies.
  * `projects` — Dumps the 6 production GitHub repositories and their tech stacks.
  * `hats` — Summarizes the 4 engineering personas.
  * `shivkunj` — Displays the 3-day high school AI education logs and auto-scrolls to the showcase.
  * `theme neon` / `theme pastel` / `theme dark` — Re-skins the entire site's palette on the fly.
  * Suggestion chips are provided above the command prompt for fast one-tap execution on mobile devices.

---

## ⚡ Features

- **AWS Student Builder Challenge Design Identity:** Faithful recreation of the official challenge banner featuring a 60px isometric blueprint grid, multi-point radial mesh gradients (lavender `#c9c5fb` to electric lime `#bafc36`), midnight ink text (`#100c30`), and Space Mono typography.
- **The Interactive Hat Rack:** Stateful persona-switching component that alters theme colors, taglines, and role cards with LocalStorage persistence.
- **Interactive Terminal Emulator:** Built from scratch in pure vanilla JavaScript with history cycling (`Up`/`Down` arrows), autocomplete suggestions, custom theme commands, and smooth scroll integration.
- **Shivkunj AI Initiative 3-Day Milestone Showcase:** Complete documentary of grassroots AI education at 100-year-old Mahatma Jyotirao Phule High School in Pune. Features interactive milestone lock gates with unlock animations for Day 01, Day 02 (Transformers & Shivaji Maharaj AI film), and Day 03 (Grand Graduation & 100+ Certificates).
- **On-Ground Community Video Logs:** Responsive 16:9 on-site video players featuring tech vlogs from AWS Future Builders Connect Pune, Engineers' Day Pune RMC Association, and an AWS Cloud Architecture session attended by 100+ students.
- **Featured Open-Source Projects:** 6 real GitHub repositories from `@saad-aids` showcasing multi-agent AI, cyber scam prevention, computer vision drowsiness detection, weather APIs, and hackathon prototypes.
- **100% Zero-Dependency Web Architecture:** Engineered strictly using native HTML5, modern CSS3, and ES6+ JavaScript—no npm packages, no heavy frameworks, and zero build bloat.
- **Accessibility & Inclusive Design:** Full WCAG 2.1 AA compliance, strictly ordered `h1`–`h4` heading hierarchy, `:focus-visible` keyboard indicators, `prefers-reduced-motion` fallbacks, descriptive image `alt` tags, and tap targets exceeding 44×44px.

---

## 🛠️ Tech Stack

| Technology | Role in Project |
|---|---|
| **HTML5** | Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`), ARIA attributes, structured metadata, and SEO tags. |
| **CSS3** | Vanilla CSS variables (`:root`), fluid typography via `clamp()`, CSS Grid & Flexbox, frosted glass (`backdrop-filter`), and CSS animations. |
| **JavaScript (ES6+)** | DOM manipulation, `IntersectionObserver` ScrollSpy, custom CLI terminal emulator, Canvas confetti engine, and LocalStorage state persistence. |
| **AWS Amplify Hosting** | Automated CI/CD, global edge content distribution, SSL certificate provisioning, and instant cache management. |

---

## ☁️ AWS Services Used

* **AWS Amplify Hosting** — Provides Git-driven continuous deployment with automatic branch builds and instant edge deployment.
* **Amazon CloudFront** — Delivers static website assets globally through 600+ edge locations with ultra-low latency and DDoS protection.
* **AWS Certificate Manager (ACM)** — Automatically provisions, deploys, and renews free SSL/TLS certificates for encrypted HTTPS delivery.
* **Amazon Route 53** — Delivers highly available cloud DNS routing to direct custom domain visitors directly to Amplify distributions.
* **Amazon Simple Storage Service (S3)** — Serves as the high-durability cloud object storage layer managing hosted artifacts under the hood.

---

## 🏛️ Architecture

GitHub push triggers an Amplify build and deploy served through Amplify's global content delivery.

```
┌─────────────────┐       git push        ┌──────────────────────┐
│  Developer Git  ├──────────────────────►│  GitHub Repository   │
│   Workstation   │                       │     (saad-aids)      │
└─────────────────┘                       └──────────┬───────────┘
                                                     │
                                            Webhook  │ Trigger
                                                     ▼
                                          ┌──────────────────────┐
                                          │  AWS Amplify Hosting │
                                          │   Continuous Build   │
                                          └──────────┬───────────┘
                                                     │
                                             Artifact│ Deploy
                                                     ▼
┌─────────────────┐    Sub-50ms Edge Req  ┌──────────────────────┐
│  Global Visitor ◄───────────────────────┤   Amazon CloudFront  │
│ Browser / Client│                       │    Global Edge CDN   │
└─────────────────┘                       └──────────────────────┘
```

---

## 🚀 Run Locally

This project requires no build tools or package managers. Any static HTTP file server can run it immediately:

### 1. Clone the repository
```bash
git clone https://github.com/saad-aids/portfolio.git
cd portfolio
```

### 2. Start a local server

**Using Python (recommended):**
```bash
python -m http.server 8000
```

**Using Node.js:**
```bash
npx serve .
```

**Using PHP:**
```bash
php -S localhost:8000
```

### 3. Open in your browser
Navigate to:
```
http://localhost:8000
```

---

## 📁 Folder Structure

```
c:\aws\
├── .gitignore             # Git exclusion rules for OS, editors, logs, and temp files
├── LICENSE                # MIT License (M. Saad M. Sadik Shaikh)
├── README.md              # Project documentation and AWS architecture overview
├── index.html             # Semantic single-page application entry point (6 sections)
├── styles.css             # Theme tokens, AWS Student Builder mesh styles, and responsive rules
├── script.js              # State machines: Hat Rack, Terminal CLI, Tabs, ScrollSpy, Confetti
└── assets/                # Static visual media and icons
    ├── favicon.svg        # Scalable browser tab icon
    ├── avatar-fallback.svg# Vector avatar fallback
    └── saad.jpg           # High-resolution optimized portrait photo
```

---

## 📸 Screenshots

### Desktop Viewport
![Desktop Viewport Placeholder](https://via.placeholder.com/1200x675/c9c5fb/100c30?text=Desktop+Portfolio+View+%E2%80%94+AWS+Student+Builder+Challenge+Theme)

### Mobile Viewport (360px & 414px)
<p align="center">
  <img src="https://via.placeholder.com/390x844/c9c5fb/100c30?text=Mobile+390px+Responsive+View" width="300" alt="Mobile Viewport Placeholder" />
</p>

### The Interactive Hat Rack
![Interactive Hat Rack Component](https://via.placeholder.com/1000x500/100c30/bafc36?text=Interactive+Hat+Rack+%E2%80%94+Dynamic+Themes+%26+Role+Story+Card)

### Interactive CLI Terminal
![Interactive Terminal Window](https://via.placeholder.com/1000x500/0a0628/bafc36?text=Simulated+Linux+Terminal+CLI+%E2%80%94+guest%40saad%3A%7E%24+help)

---

## 💡 What I Learned

1. **Vanilla Mastery Over Framework Bloat:** Constructing an interactive persona switcher, custom command-line interface, tabbed lock gates, and confetti engine entirely with native DOM APIs proved that modern vanilla JavaScript is exceptionally capable without introducing heavy framework runtimes.
2. **Design System Translation:** Faithfully extracting the visual identity of the AWS Student Builder Challenge (isometric 60px grid, lavender-to-lime ambient radial mesh, high-contrast midnight ink `#100c30`) into reusable CSS custom properties demonstrated the power of scalable design tokens.
3. **Inclusive Front-End Engineering:** Adhering strictly to WCAG 2.1 AA specifications taught me how to combine visual flair with accessible semantics—ensuring keyboard navigability (`:focus-visible`), appropriate color contrast, hierarchical `h1`–`h4` heading order, and respectful reduced-motion accommodations.
4. **Cloud-Native Static Hosting:** Leveraging AWS Amplify Hosting and Amazon CloudFront illustrated the efficiency of automated Git-backed CI/CD pipelines for serverless frontend delivery.

---

## 🥊 Challenges & Fixes

| Challenge | Root Cause | Solution & Engineering Fix |
|---|---|---|
| **Horizontal Scroll on Narrow Viewports (360px)** | Large code snippets, long repository titles, and multi-layer gradient backgrounds expanding past viewport borders. | Implemented `overflow-x: hidden; max-width: 100vw;` on `html` and `body`, wrapped text with `overflow-wrap: break-word`, and clamped header font sizes using fluid CSS `clamp()`. |
| **Touch Target Compliance (WCAG 2.5.5)** | Compact navigation text links on mobile screens were occasionally smaller than the standard 44px hit area. | Added `min-height: 44px` on desktop and `min-height: 48px` on mobile across all `.nav-link`, button, and terminal trigger selectors. |
| **Tab Panel Accessibility & Semantic Enclosure** | In a previous revision, the Day 03 workshop tab panel was detached from its parent tabs container. | Relocated Day 03 inside Section 5 (`.tabs-content`) immediately adjacent to Day 01 and Day 02, restoring correct ARIA relationships (`aria-controls="panelDay3"`). |
| **Video Log Embed Performance & CLS** | Embedding multiple YouTube videos caused render-blocking requests and cumulative layout shifts. | Wrapped all iframes in a fixed `aspect-ratio: 16 / 9` responsive container with native `loading="lazy"` and secure `youtube-nocookie.com` sandboxing. |
| **Motion Accessibility for Animated Features** | Pulsing hint pills and confetti animations could trigger discomfort for users sensitive to motion. | Integrated `@media (prefers-reduced-motion: reduce)` in CSS and verified `window.matchMedia` in JavaScript before initiating any canvas or transform animations. |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.  
Copyright (c) 2026 **M. Saad M. Sadik Shaikh**.
