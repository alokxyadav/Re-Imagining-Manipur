# Re-Imagining Manipur

**A Digital Tourism Platform for Discovering Manipur, India.**

Re-Imagining Manipur is an interactive, responsive tourism web application developed for the **Re-Imagining Manipur Hackathon 2026**, organised by the Department of Information Technology and Department of Tourism, Government of Manipur, with ManipurTech Innovation Foundation as knowledge partner.

The platform brings together destination discovery, cultural information, travel planning and accommodation details to make exploring Manipur easier and more accessible.

## Features

- **Destination Discovery:** Explore 14 curated destinations around Imphal with search and category filters.
- **Trip Planner:** Generate day-wise itineraries based on travel duration and interests, with estimated budgets.
- **Travel Information:** Access accommodation details, transportation information and emergency contacts.
- **Culture & Heritage:** Discover local history, festivals, cuisine and cultural attractions.
- **Traveller Tools:** Packing checklist, calendar export, printable itineraries and WhatsApp sharing.
- **Progressive Web App:** Installable experience with offline access to previously visited pages.
- **Administration Dashboard:** Interfaces for managing accommodation listings and moderating traveller reviews.
- **Responsive Design:** Mobile-friendly interface with light and dark themes and accessibility options.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive design |
| JavaScript | Interactive functionality |
| Node.js | Build scripts and testing |
| npm | Dependency management |
| jsdom | Application testing |

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/alokxyadav/Re-Imagining-Manipur.git
```

**2. Navigate to the project**

```bash
cd Re-Imagining-Manipur
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the local server**

```bash
python3 -m http.server 8000
```

**5. Open in your browser**

```text
http://localhost:8000
```

## Testing & Build

Run the automated tests:

```bash
npm test
```

Generate production files:

```bash
npm run build
```

To generate production files with a deployment URL:

```bash
npm run build -- https://your-domain.com
```

## Project Structure

```text
Re-Imagining-Manipur/
├── index.html          # Main tourism application
├── admin.html          # Administration dashboard
├── places/             # Destination pages
├── scripts/            # Build scripts
├── tests/              # Automated tests
├── workflows/          # Workflow files
├── manifest.json       # PWA configuration
├── sw.js               # Service worker
├── icon.svg            # Application icon
├── privacy.html        # Privacy policy
├── terms.html          # Terms and conditions
├── robots.txt          # Search engine instructions
├── package.json        # Project configuration
├── CHANGELOG.md        # Change history
├── LICENSE             # MIT License
└── README.md
```

## Deployment

The application can be deployed on static hosting platforms such as:

- GitHub Pages
- Netlify
- Cloudflare Pages

For GitHub Pages, configure the repository's Pages settings and deployment workflow according to your hosting configuration.

## Project Limitations

This project is currently a frontend-focused hackathon prototype.

- Authentication requires a properly configured authentication provider for real email verification.
- Demo OTP authentication is not secure.
- Application data is stored locally in the browser.
- The administration dashboard does not provide production-grade access control.
- A production deployment requires a secure backend, database and server-side authorization.

## Future Scope

- AI-powered travel recommendations.
- Interactive maps and navigation.
- Multilingual support.
- Centralized database and backend integration.
- Secure authentication and administration.
- Real-time tourism and accommodation services.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run the available tests.
5. Submit a pull request with a description of your changes.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgements

Developed in connection with the Re-Imagining Manipur Hackathon 2026.

We acknowledge the Department of Information Technology, Government of Manipur, Department of Tourism, Government of Manipur, and ManipurTech Innovation Foundation.

**Disclaimer:** This is an independent hackathon prototype and is not an official Government of Manipur website or publication.

---

**Repository:** [alokxyadav/Re-Imagining-Manipur](https://github.com/alokxyadav/Re-Imagining-Manipur)
