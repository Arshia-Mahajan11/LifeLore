# Reset Arc

Reset Arc is a personal growth RPG built with React and Vite. Users describe
their lifestyle and goals, receive an original anime-inspired character, sign
a challenge contract, and complete daily quests to earn XP and grow stats.

## Features

- Lifestyle questionnaire covering sleep, movement, energy, stress, routine,
  distractions, and available time
- Goal areas for health, education, mindset, career, relationships, and
  creativity
- Anime-inspired character based on the selected primary focus
- 7-, 21-, or 30-day challenge contracts
- Soft, Steady, and Iron stakes with different shield counts and XP penalties
- Signature pad that works with touch or mouse
- Three daily quests, each worth 10 XP
- +20 XP bonus for completing every quest in a day
- Stats increase when quests are completed
- Character upgrades at levels 3, 5, and 7:
  - Level 3: gear
  - Level 5: cape and aura
  - Level 7: crown
- Shield and XP consequences for days with fewer than half the quests complete
- Before-and-after character and stat comparison
- Progress saved in the browser using localStorage
- GitHub Pages deployment workflow included

## Run locally

Install Node.js 20 or newer, then run:

```bash
npm install
npm run dev
```

Open the local URL shown in your terminal.

To create a production build:

```bash
npm run build
```

## Upload to GitHub

Create a new GitHub repository, then run these commands from the project folder:

```bash
git init
git add .
git commit -m "Build Reset Arc"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub details.

To publish the site, open the repository's **Settings → Pages** and set the
build and deployment source to **GitHub Actions**. The workflow in
`.github/workflows/deploy.yml` will deploy the site after you push to `main`.

## Privacy and scope

This version does not use a server or database. Questionnaire answers,
challenge progress, and the signature are saved in the current browser using
localStorage. Clearing browser data will erase that saved progress.

The app is for reflection and habit-building. It is not medical, mental
health, or educational advice.
