# Natan Alfarizqi — Personal Portfolio

A clean, minimal personal portfolio with live Discord presence integration.

## Features

- **Discord Live Status** — real-time avatar, status, activity, and Spotify via [Lanyard API](https://github.com/Phineas/lanyard)
- **GitHub Integration** — profile stats, repositories, stars, and followers via GitHub API
- **Tech Stack Marquee** — animated scrolling tech & tools showcase
- **Click Sound** — subtle audio feedback on interactive elements
- **Responsive** — optimized for mobile, tablet, and desktop
- **Dark Theme** — black background with pink accent

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Lanyard REST API
- GitHub REST API
- Google Fonts (Inter)

## Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/cxvu/Portfolio.git
   ```
2. Open `index.html` in a browser

## Deploy to GitHub Pages

1. Push to GitHub
2. Go to **Settings > Pages**
3. Set source to **Deploy from a branch**
4. Select branch `main` and folder `/ (root)`
5. Save — your site will be live at `https://cxvu.github.io/portfolio`

## Configuration

Edit `script.js` to customize:

```js
const PERSON_INFO = {
  discordId: 'YOUR_DISCORD_ID'
};
const GITHUB_USERNAME = 'YOUR_GITHUB_USERNAME';
```
