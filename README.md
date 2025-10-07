# Breakfast First! An Absurdist Breakfast Adventure Game

You're a simple person, who leads a simple life. You have a simple motto: “Coffee first, bacon second, everything else after.”

But today, the universe has other plans. Just as breakfast is within your grasp, the sky fills with alien drones who crave Earth’s resources—and apparently, your eggs. From kitchen to supermarket, from diner booths to syrup-soaked streets, you’ll fight, fumble, and maybe forge unlikely alliances—all while chasing the one thing that truly matters: a hot plate of breakfast.

Can you survive the invasion, outwit a bacon-hoarding rival, and finally sit down for a bite? Or will destiny (and your coffee) be forever stolen?

Welcome to Breakfast First: An Absurdist Breakfast Adventure!

## Hackathon Details

This project was created for the CodeTV Web Dev Challenge (Season 2, Episode 9) community hackathon. Below is a concise overview of the core parameters and constraints that shaped the build.

See the official &amp; complete rules at [CodeTV Web Dev Challenge S2.E9 Hackathon page](https://codetv.dev/blog/web-dev-challenge-hackathon-s2e9-breakfast-apps).

### Core Theme

- Build anything as long as it is clearly about breakfast: recipes, ranking burritos, shrine to pancakes, playful experiments — the theme just has to be unmistakably breakfast.

### Required Tech

- Incorporate **Hashbrown** as part of the app (generative UI + component schemas, safe function calling, structured output, runtime features).
- Intent: leverage Hashbrown to let an LLM assemble constrained, high‑quality UI from your vetted component set.

### Time Guidelines (Lightweight, Not Strict Police)

- Plan: ~30 minutes.
- Build: ~4 hours.
- You _can_ go longer if you’re vibing; guidelines exist to keep scope small and accessible.

### Team Format

- Solo or pair.

### Deliverables

1. Public GitHub repository (source code visible).
2. Deployed, publicly accessible URL.
3. Uses Hashbrown meaningfully (not just an unused dependency).
4. Submission via the official form before the posted deadline.

### Community & Support

- Dedicated `#builder-chat` channel in the [CodeTV Discord](https://codetv.link/discord) for idea sharing, feedback, and networking.
- Strong encouragement to engage — part of the value is making connections.

## Developer Notes

### Time & Team

- I did go longer than the 4 hours ⌚
  - This was my first time building with NextJS and in doing that, I knew I'd probably not make the 4 hours, but wanted a project to use for NextJS learning so this was it.
  - I'm still cooking in places. More on that below.
- I built this solo, but am open to pairing up with someone design savvy, so if you're looking for a design project and want to put lipstick on this pig, reach out.

### Hashbrown Usage

This project uses the following features of [Hashbrown](https://hashbrown.dev):

- OpenAI Adapter
- Generative UI (via exposed components)
- Tool Calling

## Where things are at (as of 2025/10/06):

### The Good

- The main concept of a story being presented and the user (being the protagonist) getting to choose their own actions to affect the story is working.
- Story is AI generated (but slightly guided; this still needs work).
- Hashbrown is used to stream the resulting generated story narrative back to the UI in a Markdown viewer component.
- Hashbrown is used to make tool calls to affect the UI
  - The scene items that can be chosen from are populated/updated by tool calls, as well as getting "scene notes" (used to guide the story) and creating the scenes.

### The Bad

- Startup wait time is kind of ridiculous 30s-1m. Ouch!
- The story line is only guided for the first scene, so things can go off the rails a bit quickly and there may not be an end to the game play at the moment.
- The prepositions that show up in the Actions list need work to be context aware based on the initial actions chosen.
- This is using an app specific OpenAI key that is funded with < $20 in credits at the time of writing; with no way for letting a user provide their own key.
- The scene items that can be interacted with need better control for how they are removed from scene-to-scene/action-to-action.

### The Ugly

- Right now the layout and styling is a little horrid 😱.

## Where I want things to go

- Add intro and splash page
- Have the full story arc guided from beginning to end, so user can play through a complete story
- Add an inventory system
- Add some kind of scoring (maybe based on collected items or actions taken)
- Implement a better UX
