# Aurateori 

Create a modern, full-featured Swedish Driver's License Theory App ("Körkortskollen"). 

### Target & Design Style

- Concept: Preparation app for the Swedish B-driver's license (Personbil) theory exam.

- Design: Mobile-first responsive UI, clean SaaS aesthetic, clear typography, dark/light mode, smooth animations, and intuitive navigation via a bottom navigation bar on mobile / sidebar on desktop.

### Core Features & Pages

1. **Dashboard (Start)**

   - Progress gauge showing "Körkortsklarhet" (Readiness % for Trafikverket exam).

   - Quick stats grid: Total questions answered, accuracy rate (%), active streak (days).

   - Action cards: "Snabbquiz", "Fullständigt Prov (65 frågor)", "Vägmärken".

2. **Quiz Engine (Övningsfrågor)**

   - Category filtering: Vägmärken, Trafikregler, Miljö, Människan & Trafiken, Fordonskännedom.

   - Interactive question view: Image/diagram display, 4 multiple-choice answers, progress indicator.

   - Immediate feedback showing explanation and exact rule reference after answering.

3. **Examsimulator (Trafikverket-prov)**

   - 65 questions timer-based test (50 minutes).

   - Pass limit indicator: Requires 52/65 to pass.

   - Summary view at the end with detailed breakdown of correct/incorrect answers by category.

4. **Vägmärkesarkiv (Road Sign Library)**

   - Filterable gallery (Varningsmärken, Förbudsmärken, Påbudsmärken, Anvisningsmärken, Information).

   - Search bar for quick lookup.

   - Detail modal showing sign image, name, meaning, and common exam traps.

5. **Flashcards (Snabbplugg)**

   - Interactive flip cards for rapid road sign and definition testing.

6. **Statistik & Svaga punkter**

   - Visual charts showing performance history over time.

   - Dedicated "Repetera felaktiga svar"-queue for spaced repetition.

### Initial Mock Data (In Swedish)

- Include at least 15 realistic Swedish theory questions with realistic images/placeholders, options, correct answers, and Swedish explanations.

- Include 15+ Swedish road signs across standard categories with accurate names and explanations.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://aurateori.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a2ad1180-7685-4c94-af9f-df38ecb75cf5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
