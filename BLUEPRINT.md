# 25DGAME — Production Blueprint

**Project:** Interactive Portfolio Game  
**Subject:** Abdul Majid Ridwan Tyastonoatmaja  
**Stack:** Astro + React + TypeScript + Tailwind CSS + Framer Motion  
**Format:** 2.5D side-scrolling exploration game  
**Date:** 2026-06-23

---

## 1. DATA AUDIT REPORT

### 1.1 File Inventory

| File | Format | Entries | Primary Key |
|------|--------|---------|-------------|
| `profile.json` | Object | 1 record | N/A |
| `additional_info.json` | Object | languages, volunteering, contact | N/A |
| `honors.json` | Array | 3 records | title |
| `certifications.json` | Array | 46 records | title (or credential_id) |
| `licenses_certifications.json` | Object w/ `licenses_and_certifications` array | 49 records | title (or credential_id) |
| `skills.json` | Object w/ `categories` | 8 categories, 55 skills | category + skill name |
| `projects.json` | Object w/ `projects` | 21 records | title |
| `experience.json` | Array | 7 records | id (slug) |
| `volunteering.json` | Array | 1 record | role + organization |

### 1.2 Schema Summary

**profile.json**
```
name: string
headline: string
tagline: string
location: string
timezone: string
contact: { email, phone, linkedin, github, website }
summary: string
metrics: { years_experience, projects_shipped, certifications, languages[] }
resume_url: string
```

**additional_info.json**
```
languages[]: { language, proficiency, additional_info }
volunteering[]: { role, organization, duration, cause, description }  ← DUPLICATE of volunteering.json
contact_links: { linkedin }
```

**honors.json**
```
title: string
event: string
date: string (year)
category: "competition"
description: string|null
```

**certifications.json** — flat array
```
title: string
issuer: string
date: string|null (YYYY-MM)
credential_id: string|null
skills: string[]
url: string|null
```

**licenses_certifications.json** — nested inside `licenses_and_certifications`
```
title: string
issuer: string
issue_date: string|null (Mon YYYY)
expiration_date: string|null (Mon YYYY)
credential_id: string|null
skills: string[]
```

**skills.json**
```
categories[]:
  name: string
  icon: string (icon key)
  skills[]:
    name: string
    proficiency: number (1–5)
```

**projects.json**
```
projects[]:
  title: string
  featured: boolean (optional)
  category: "web" | "ml" | "cli" | "devops" | "iot"
  period: string
  description: string
  links[]: { label, url }
  skills: string[]
  association: string (optional)
  media: string[] (optional)
```

**experience.json**
```
id: string (unique slug)
company: string
role: string
type: "full-time contract" | "part-time" | "contract" | "internship"
start_date: string (YYYY-MM)
end_date: string|null (YYYY-MM)
location: string
highlights: string[]
technologies: string[]
url: string|null
```

**volunteering.json**
```
role: string
organization: string
cause: string
start_date: string (YYYY-MM)
end_date: string (YYYY-MM)
highlights: string[]
```

### 1.3 Critical Data Issues

**Issue 1: Duplicate certification data**  
`certifications.json` (46 entries) and `licenses_certifications.json` (49 entries) overlap heavily but differ:
- `licenses_certifications.json` has `issue_date`/`expiration_date` (Mon YYYY format)
- `certifications.json` has `date` (YYYY-MM format) and `url`
- `licenses_certifications.json` is wrapped in `{ licenses_and_certifications: [...] }`
- Count discrepancy: profile says 54, but files contain 46–49

**Resolution:** Use `licenses_certifications.json` as canonical (has expiration dates, more complete). Drop `certifications.json` or merge with dedup on title. Profile `metrics.certifications` needs updating to match actual count (49).

**Issue 2: Duplicate volunteering data**  
`additional_info.json.volunteering` duplicates `volunteering.json` with different schema:
- `additional_info` version uses `duration: "May 2025 · 1 mo"` (string)
- `volunteering.json` uses `start_date`/`end_date` (YYYY-MM)

**Resolution:** Use `volunteering.json` as canonical (structured dates). Drop from `additional_info.json`.

**Issue 3: Schema inconsistency — `certifications.json` vs `licenses_certifications.json`**  
Different field names (`date` vs `issue_date`), different date formats (YYYY-MM vs Mon YYYY), different root structure.

**Resolution:** Normalize all dates to ISO YYYY-MM-DD. Extract to a single `certifications` collection.

**Issue 4: Missing fields**
- `honors.json` has no `url`, `skills`, or `media` fields
- `skills.json` icon values are abstract strings (`brain`, `chart`, `code`) — needs mapping to actual icons
- `experience.json` has nullable `url` and `end_date`
- Some certifications have empty `skills: []`

### 1.4 Normalized Entity Model

```
Person {
  name, headline, tagline, location, timezone
  contact: { email, phone, linkedin, github }
  summary
  metrics: { yearsExperience, projectsShipped, languageCount }
  resumeUrl
}

Honor {
  id, title, event, date, category, description, skills[]
}

Certification {
  id, title, issuer, issueDate, expirationDate, credentialId, skills[], url
}

SkillCategory {
  name, icon, skills: [{ name, proficiency }]
}

Project {
  id, title, featured, category, period, description
  links: [{ label, url }]
  skills[], association, media[]
}

Experience {
  id, company, role, type, startDate, endDate, location
  highlights[], technologies[], url
}

Volunteering {
  id, role, organization, cause, startDate, endDate, highlights[]
}
```

### 1.5 Data Relationships

```
Person ──┬── Honor[*]
         ├── Certification[*]
         ├── SkillCategory[*] ── Skill[*]
         ├── Project[*]
         ├── Experience[*]
         └── Volunteering[*]
```

Projects reference skills (string array) but not vice versa — skill→project mapping is inferred. No foreign keys exist; all links are nominal (by name string matching).

### 1.6 Recommendations

1. **Deduplicate certifications** — merge `certifications.json` and `licenses_certifications.json` into a single `certifications.ts` data module
2. **Normalize dates** — all dates to ISO format at build time via a utility function
3. **Add `id` fields** — to honors, certifications, projects for stable scene/entity references
4. **Fix cert count** — update profile.metrics.certifications to actual unique count
5. **Remove `additional_info.json.volunteering`** — redundant with `volunteering.json`
6. **Add `projectIds` to skill entries** — after dedup, link skills→projects
7. **Create a unified data loader** — single `getAllData()` function that aggregates and normalizes all JSON at build time

---

## 2. PRODUCT BLUEPRINT

### 2.1 Core Concept

**25DGAME** is not a portfolio website. It is a 2.5D side-scrolling exploration game where the visitor plays as an anonymous investigator exploring the mind, work, and identity of Abdul Majid Ridwan.

The visitor enters a world. They move left and right through distinct zones. They interact with objects, solve meaningful puzzles, read discovered documents, and progressively unlock a complete picture of the subject — his skills, projects, experience, and ultimately his inner motivations.

By the time they reach the Final Hidden Room, they will have experienced a curated narrative arc: from surface-level identity → learning journey → technical capability → real execution → professional growth → emotional core.

### 2.2 Unique Value Proposition

| Traditional Portfolio | 25DGAME |
|------------------------|---------|
| Scroll-down page | Side-scrolling world |
| Read about skills | Solve skill puzzles |
| View project list | Enter project "rooms" |
| Download resume | Unlock achievements |
| Contact form | Hidden lore discovery |
| One visit, done | Replay value, secrets |

### 2.3 Player Psychology

**First 30 seconds — "Hook"**
- Title screen appears: retro PS2-style boot sequence with scanlines and CRT effect
- Single bold word: "25DGAME" — yellow on black
- Subtitle: "Press any key to start"
- Low, ambient synth drone
- Visitor thinks: "What is this? A game? For a portfolio?"
- **Emotion:** Curiosity, confusion, intrigue

**Seconds 30–90 — "Orientation"**
- Main menu with 3 options: START, ABOUT, CREDITS
- START launches directly into the game
- Player character appears in Spawn Area (a stylized terminal room)
- Movement revealed naturally: arrow keys or A/D
- First interactable object pulses gently
- **Emotion:** Discovery, control

**Minutes 2–5 — "Competence"**
- Player moves through Academy Room, interacts with diploma-like objects
- Each interaction reveals a certification or honor
- Simple mechanic: walk near object, press E, read content
- First puzzle appears: arrange 3 IoT milestones in chronological order
- Solving it unlocks a new zone
- **Emotion:** Satisfaction, growing interest

**Minutes 5–10 — "Depth"**
- Workshop zone with sub-rooms (AI Lab, Web Studio, IoT Workshop)
- Each sub-room contains a skill-based mini-game
- Projects zone: each project is a unique "mission room"
- Player realizes the depth of content
- **Emotion:** Respect, engagement

**Minutes 10–15+ — "Payoff"**
- Career Corridor: player walks through timeline of experience
- Branching dialogue: player makes choices about hypothetical work scenarios
- Final Hidden Room unlocks after all zones explored
- Emotional reveal: raw motivations, philosophy, future vision
- Credits roll with personalized message
- **Emotion:** Connection, admiration, memorable finish

### 2.4 Engagement Design

**Progression Drivers:**
- Zone completion percentage displayed subtly
- "Lore fragments" collected (1–2 per zone)
- Achievement popups (non-intrusive, toast-style)
- Visual environment changes as zones are completed (lights turn on, color shifts)

**Replay Incentives:**
- Hidden lore fragments (not all in plain sight)
- Secret room accessible only after all fragments found
- Speedrun timer (optional, for fun)
- Easter eggs referencing pop culture, memes, or inside jokes

**Psychological Safety:**
- No fail states. No death. No time pressure.
- Puzzles are skippable (reveal answer after 2 attempts)
- All portfolio content is accessible via a hidden "Skip Game" button in pause menu
- The game enhances content delivery, never blocks it

---

## 3. FULL GAME DESIGN DOCUMENT

### 3.1 Mechanics

**Core Mechanics:**
1. **Side-scrolling movement** — arrow keys / WASD, smooth acceleration with Framer Motion
2. **Collision** — axis-aligned bounding box (AABB) against rectangular colliders
3. **Interaction** — proximity-based `Interactable` component, press E/F/Space
4. **Dialogue** — typewriter text boxes with persona-style yellow-on-black text, skip with E
5. **Zone transitions** — screen wipe (horizontal iris), loading overlay (1–2s max)
6. **Unlock gates** — locked doors that require X collected items/completions to open
7. **Save** — localStorage-based checkpoint system (auto-saves per zone)
8. **Achievements** — toast notification system for milestones

**Optional Mechanics (MVP+):**
- Inventory panel (collected lore, certificates, keys)
- Hidden interactables (slightly different color, flicker)

### 3.2 Controls

| Action | Keyboard | Gamepad (future) |
|--------|----------|------------------|
| Move Left | A / Left Arrow | D-Pad Left |
| Move Right | D / Right Arrow | D-Pad Right |
| Interact | E / Space / Enter | A Button |
| Open Menu | Escape | Start Button |
| Dialogue Skip | E / Space / Enter | A Button |
| Run (hold) | Shift | Left Trigger |

Controls shown on first zone entry as fade-in overlay.

### 3.3 Progression System

```
Title Screen → Main Menu → Spawn Area (Zone 1)
  → Academy Room (Zone 2) ← requires 1 interaction from Zone 1
    → Workshop (Zone 3) ← requires 3 collection from Zone 2
      → Project District (Zone 4) ← requires 2 puzzles from Zone 3
        → Career Corridor (Zone 5) ← requires 3 project visits from Zone 4
          → Final Hidden Room (Zone 6) ← requires ALL zones completed
```

**Gate Conditions:**
- Zone 2: Interact with profile terminal in Spawn Area
- Zone 3: Collect 3 certification "badges" from Zone 2
- Zone 4: Complete 2 skill puzzles in Workshop sub-zones
- Zone 5: Visit 3 project rooms in Project District
- Zone 6: All zones completed

**Soft blocks (no hard blocks):**
- If a player cannot solve a puzzle, a "Hint" button appears after 60s
- After 2 failed attempts, "Skip Puzzle" reveals the content without the game reward
- This ensures portfolio content is never gated behind player skill

### 3.4 Achievements

| Achievement | Trigger | Notes |
|-------------|---------|-------|
| **First Contact** | Interact with first object | Auto-unlock |
| **Dedicated Student** | Collect 5 certifications | Zone 2 |
| **Polyglot** | Collect 10 certifications | Zone 2 |
| **Certified** | Collect all certifications | Hidden; requires exploration |
| **AI Apprentice** | Complete AI Lab puzzle | Zone 3 |
| **Web Weaver** | Complete Web Studio puzzle | Zone 3 |
| **IoT Tinkerer** | Complete IoT Workshop puzzle | Zone 3 |
| **Project Hopper** | Visit 3 project rooms | Zone 4 |
| **Deep Dive** | Read full description of 1 project | Zone 4 |
| **Career Scout** | Enter Career Corridor | Zone 5 |
| **Decision Maker** | Complete a branching choice | Zone 5 |
| **Inner Circle** | Reach Final Hidden Room | Zone 6 |
| **Lore Seeker** | Find 1 hidden lore fragment | Any zone |
| **Lore Master** | Find all hidden lore fragments | All zones |
| **Speed Demon** | Complete game in under 15 min | Time tracked |

### 3.5 Mini Games

All mini games are optional, skippable, and directly tied to portfolio content.

**MG-1: Timeline Sort — Academy Room**  
*Context:* IoT certifications  
*Mechanic:* 4 cards showing IoT milestones (Fundamentals → Hardware → Software → ESP32). Player drags to correct chronological order.  
*Reward:* Unlocks Workshop zone + "IoT Pioneer" badge.  
*Skill reflected:* Structured learning progression, attention to sequence.

**MG-2: AI Pipeline — AI Lab (Workshop sub-zone)**  
*Context:* Machine Learning pipeline  
*Mechanic:* Drag 5 pipeline stages into correct order: Data Collection → Preprocessing → Training → Evaluation → Deployment  
*Reward:* Unlocks AI project rooms in Project District.  
*Skill reflected:* End-to-end ML workflow understanding.

**MG-3: Component Connect — IoT Workshop**  
*Context:* IoT system design  
*Mechanic:* Match 3 sensors to their correct microcontrollers (DHT→ESP8266, Load Cell→Wemos D1, Ultrasonic→Arduino).  
*Reward:* Unlocks IoT project rooms.  
*Skill reflected:* Hardware-software integration knowledge.

**MG-4: Debug Challenge — Web Studio**  
*Context:* Web development debugging  
*Mechanic:* A block of code has 3 bugs. Player clicks on the buggy lines. (e.g., missing semicolon, wrong variable name, unclosed tag)  
*Reward:* Unlocks web project rooms.  
*Skill reflected:* Attention to detail, code literacy.

**MG-5: Decision Sim — Career Corridor**  
*Context:* Work scenario  
*Mechanic:* Text presents a workplace dilemma (e.g., "deadline conflicts with code quality"). Player chooses from 3 responses. Each leads to a different narrative outcome.  
*Reward:* Unlocks Final Hidden Room gate progress.  
*Skill reflected:* Professional judgment, systems thinking.

---

## 4. WORLD DESIGN BLUEPRINT

### 4.1 Zone Specifications

**Zone 1 — SPAWN AREA / LOBBY**
```
Visual: Dark room, terminal/server rack aesthetic, dim cyan lighting
Size: ~2000px wide (3–4 screen widths at 1920px)
Background: Server room with blinking LED strips, cable conduits
Foreground elements: Terminal monitor (main interactable), filing cabinet (lore), door to Zone 2
Audio: Low ambient hum, occasional keystroke sounds
Data: profile.json, additional_info.json
Interactions:
  [Terminal] — Shows name, headline, tagline, metrics (years exp, projects, certs)
  [Filing Cabinet] — Hidden lore: "The subject began their journey in a small town..."
Unlock: Interact with terminal → door to Zone 2 opens
```

**Zone 2 — ACADEMY ROOM**
```
Visual: Library/study aesthetic, warm amber lighting, shelves of "certificates"
Size: ~3000px wide
Background: Tall bookshelves with glowing bindings, academic crests
Foreground: Certificate frames on walls (interactable), pedestal with timeline puzzle
Audio: Soft piano, page-turning sounds
Data: honors.json, certifications.json (normalized)
Interactions:
  [Certificate Frames] — 5–6 frames display key certs; read detail on interact
  [Honors Display] — 3 pedestals showing competition wins
  [Timeline Puzzle] — Chronological sort of IoT milestones
  [Hidden Lore] — Behind a bookshelf: "Despite 54 certifications, he values depth over breadth."
Unlock: Complete timeline puzzle → door to Zone 3 opens
```

**Zone 3 — WORKSHOP / LABORATORY**
```
Visual: Three sub-rooms branching from a central hub, industrial lab style
Size: ~5000px wide total (~1500 central + 3× ~1200 subrooms)
Hub: Clean room with 3 labeled doors: AI Lab | Web Studio | IoT Workshop
AI Lab — Cool blue, neural network visualizations on screens, server racks
Web Studio — Warm orange, monitor arrangement, code editor projections
IoT Workshop — Green/cyan, workbench with components, oscilloscope screens
Audio: Varies per subroom; electronic, keyboard typing, component buzz
Data: skills.json (split by category)
Interactions:
  [AI Lab Terminal] — View ML/AI skills as glowing node graph; play Pipeline puzzle
  [Web Studio Desk] — View web skills on projected screens; play Debug challenge
  [IoT Workbench] — View IoT/hardware skills on component labels; play Component Connect
  [Hidden Lore] — Whiteboard in AI Lab: scribbled note about a failed project and what it taught
Unlock: Complete 2 of 3 puzzles → central door to Zone 4 opens
```

**Zone 4 — PROJECT DISTRICT**
```
Visual: Tech campus / plaza, each project is a building/room
Size: ~8000px wide — largest zone
Building exteriors: Different architectural styles per category
  ML projects — Glass/metal modern facades
  Web projects — Brick/loft style
  IoT projects — Industrial/warehouse
  CLI projects — Minimalist concrete
  DevOps projects — Server room aesthetic
Audio: Ambient city/tech park, each building has unique interior audio
Data: projects.json
Interactions:
  [Project Buildings] — Enter by walking up to door; interior view shows:
    - Project title and period
    - Brief description (expandable)
    - Skills used (highlighted)
    - Links (Live Demo, GitHub)
    - Featured projects have larger buildings with glowing markers
  [Featured Projects] — 6 projects marked "featured: true" have premium interiors with 3D elements
  [Hidden Lore] — Graffiti on a wall: notes about what drives project selection
Unlock: Visit 3 project rooms → exit to Zone 5 appears
```

**Zone 5 — CAREER CORRIDOR**
```
Visual: Long hallway with timeline on floor, company logos as "stations"
Size: ~4000px wide
Background: Timeline graph showing employment periods over years (2023–Present)
Stations: Each experience entry is a circular "station" with company name
Audio: Professional/office ambient, phone calls in distance
Data: experience.json, volunteering.json
Interactions:
  [Station Kiosks] — Each station shows:
    - Role, company, period
    - Type (full-time, part-time, contract, internship)
    - Highlights (bullet list)
    - Technologies used
  [Volunteering Segment] — End of corridor, highlights speaking engagement
  [Decision Sim] — Kiosk prompts: "You face a tight deadline and code quality suffers. How do you respond?"
    - Choice A: Ship on time, refactor later
    - Choice B: Delay for code quality
    - Choice C: Negotiate scope reduction
    Each shows a narrated outcome aligned with his actual philosophy
  [Hidden Lore] — A sticky note on a monitor: values learned from each workplace
Unlock: Complete decision sim → Final door appears at corridor's end
```

**Zone 6 — FINAL HIDDEN ROOM**
```
Visual: Intimate circular room, starry ceiling, warm low light
Center: A glowing pedestal with an orb or journal
Walls: Abstract representations of the journey (icons from each zone)
Size: ~1500px wide (single screen)
Audio: Emotional piano piece (Persona 3-esque), builds slowly
Data: Inferred from profile.json (ambitions, philosophy from summary/tagline)
Interactions:
  [Central Pedestal] — Interactive monologue:
    "You've explored the data, the projects, the work. Now you want to know: why?"
    Typewriter text reveals in sequence:
    - "To build systems that matter."
    - "To bridge the gap between intelligence and action."
    - "To prove that a kid from Tulungagung can shape the future of AI."
    - "This is not the end. This is where I begin."
  [Journey Wall] — Each zone icon glows as you approach, showing a summary stat
    - "Certifications collected: 49"
    - "Projects built: 18"
    - "Skills mastered: 55"
    - "Years grinding: 2+"
  [Final Lore Fragment] — A letter: "For the next explorer who finds this room..."
Unlock: Automatically accessible when all prior zones completed
```

### 4.2 Zone Unlock Logic

```
const zoneUnlocks = {
  zone2: { requires: ['zone1_terminal_interaction'] },
  zone3: { requires: ['zone2_cert_collections >= 3'] },
  zone4: { requires: ['zone3_puzzles_completed >= 2'] },
  zone5: { requires: ['zone4_projects_visited >= 3'] },
  zone6: { requires: ['zone5_decision_completed', 'all_previous_zones_complete'] },
}
```

### 4.3 Hidden Content Map

| Fragment | Zone | Location | Clue |
|----------|------|----------|------|
| LF-1 | Spawn Area | Inside filing cabinet (click 3 times) | "Check the files" |
| LF-2 | Academy Room | Bookshelf gap, slightly offset tile | "One book stands out" |
| LF-3 | Workshop Hub | Under the central rug | "The floor seems uneven" |
| LF-4 | AI Lab | Behind a glowing screen | "Look behind the light" |
| LF-5 | Web Studio | In a trash bin (ironic) | "Not all treasure is gold" |
| LF-6 | IoT Workshop | Inside a component drawer | "Check the parts bin" |
| LF-7 | Project District | Small alley between 2 buildings | "There's a gap between projects" |
| LF-8 | Career Corridor | Behind a plant | "Water the plant" (interact with it) |
| LF-9 | Final Room | Given automatically | "You made it." |

Collecting all 9 fragments unlocks a secret "Developer's Commentary" mode.

---

## 5. UX/UI BLUEPRINT

### 5.1 Visual Identity

**Color Palette:**
```
Primary Yellow:   #F0E040 (Persona 4-inspired)
Dark Background:  #0A0A0A
Surface:         #1A1A1A
Surface Light:   #2A2A2A
Text Primary:    #F5F5F5
Text Accent:     #F0E040
Danger:          #E04040
Success:         #40E060
Info:            #4080E0
```

**Typography:**
- Headings: "Impact" or similar heavy sans-serif (retro game feel)
- Body: "Inter" or "JetBrains Mono" (developer-appropriate)
- UI text: Monospace for tech feel
- Dialogue: Serif for narrative moments

**Key Design Patterns (Persona-inspired):**
1. **Bold yellow-on-black text** for title screens and important UI
2. **Scanline overlay** (CSS pseudo-element, subtle) for CRT effect
3. **Halftone/dither patterns** on loading screens
4. **Sharp geometric borders** — brutalist but refined
5. **Animated gradient backgrounds** during transitions
6. **Staggered text reveals** (typewriter effect)
7. **PS2-era boot sequence** — white text on black, "memory card" style save indicator
8. **Large sans-serif numbers** for metrics display

### 5.2 Screen Flow

```
┌──────────────────────────────┐
│        TITLE SCREEN           │
│  "25DGAME" (large, centered)  │
│  PS2 boot animation           │
│  Press any key to start       │
└──────────┬───────────────────┘
           ▼
┌──────────────────────────────┐
│        MAIN MENU              │
│  [▶ START GAME]              │
│  [■ ABOUT THIS]              │
│  [★ CREDITS]                 │
│  Keyboard arrow navigation   │
└──────────┬───────────────────┘
           ▼ (START)
┌──────────────────────────────┐
│   ZONE TRANSITION OVERLAY    │
│  "ZONE 1 — SPAWN AREA"       │
│  Location name in Impact font│
│  Horizontal wipe transition  │
└──────────┬───────────────────┘
           ▼
┌──────────────────────────────┐
│      GAME VIEWPORT           │
│  [HUD overlay]               │
│  2.5D rendered scene         │
│  Player character            │
│  Interactables with glow     │
│  Zone exit indicators        │
└──────────────────────────────┘
```

### 5.3 HUD Layout

```
┌──────────────────────────────────────────────────────┐
│ [☰ Menu]  Zone: Spawn Area    ⬡ 3/9 Lore    ⭐ 2/14 │
│                                                       │
│                                                       │
│              [GAME VIEWPORT - FULL SCREEN]            │
│                                                       │
│                                                       │
│   [Interact: E]           [Hint]         [Skip]      │
└──────────────────────────────────────────────────────┘
```

- Minimal HUD, fades after 3 seconds of no interaction
- Appears on mouse move or key press
- Menu button (top-left) opens pause overlay
- Zone name (top-center) fades in on zone entry, then shrinks to top bar
- Lore/achievement counters (top-right) subtle
- Interaction prompt (bottom-left) appears only near interactables
- Hint/Skip (bottom-right) appears only during puzzles

### 5.4 Interaction States

| State | Visual | Behavior |
|-------|--------|----------|
| IDLE | Normal scene | Player can move, camera follows |
| NEAR_INTERACTABLE | Object pulses with yellow glow, "Press E" appears | Press E triggers interaction |
| READING | Text box overlay, game pauses | Typewriter text, press E to advance/close |
| PUZZLE | Puzzle UI overlays scene | Game loop pauses; puzzle has its own controls |
| MENU | Semi-transparent overlay | Game pauses; options: Resume, Skip to Zone, Save, Load, Skip Game (reveals standard portfolio) |
| TRANSITION | Wipe animation | Loading state, max 2 seconds |
| COMPLETED | Zone exit glows golden | Player can proceed to next zone |

### 5.5 Transitions

**Zone Entry:**
1. Player approaches zone exit
2. Exit door/portal glows
3. Press E to proceed
4. Screen wipe: from center horizontal line expanding outward
5. "ZONE NAME" in Impact font, yellow on black, 2 seconds
6. Fade in to new zone

**Scene transitions within zones** (e.g., entering a project building):
1. Player walks through door frame
2. Quick fade to black (200ms)
3. Interior renders
4. Fade in (200ms)

**Cinematic moments** (e.g., Final Room reveal):
1. All controls locked
2. Letterbox bars animate in (top and bottom)
3. Camera slowly pans
4. Music swells
5. Text appears with typewriter effect
6. Letterbox bars animate out after completion

---

## 6. TECHNICAL BLUEPRINT

### 6.1 Architecture Overview

```
┌──────────────────────────────────────────────────┐
│                    ASTRO (SSG)                     │
│     Build-time data loading + page generation      │
└────────────┬────────────────────┬─────────────────┘
             │                    │
     ┌───────▼───────┐    ┌──────▼──────────┐
     │  Data Layer    │    │  Game Engine    │
     │  (TypeScript)  │    │  (React SPA)    │
     └───────┬───────┘    └──────┬──────────┘
             │                    │
     ┌───────▼───────┐    ┌──────▼──────────┐
     │  JSON Source   │    │  Canvas/HTML    │
     │  (data/*.json) │    │  Rendering      │
     └───────────────┘    └─────────────────┘
```

Astro acts as the static site generator shell. The main game is a single React application mounted inside an Astro page. At build time, all JSON data is validated, normalized, and bundled into the React app as static imports.

### 6.2 Folder Structure

```
src/
├── game/
│   ├── App.tsx                        # Root game component, route by zone
│   ├── types.ts                       # All TypeScript interfaces
│   ├── constants.ts                   # Magic numbers, config, tuning
│   │
│   ├── art/
│   │   ├── backgrounds/               # Zone CSS background components
│   │   │   ├── Zone1Background.tsx
│   │   │   ├── Zone2Background.tsx
│   │   │   ├── Zone3HubBackground.tsx
│   │   │   ├── Zone3AILab.tsx
│   │   │   ├── Zone3WebStudio.tsx
│   │   │   ├── Zone3IoTWorkshop.tsx
│   │   │   ├── Zone4Background.tsx
│   │   │   ├── Zone5Background.tsx
│   │   │   └── Zone6Background.tsx
│   │   ├── PlayerSprite.tsx           # SVG character
│   │   └── props/                     # Inline SVG prop components
│   │       ├── Terminal.tsx
│   │       ├── FilingCabinet.tsx
│   │       ├── CertificateFrame.tsx
│   │       ├── LabWorkbench.tsx
│   │       ├── Building.tsx
│   │       ├── StationKiosk.tsx
│   │       └── Pedestal.tsx
│   │
│   ├── state/
│   │   ├── GameContext.tsx             # React Context for game state
│   │   ├── useGameState.ts            # Hook: state + dispatch
│   │   ├── useSaveState.ts            # localStorage save/load
│   │   └── reducers/
│   │       ├── progress.ts            # Zone unlocks, completions
│   │       ├── inventory.ts           # Lore fragments, badges
│   │       ├── achievements.ts        # Achievement tracking
│   │       └── puzzles.ts             # Puzzle completion state
│   │
│   ├── engine/
│   │   ├── GameCanvas.tsx             # Main viewport container
│   │   ├── useGameLoop.ts             # requestAnimationFrame loop
│   │   ├── useCamera.ts               # Scroll/camera follow logic
│   │   ├── usePlayerMovement.ts       # Input handling + movement
│   │   ├── useCollision.ts            # AABB collision detection
│   │   └── useInteraction.ts          # Proximity + interact dispatch
│   │
│   ├── entities/
│   │   ├── Player.tsx                 # Player sprite + animation
│   │   ├── Interactable.tsx           # Base interactable object
│   │   ├── Door.tsx                   # Zone transition trigger
│   │   ├── LoreFragment.tsx           # Hidden collectible
│   │   └── NPC.tsx                    # Optional NPC for flavor text
│   │
│   ├── zones/
│   │   ├── ZoneRenderer.tsx           # Renders current zone + all entities
│   │   ├── Zone1_SpawnArea.tsx
│   │   ├── Zone2_AcademyRoom.tsx
│   │   ├── Zone3_Workshop.tsx
│   │   │   └── subrooms/
│   │   │       ├── AI_Lab.tsx
│   │   │       ├── Web_Studio.tsx
│   │   │       └── IoT_Workshop.tsx
│   │   ├── Zone4_ProjectDistrict.tsx
│   │   │   └── ProjectRoom.tsx        # Generic project interior
│   │   ├── Zone5_CareerCorridor.tsx
│   │   └── Zone6_FinalRoom.tsx
│   │
│   ├── ui/
│   │   ├── HUD.tsx                    # Heads-up display
│   │   ├── DialogueBox.tsx            # Typewriter text system
│   │   ├── InteractionPrompt.tsx      # "Press E to interact"
│   │   ├── ZoneTitle.tsx              # Zone name intro overlay
│   │   ├── AchievementToast.tsx       # Achievement popup
│   │   ├── PuzzleContainer.tsx        # Puzzle wrapper with hint/skip
│   │   └── PauseMenu.tsx             # Pause overlay
│   │
│   ├── screens/
│   │   ├── TitleScreen.tsx            # PS2-style boot sequence
│   │   ├── MainMenu.tsx               # START / ABOUT / CREDITS
│   │   ├── AboutModal.tsx             # "What is this?"
│   │   ├── CreditsScreen.tsx          # Role call
│   │   └── StandardPortfolio.tsx      # "Skip Game" fallback
│   │
│   ├── puzzles/
│   │   ├── TimelineSort.tsx
│   │   ├── AIPipeline.tsx
│   │   ├── ComponentConnect.tsx
│   │   ├── DebugChallenge.tsx
│   │   └── DecisionSim.tsx
│   │
│   ├── effects/
│   │   ├── Scanlines.tsx              # CRT scanline overlay
│   │   ├── ScreenWipe.tsx             # Transition animation
│   │   ├── Typewriter.tsx            # Text reveal effect
│   │   └── Letterbox.tsx             # Cinematic bars
│   │
│   └── styles/
│       ├── game.css                   # Game-specific global styles
│       ├── animations.css             # Keyframes, transitions
│       └── persona.css                # Color tokens, typography
│
├── pages/
│   ├── index.astro                    # Entry point — mounts <Game />
│   └── resume.astro                   # Standard resume page (optional)
│
├── layouts/
│   └── game.astro                     # Minimal layout shell
│
├── components/
│   └── Game.tsx                       # Astro component that hydrates the game
│
└── styles/
    └── global.css                     # Base reset + fonts
```

### 6.3 Rendering Strategy

The game renders using **HTML/CSS + React, not Canvas**.

**Why HTML/CSS over Canvas:**
- Solo developer with limited game dev experience
- No need for physics, particle systems, or high-FPS rendering
- Easier debugging, styling, and accessibility
- Framer Motion handles all animation needs
- CSS scanlines, transitions, and overlays are trivial
- Player movement = smooth CSS translate with Framer Motion `useSpring`

**2.5D Effect:**
- Parallax layers: background (far) scrolls at 0.2x, midground at 0.5x, foreground at 1x
- **All visuals are pure CSS/SVG** — no external images. Backgrounds use CSS gradients + geometric divs. Characters and props are inline SVG.
- Player sprite: SVG character (geometric shapes: circle head, rect body, line limbs)
- Depth: box-shadows and scale for pseudo-3D effect
- Persona-style menus: absolutely positioned overlays with bold typography

**Camera System:**
- Container div with `overflow: hidden`
- Inner world div with `transform: translateX(offset)`
- Camera follows player: `offset = playerX - viewportWidth/2`
- Clamped to world bounds
- Uses `useSpring` from Framer Motion for smooth camera movement

### 6.4 State Management

**GameState (React Context):**

```typescript
interface GameState {
  // Screen routing
  screen: 'title' | 'menu' | 'game' | 'about' | 'credits' | 'standard';
  
  // Zone tracking
  currentZone: ZoneId;         // 'zone1' | 'zone2' | ...
  zonesCompleted: ZoneId[];    // completed zones
  zoneProgress: Record<ZoneId, number>;  // 0–100 per zone
  
  // Player
  playerPosition: { x: number; y: number };
  playerFacing: 'left' | 'right';
  
  // Inventory
  loreFragments: string[];
  collectedCertIds: string[];
  badges: string[];
  
  // Puzzles
  puzzlesCompleted: string[];
  puzzleAttempts: Record<string, number>;
  
  // Achievements
  achievements: string[];
  
  // Meta
  playTime: number;            // seconds
  totalInteractions: number;
}
```

**Dispatching:**
```typescript
type GameAction =
  | { type: 'SET_SCREEN'; screen: GameState['screen'] }
  | { type: 'SET_ZONE'; zone: ZoneId }
  | { type: 'COMPLETE_ZONE'; zone: ZoneId }
  | { type: 'MOVE_PLAYER'; x: number; y: number }
  | { type: 'COLLECT_LORE'; id: string }
  | { type: 'COLLECT_CERT'; id: string }
  | { type: 'COMPLETE_PUZZLE'; id: string }
  | { type: 'INCREMENT_ATTEMPT'; puzzleId: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; id: string }
  | { type: 'TICK_TIME' }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'RESET' };
```

**Save System:**
```typescript
interface SaveData {
  version: number;                      // Schema version for migrations
  timestamp: number;
  zonesCompleted: ZoneId[];
  loreFragments: string[];
  collectedCertIds: string[];
  badges: string[];
  puzzlesCompleted: string[];
  achievements: string[];
  playTime: number;
  totalInteractions: number;
}
```

- Auto-saves on zone completion, puzzle completion, lore collection, and every 60 seconds
- Stored in `localStorage` key: `25dgame_save`
- Load on game start: prompts "Continue?" if save exists
- Reset: clear localStorage key

### 6.5 Data Loading Pipeline

```
At build time (Astro SSG):

data/*.json ──→ src/game/data/transform.ts ──→ Normalized GameData ──→ Bundled into JS

At runtime:

Static import: import { gameData } from './data'
Context initialization: new GameState populated from gameData
No runtime fetch calls. Zero API latency.
```

**Data Module (`src/game/data/index.ts`):**

```typescript
import profileData from '@data/profile.json';
import honorsData from '@data/honors.json';
import licensesData from '@data/licenses_certifications.json';
import skillsData from '@data/skills.json';
import projectsData from '@data/projects.json';
import experienceData from '@data/experience.json';
import volunteeringData from '@data/volunteering.json';

export function getAllGameData(): GameData {
  return {
    profile: normalizeProfile(profileData),
    honors: normalizeHonors(honorsData),
    certifications: normalizeCertifications(licensesData.licenses_and_certifications),
    skills: normalizeSkills(skillsData),
    projects: normalizeProjects(projectsData.projects),
    experiences: normalizeExperiences(experienceData),
    volunteering: normalizeVolunteering(volunteeringData),
  };
}
```

### 6.6 Performance Optimization

1. **Zone-based lazy loading:** Only the current zone's components mount. Previous zones are unmounted.
2. **Image preloading:** Zone backgrounds preloaded when approaching zone transition.
3. **Animation gating:** Framer Motion `willChange: transform` on moving elements.
4. **Reduced motion:** Respects `prefers-reduced-motion` — fall back to instant transitions.
5. **Bundle splitting:** Each zone is a dynamic import (`React.lazy`). Initial bundle is only Title + Menu + Zone 1.
6. **CSS containment:** `contain: layout style paint` on world container.
7. **No runtime JSON parsing:** Everything is statically typed and bundled at build time.
8. **Debounced auto-save:** 2-second debounce on save writes.

### 6.7 Accessibility

- Full keyboard navigation (no mouse required)
- Screen reader support: `aria-live` regions for dialogue, `aria-label` on interactables
- Text size respects browser zoom
- "Skip Game" button in pause menu opens standard portfolio view
- All portfolio data available in text form outside game
- Color contrast meets WCAG AA (yellow on black: 12.6:1 ratio)

---

## 7. JSON-TO-GAME MAPPING

### 7.1 File → Scene Mapping

| JSON File | Primary Scene | Secondary Usage |
|-----------|--------------|-----------------|
| `profile.json` | Zone 1 — Terminal interactable | Final Room monologue source |
| `additional_info.json` | Zone 1 — Language display | — |
| `honors.json` | Zone 2 — Honors pedestals | Achievement unlock conditions |
| `licenses_certifications.json` | Zone 2 — Certificate frames | Badge collection system |
| `skills.json` | Zone 3 — Workshop sub-rooms | Puzzle content + visual skill graph |
| `projects.json` | Zone 4 — Project buildings | Puzzle difficulty scaling |
| `experience.json` | Zone 5 — Career stations | Decision sim content |
| `volunteering.json` | Zone 5 — Volunteering segment | — |

### 7.2 JSON Fields → Entity Properties

**`profile.json` → Zone 1 Terminal**
```
name → Title display
headline → Subtitle
tagline → Tagline text with typewriter
location → Location badge
metrics.years_experience → Stat display (large number)
metrics.projects_shipped → Stat display
metrics.certifications → Stat display (note: update to actual count)
summary → Expandable "Read More"
contact.linkedin → Social link button
contact.github → Social link button
```

**`honors.json` → Zone 2 Pedestals**
```
Each entry → pedestal entity:
  title → Engraving on pedestal
  event → Event badge
  date → Year display
  category → Icon (all "competition" → trophy icon)
  description → Hover/detail text
```

**`licenses_certifications.json` → Zone 2 Certificate Frames**
```
Each entry → framed certificate entity:
  title → Certificate title text
  issuer → Issuer badge
  issue_date → Date label
  skills → Tag pills (if present)
  url → "Verify" button (if present)
  credential_id → Small ID text
```

**`skills.json` → Zone 3 Sub-rooms**
```
categories → Sub-rooms + navigation
  name → Room label
  icon → Room icon (mapped: brain→neural, chart→graph, code→brackets, chip→circuit, gear→cog, terminal→prompt, cloud→cloud, zap→bolt)
  skills[] → Interactive skill nodes
    name → Skill label
    proficiency → Visual bar / 5 dots / glow intensity
```

**`projects.json` → Zone 4 Buildings**
```
projects → Building entities:
  featured → Large size + golden glow
  category → Visual style (ml=glass, web=brick, iot=industrial, cli=concrete, devops=server)
  title → Building sign
  period → Date plaque
  description → Interior readout (expandable)
  links → Buttons (Live Demo, GitHub)
  skills → Skill tags displayed
  association → Organization badge (if present)
  media → Screenshot gallery (if present)
```

**`experience.json` → Zone 5 Stations**
```
Each entry → Station entity:
  id → Station identifier
  company → Station header
  role → Role subtitle
  type → Tag badge (color-coded)
  start_date/end_date → Timeline span
  location → Location text
  highlights → Bullet list
  technologies → Tech tags
```

**`volunteering.json` → Zone 5 End Segment**
```
role → Header
organization → Organization name
cause → Cause badge
highlights → Description text
```

### 7.3 Puzzles ↔ Data Mapping

| Puzzle | Source Data | Skill Tested |
|--------|-------------|--------------|
| Timeline Sort | IoT certifications (chronological by date) | Sequence awareness |
| AI Pipeline | ML skill categories (pipeline stages) | ML workflow knowledge |
| Component Connect | IoT skill items (component→microcontroller) | Hardware knowledge |
| Debug Challenge | Web development skills (code samples) | Code literacy |
| Decision Sim | Experience highlights (work scenarios) | Professional judgment |

---

## 8. SPRINT PLANNING

> **Timeline note**: Each sprint is 1–3 sessions of focused work. Sprints are ordered by dependency, but don't strictly map to weeks — take as long as each needs.
>
> **Art approach (all sprints)**: Pure CSS + inline SVG. No external images. Style: geometric minimalism with bold Persona-style yellow-on-black. Zone-specific accent colors.

---

### Phase 0 — Foundation Setup (4 sprints)

---

#### Sprint 0.1 — Project Scaffolding
**Component:** Project init + data layer

**Files to create:**
- `astro.config.mjs` — Astro + React + Tailwind config
- `tsconfig.json` — path aliases (`@data/*`, `@game/*`)
- `tailwind.config.js` — content paths
- `eslint.config.js` — Astro + TypeScript rules
- `.prettierrc` — format config
- `.github/workflows/ci.yml` — lint + typecheck + test on push
- `src/game/types.ts` — all TypeScript interfaces (GameState, GameAction, ZoneId, etc.)
- `src/game/data/transform.ts` — JSON normalization utilities
- `src/game/data/index.ts` — unified data loader
- `src/game/constants.ts` — magic numbers (zone widths, speeds, distances)

**Visual spec:** N/A — pure infra

**Accept criteria:** `npx astro check` passes, `npx vitest run` passes, CI green

---

#### Sprint 0.2 — Folder Structure + Layout
**Component:** Directory scaffold + page layout

**Files to create:**
- `src/game/engine/` — GameCanvas, hooks
- `src/game/state/` — contexts, reducers
- `src/game/entities/` — Player, Door, interactables
- `src/game/ui/` — HUD, overlays
- `src/game/effects/` — transitions, overlays
- `src/game/art/` — backgrounds, PlayerSprite, props
- `src/game/screens/` — TitleScreen, MainMenu, etc.
- `src/game/zones/` — zone files
- `src/layouts/game.astro` — minimal HTML shell
- `src/components/Game.tsx` — root game component
- `src/game/styles/game.css` — global game styles

**Import all `game.css`** in `game.astro`

**Accept criteria:** Browser shows a blank page with `#game-root` div

---

#### Sprint 0.3 — State Management
**Component:** GameContext + reducers

**Files to create:**
- `src/game/state/GameContext.tsx` — React Context + Provider
- `src/game/state/useGameState.ts` — hook wrapper
- `src/game/state/useSaveState.ts` — localStorage save/load with versioning
- `src/game/state/reducers/index.ts` — root reducer combiner
- `src/game/state/reducers/progress.ts` — zone unlocks, completions
- `src/game/state/reducers/inventory.ts` — lore fragments, badges
- `src/game/state/reducers/achievements.ts` — achievement tracking
- `src/game/state/reducers/puzzles.ts` — puzzle state

**Actions handled:**
- `SET_SCREEN`, `SET_ZONE`, `COMPLETE_ZONE`, `MOVE_PLAYER`, `SET_PLAYER_FACING`
- `COLLECT_LORE`, `COLLECT_CERT`, `COMPLETE_PUZZLE`, `INCREMENT_ATTEMPT`
- `UNLOCK_ACHIEVEMENT`, `TICK_TIME`, `LOAD_STATE`, `RESET`

**Accept criteria:** State updates correctly, save round-trips, tests pass

---

#### Sprint 0.4 — CI + Quality Gates
**Component:** CI pipeline

**Files to create:**
- `.github/workflows/ci.yml`
- `vitest.config.ts`

**Visual spec:** N/A

**Accept criteria:** `npm test`, `npm run lint`, `npx tsc --noEmit` all pass in CI

---

### Phase 1 — Core Engine (6 sprints)

---

#### Sprint 1.1 — Game Loop + Camera
**Component:** Engine foundation

**Files to create:**
- `src/game/engine/useGameLoop.ts` — requestAnimationFrame, delta time, cleanup on unmount
- `src/game/engine/useCamera.ts` — Framer Motion `useSpring` camera, clamps to world bounds, parallax offset

**Visual spec:** N/A

**Accept criteria:** Ticking works, camera follows a mock x-coordinate with smooth spring

---

#### Sprint 1.2 — Player Movement
**Component:** Input handling

**Files to create:**
- `src/game/engine/usePlayerMovement.ts` — key listeners for ArrowLeft/Right, A/D, Shift sprint; returns `{ moveX, isSprinting }`

**Design requirements:**
- Movement feels responsive (no acceleration/deceleration, instant direction switch)
- Sprint = 1.75x speed
- Disable input during transitions via `active` param

**Accept criteria:** Keys move the player, sprint works, input disabled during transition

---

#### Sprint 1.3 — Collision System
**Component:** World bounds

**Files to create:**
- `src/game/engine/useCollision.ts` — `clampToWorldBounds(x, zoneId)` that reads zone width from constants

**Accept criteria:** Player cannot exit zone left/right edges

---

#### Sprint 1.4 — Interaction System
**Component:** Proximity detection

**Files to create:**
- `src/game/engine/useInteraction.ts` — given player position + list of interactables, returns nearest interactable within `INTERACTION_DISTANCE`

**Accept criteria:** Walking near a Door shows "Press E" prompt

---

#### Sprint 1.5 — GameCanvas + Zone Routing
**Component:** Main viewport orchestrator

**Files to create:**
- `src/game/engine/GameCanvas.tsx` — ties everything together:
  - `motion.div` world container with `translateX` from camera
  - Ground plane (80px, `#1A1A1A` with top border)
  - Door rendering with transition trigger
  - "Press E to interact" overlay
  - `ScreenWipe` transition on zone change
- `src/components/Game.tsx` — screen router: Title → Menu → Game
  - Import `game.css` in layout

**Accept criteria:** Player moves in a test world, collides on edges, triggers E prompt near door, screen wipe on zone change

---

#### Sprint 1.6 — ScreenWipe Transition
**Component:** Zone transition animation

**Files to create:**
- `src/game/effects/ScreenWipe.tsx` — horizontal iris wipe (center line expands to full screen), zone name overlay, callback on complete

**Visual spec:**
- Duration: 800ms wipe-in, 600ms hold zone name, 400ms fade-out
- Background: `#0A0A0A`
- Text: `#F0E040`, Impact font, "ZONE NAME" centered
- Zone name stays for 1.5s then wipes out

**Accept criteria:** Clean transition between zones, no flashes or glitches

---

### Phase 2 — Art System (4 sprints)

---

#### Sprint 2.1 — Player Character Design
**Component:** `PlayerSprite`

**Files to create:**
- `src/game/art/PlayerSprite.tsx` — SVG character, Framer Motion walk bob

**Visual spec:**
- ViewBox: `0 0 40 80`
- **Head**: `circle cx=20 cy=14 r=11`, fill `#d4a574` (light skin)
- **Hair**: `path`, dark silhouette (`#1a1a1a`), spiky/neat style
- **Body**: `rect x=11 y=25 w=18 h=34 rx=3`, fill `#2a2a2a` (dark hoodie)
- **Backpack**: `rect x=8 y=28 w=8 h=26 rx=2`, fill `#1a1a1a`
- **Arms**: 2 rects, fill `#2a2a2a`, position at shoulders
- **Legs**: 2 rects `w=7 h=20 rx=2`, fill `#1a1a1a` (dark pants)
- **Shoes**: 2 rects `w=10 h=4 rx=1.5`, fill `#333`
- **Eyes**: 2 small white circles + smaller dark pupils
- **Facing**: SVG group wrapped in parent div with `scaleX(-1)` for left

| State | Visual |
|-------|--------|
| Idle | Standing, no bob |
| Walking | Framer Motion `y: [0, -2, 0, -2, 0]`, repeat infinite, 0.3s duration |
| Facing right | Normal |
| Facing left | `scaleX(-1)` on wrapper div |

**Accept criteria:** Renders 40×80px, responds to `facing` and `walking` props

---

#### Sprint 2.2 — Terminal Prop
**Component:** `Terminal`

**Files to create:**
- `src/game/art/props/Terminal.tsx` — CSS monitor with green screen

**Visual spec:**
- **Outer frame**: `80×45px`, gradient `#2a2a3a` → `#1a1a2a`, `border: 2px solid #3a3a4a`, `border-radius: 3px`
- **Screen inner**: fills frame minus padding, `#0a0a12`
- **Scan lines**: `repeating-linear-gradient(0deg, transparent 1px, rgba(0,255,100,0.03) 2px)` overlay
- **Cursor**: `width=6 height=1`, `background #00ff64`, `animation: pulse 1s step-end infinite`
- **Base**: `width=40% of frame`, `margin: 0 auto`, `#2a2a3a`
- **Keyboard**: `width=110% of frame`, `height=8px`, `#1a1a2a` with `border: 1px solid #2a2a3a`

| Prop | Size | Position |
|------|------|----------|
| Terminal | `80×60px` total | Zone 1, `x=100 y=380` |

**Props interface:**
```tsx
interface TerminalProps {
  x: number;
  y: number;
  scale?: number; // default 1
}
```

**Accept criteria:** Renders with green scan-line screen, blinking cursor, keyboard

---

#### Sprint 2.3 — Filing Cabinet Prop
**Component:** `FilingCabinet`

**Files to create:**
- `src/game/art/props/FilingCabinet.tsx` — CSS cabinet with drawers

**Visual spec:**
- **Body**: `60×90px`, gradient `#2a2a3a` → `#1a1a2a`, `border: 1px solid #3a3a4a`
- **Drawers**: divided evenly (default 4), each with `border-bottom` separator
- **Handles**: centered per drawer, `width=18px height=4px`, `#4a4a5a`, `border-radius: 2px`
- **Legs**: 2 small rects at bottom corners

| Prop | Size | Position |
|------|------|----------|
| Cabinet | `60×100px` total | Zone 1, `x=800 y=360` |
| Cabinet (3 drawers) | `60×100px` | Zone 1, `x=870 y=360` |

**Props interface:**
```tsx
interface FilingCabinetProps {
  x: number;
  y: number;
  scale?: number;
  drawers?: number; // default 4
}
```

**Accept criteria:** Renders with visible drawer dividers and handles

---

#### Sprint 2.4 — Zone 1 Background
**Component:** `Zone1Background`

**Files to create:**
- `src/game/art/backgrounds/Zone1Background.tsx` — CSS server room

**Visual spec:**

| Layer | Element | CSS |
|-------|---------|-----|
| Far (sky/wall) | Dark gradient | `linear-gradient(180deg, #0a0a12 0%, #0d0d1a 30%, #0f0f22 60%, #111128 100%)` |
| Far (racks) | 5 server rack silhouettes | `width=80 height=350`, opacity 0.6, cyan border `rgba(0,255,255,0.08)`, spaced 350px apart starting at x=200 |
| Mid (racks) | 4 closer racks | `width=100 height=420`, opacity 1, cyan border `rgba(0,255,255,0.15)`, spaced 400px starting x=100 |
| LEDs | Green dots per rack | 3 per rack, `width=4 height=4`, `border-radius: 50%`, `#00ff88` with `box-shadow`, staggered `animation-delay` |
| Ceiling | Conduit lines | Horizontal line at y=40, vertical drops every 250px |
| Floor | Ground plane | `height=80px`, gradient `#151528` → `#0d0d1a`, top border `rgba(0,255,255,0.2)`, grid lines every 60px |

**Accept criteria:** Renders inside `GameCanvas`, scrolls with parallax (if parent applies offset)

---

### Phase 3 — Zone Content: Zone 1 Spawn Area (2 sprints)

---

#### Sprint 3.1 — Zone 1: Spawn Area Layout
**Component:** `Zone1_SpawnArea`

**Files to create:**
- `src/game/zones/Zone1_SpawnArea.tsx` — assembles background + props + player start position

**Layout:**
| Element | Position |
|---------|----------|
| `Zone1Background` | `inset: 0` |
| `Terminal` | `x=100 y=360` |
| `FilingCabinet` | `x=800 y=340` |
| `FilingCabinet 3-drawer` | `x=870 y=340` |
| Door to Zone 2 | `x=1900 y=300` (near right edge) |
| Player start | `x=150 y=400` (in front of terminal) |

**World bounds:** 2000px wide (from `ZONE_WIDTHS`)

**Accept criteria:** Scene renders all elements, player can walk to door

---

#### Sprint 3.2 — Zone 1: Interactables + Lore
**Component:** Zone interactables

**Files to create:**
- `src/game/entities/Interactable.tsx` — base glow effect + onClick dispatch
- Zone 1 terminal interaction: shows profile data (name, headline, summary)
- Zone 1 filing cabinet: hidden lore fragment LF-1

**Interaction flows:**
- **Terminal**: Player walks near → press E → dialogue overlay with profile.name, profile.headline, profile.summary, metrics → press E to close → zone progress +10%
- **Filing cabinet**: Player walks near → press E → "You find a hidden note: 'The subject began their journey in a small town...'" → `COLLECT_LORE('lf-1')` → progress +5%

**Visual spec (Interactable glow):** `box-shadow: 0 0 12px rgba(240, 224, 64, 0.3)` pulsing via Framer Motion

**Accept criteria:** Both interactables work, lore fragments collect, zone progress updates

---

### Phase 4 — Zone Content: Zone 2 Academy Room (3 sprints)

---

#### Sprint 4.1 — Zone 2 Background
**Component:** `Zone2Background`

**Files to create:**
- `src/game/art/backgrounds/Zone2Background.tsx` — CSS library/study

**Visual spec:**

| Layer | Element | CSS |
|-------|---------|-----|
| Far (sky/wall) | Warm dark gradient | `linear-gradient(180deg, #1a1208 0%, #221a0d 50%, #2a1f0a 100%)` |
| Far (bookshelves) | Tall rects with shelf | `width=120 height=500`, spaced 250px, fill `#1a1410` with `rgba(212, 160, 23, 0.05)` border |
| Mid (shelves) | Closer bookshelves | `width=140 height=520`, spaced 300px, fill `#151008` with `rgba(212, 160, 23, 0.1)` border |
| Books | Small rects on shelves | Random colors: `#8B4513`, `#556B2F`, `#8B0000`, `#191970`, `#4A0000` |
| Glowing books | 1 per shelf | Golden glow `box-shadow: 0 0 6px rgba(212, 160, 23, 0.4)` |
| Floor | Ground plane | `height=80px`, gradient `#2a1f0a` → `#1a1208`, top border `rgba(212, 160, 23, 0.2)` |

**Color palette zone accent:** Warm amber/gold (`#d4a017`, `#8B6914`, `#F0E040`)

---

#### Sprint 4.2 — Certificate Frames + Honors Pedestals
**Component:** Props for Zone 2

**Files to create:**
- `src/game/art/props/CertificateFrame.tsx` — framed certificate SVG
- `src/game/art/props/HonorsPedestal.tsx` — pedestal with trophy

**CertificateFrame visual spec:**
- **Frame**: `80×100px`, outer `#d4a017` (2px), inner `#f5f5f5` (1px)
- **Paper**: white fill with thin lines for text
- **Glow**: `box-shadow: 0 0 8px rgba(212, 160, 23, 0.3)`

**HonorsPedestal visual spec:**
- **Base**: trapezoid via CSS `clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)`, `#1a1a1a`
- **Top**: small rect `#d4a017`
- **Trophy icon**: small SVG cup shape or golden circle

**Generated instances:** Certificate frames auto-created from `licenses_certifications.json` data entries (49 certs → 6–8 frames displayed, randomly selected each load)

---

#### Sprint 4.3 — Timeline Sort Puzzle
**Component:** Timeline sort mini-game

**Files to create:**
- `src/game/puzzles/TimelineSort.tsx` — drag-to-order puzzle
- `src/game/props/DraggableCard.tsx` — draggable card with Framer Motion

**Data mapping:** 4 IoT certifications sorted by chronological date
| Card | Source |
|------|--------|
| "IoT Fundamentals" | cert with earliest date |
| "IoT Hardware" | next date |
| "IoT Networking & Security" | next date |
| "ESP32 Programming" | latest date |

**Visual spec:**
- **Cards**: `120×40px`, `#1a1a2a`, `border: 1px solid #d4a017`, yellow text
- **Slots**: 4 horizontal positions, dashed border `#555`
- **Correct slot**: green border `#40E060`
- **Wrong slot**: red flash `#E04040`
- **Dragging**: card scales up 1.05x, z-index 100, subtle shadow

**Interaction spec:**
1. 4 cards appear in random order at top
2. Player drags each card to one of 4 timeline slots
3. Submit button appears when all slots filled
4. On submit: check order → if correct, green glow + unlock zone 3 + achievement
5. If wrong: cards shake, hint appears ("Try ordering by date")
6. On 2nd failure: "Skip Puzzle" button appears

**Accept criteria:** Drag works, correct order passes, wrong order shows hint, skip available after 2 fails

---

### Phase 5 — Zone Content: Zone 3 Workshop (4 sprints)

---

#### Sprint 5.1 — Workshop Hub Background
**Component:** `Zone3HubBackground`

**Files to create:**
- `src/game/art/backgrounds/Zone3HubBackground.tsx` — CSS clean lab hub

**Visual spec:**
- **Gradient**: `linear-gradient(180deg, #0f1115 0%, #151820 50%, #1a1e2a 100%)`
- **Walls**: geometric panels (large rects with border `rgba(255,255,255,0.03)`)
- **3 doorways**: arch shapes (rounded rects) at positions `x=200`, `x=600`, `x=1000`
- Each doorway labeled: "AI LAB" / "WEB STUDIO" / "IOT WORKSHOP" with accent color
- **Floor**: grid pattern, cyan tint `rgba(100, 200, 255, 0.05)`

**Zone accent:** Cool blue/white (`#4080E0`, `#88BBFF`, `#FFFFFF`)

---

#### Sprint 5.2 — Sub-room Backgrounds (3 components)
**Components:**
- `src/game/art/backgrounds/Zone3AILab.tsx`
- `src/game/art/backgrounds/Zone3WebStudio.tsx`
- `src/game/art/backgrounds/Zone3IoTWorkshop.tsx`

**AI Lab visual spec:**
- **Gradient**: `#0a0f1a` → `#0d1530` → `#101a3a`
- **Monitors**: rects with blue glow `rgba(64, 128, 224, 0.3)`
- **Neural net**: SVG path lines + circles for nodes
- **Accent**: blue (`#4080E0`)

**Web Studio visual spec:**
- **Gradient**: `#1a0f08` → `#22150a` → `#2a1a0d`
- **Monitor arrangement**: 2-3 rects, warm orange glow
- **Code lines**: horizontal thin lines on screens
- **Accent**: orange (`#E07040`)

**IoT Workshop visual spec:**
- **Gradient**: `#081a12` → `#0a2218` → `#0d2a1f`
- **Workbench**: long rect `#1a1a2a` with top surface `#2a3a2a`
- **Oscilloscope**: circle screen with green trace line
- **Components**: small colored rects on bench
- **Accent**: green/cyan (`#40E060`, `#00ff88`)

---

#### Sprint 5.3 — Skill Display + Lab Workbench Prop
**Components:**
- `src/game/zones/subrooms/AI_Lab.tsx` — renders skill nodes from `skills.json` category "ML & AI"
- `src/game/zones/subrooms/Web_Studio.tsx` — renders skills from "Web Development" category
- `src/game/zones/subrooms/IoT_Workshop.tsx` — renders skills from "IoT & Hardware" category
- `src/game/art/props/LabWorkbench.tsx` — prop with microcontroller + sensor shapes

**Visual spec (skill node):**
- **Circle**: `40×40px`, `border: 2px solid` zone accent color
- **Proficiency**: fill level based on 1–5 scale (0% → 100%)
- **Label**: below circle, skill name, 10px font
- **Layout**: grid arrangement

**LabWorkbench visual spec:**
- **Table surface**: `200×20px`, `#2a3a2a`, top border `#3a4a3a`
- **Components**: small labeled SVGs (microcontroller, sensor, wire lines)

---

#### Sprint 5.4 — Workshop Puzzles (3 components)
**Components:**
- `src/game/puzzles/AIPipeline.tsx` — drag-to-order ML pipeline stages
- `src/game/puzzles/ComponentConnect.tsx` — match component ↔ microcontroller
- `src/game/puzzles/DebugChallenge.tsx` — find bugs in code block

**AI Pipeline visual spec:**
- Same card system as TimelineSort (reuse `DraggableCard`)
- 5 stages: "Data Collection" → "Preprocessing" → "Training" → "Evaluation" → "Deployment"

**Component Connect visual spec:**
- Left column: sensor names ("DHT11", "Load Cell", "Ultrasonic")
- Right column: microcontroller names ("ESP8266", "Wemos D1", "Arduino UNO")
- Player clicks sensor then clicks microcontroller to connect
- Correct connection: green line between them
- Wrong: red flash

**Debug Challenge visual spec:**
- Code block with monospace font, `#0a0a12` background, green text
- 3 bugs hidden in code (player clicks on lines with bugs)
- Bug found: line highlights red then green
- All 3 found: success

**Accept criteria:** All 3 puzzles playable, skippable after 2 fails, unlocking zone 4

---

### Phase 6 — Zone Content: Zone 4 Project District (4 sprints)

---

#### Sprint 6.1 — Zone 4 Background
**Component:** `Zone4Background`

**Files to create:**
- `src/game/art/backgrounds/Zone4Background.tsx` — CSS tech campus

**Visual spec:**

| Layer | Element | CSS |
|-------|---------|-----|
| Far (sky) | Gradient | `linear-gradient(180deg, #1a1410 0%, #221a14 30%, #2a1f18 60%, #1a1410 100%)` |
| Far (skyline) | Building silhouettes | Rects of varying heights (200–400px), fill `#151008`, opacity 0.5, spaced every 200px |
| Mid | Closer buildings | Rects height 300–500px, fill `#1a1410`, window grid dots |
| Sun/light source | Circle | `#F0E040` with `box-shadow`, large blur, top-left corner |
| Floor | Ground plane | `height=80px`, gradient + grid |

**Zone accent:** Golden hour sunset (`#F0E040`, `#E08030`, `#1a1410`)

---

#### Sprint 6.2 — Building Prop (Parameterized)
**Component:** `Building`

**Files to create:**
- `src/game/art/props/Building.tsx` — parameterized building SVG

**Props interface:**
```tsx
interface BuildingProps {
  x: number;
  y: number;
  style: 'glass' | 'brick' | 'industrial' | 'concrete' | 'server';
  width: number;
  height: number;
  featured?: boolean;
  label: string;
}
```

**Visual spec per style:**
| Style | Body color | Window color | Roof | Accent |
|-------|-----------|-------------|------|--------|
| Glass (ML) | `#2a3a5a` | `#00ffff` | Flat | Blue |
| Brick (Web) | `#5a3a2a` | `#ff8844` | Gabled | Orange |
| Industrial (IoT) | `#4a4a4a` | `#00ff88` | Sawtooth | Green |
| Concrete (CLI) | `#3a3a3a` | `#888888` | Flat | Grey |
| Server (DevOps) | `#2a2a3a` | `#0000ff` | Flat with vents | Blue |

- **Featured buildings**: `filter: drop-shadow(0 0 8px #F0E040)`, 1.2x scale
- Windows: grid of small dots (CSS `repeating-linear-gradient`)

---

#### Sprint 6.3 — Building Auto-generation
**Component:** Building generation from data

**Files to create:**
- `src/game/zones/Zone4_ProjectDistrict.tsx` — reads `projects.json`, renders Building per project

**Layout logic:**
- 21 projects → building entities spaced across 8000px zone
- Featured (6) → larger, golden glow, prominent position
- Category → determines `style` prop
- Each building clickable → enters interior view

**Feature scaling:**
- Featured projects: full interior room
- Standard projects: compact popup with text

---

#### Sprint 6.4 — Project Interior View
**Component:** Project room interior

**Files to create:**
- `src/game/zones/subrooms/ProjectRoom.tsx` — interior view when entering a building

**Visual spec:**
- **Room**: `800×500px` div centered, `#1a1a1a` background
- **Title**: project.name, impact font, `#F0E040`
- **Period**: small text, `#888`
- **Description**: body text, max 400px width, `#f5f5f5`
- **Links**: "Live Demo" and "GitHub" buttons with accent color
- **Skills**: tag pills (rounded rects with `#F0E040` border)
- **Media**: if `media[]` present, show simple gallery (rects with `#333` fill)
- **Close**: "×" button top-right or press Escape

---

### Phase 7 — Zone Content: Zone 5 Career Corridor (2 sprints)

---

#### Sprint 7.1 — Zone 5 Background
**Component:** `Zone5Background`

**Files to create:**
- `src/game/art/backgrounds/Zone5Background.tsx` — CSS long corridor

**Visual spec:**
- **Gradient**: `linear-gradient(180deg, #0f0f0f 0%, #151515 50%, #1a1a1a 100%)`
- **Floor**: dark, with timeline line (horizontal `#F0E040` stroke at y=70% of floor)
- **Timeline dots**: circles every 400px representing experience entries
- **Windows**: rects on upper wall with `rgba(255,255,255,0.05)` fill, spaced every 300px
- **Wall panels**: repeating vertical lines with subtle border

**Zone accent:** Professional grey/yellow (`#888`, `#F0E040`, `#555`)

---

#### Sprint 7.2 — Station Kiosk Prop + Career Content
**Components:**
- `src/game/art/props/StationKiosk.tsx` — interactive kiosk SVG
- `src/game/zones/Zone5_CareerCorridor.tsx` — auto-generates stations from `experience.json`

**StationKiosk visual spec:**
- **Body**: `80×120px` tall rect `#2a2a2a`
- **Screen**: `60×60px` at top, `#0a0a1a`, blue glow `rgba(64, 128, 224, 0.3)`
- **Base**: wider rect `#1a1a1a`
- **Label**: company name above or on kiosk

**Interaction per station:**
- Company name, role, period displayed
- Highlights as bullet list
- Technologies as tag pills
- "Read More" expands full description
- Volunteering segment at end of corridor

---

#### Sprint 7.3 — Decision Sim Puzzle
**Component:** `DecisionSim`

**Files to create:**
- `src/game/puzzles/DecisionSim.tsx` — branching choice narrative

**Visual spec:**
- **Background**: full-screen overlay `rgba(0,0,0,0.85)`
- **Scenario text**: typewriter effect, `#f5f5f5`, centered
- **Choices**: 3 buttons stacked vertically, `200×50px`, border `#555`
  - Hover: border `#F0E040`, text `#F0E040`
  - Clicked: border `#40E060`, text `#40E060`
- **Outcome text**: appears after choice, typewriter, then "Continue" button

**Data mapping:**
```
Scenario: "Deadline conflicts with code quality. What do you do?"
  Choice A: "Ship on time, refactor later" → Outcome: "Practical. Gets results."
  Choice B: "Delay for code quality" → Outcome: "Principled. Quality matters."
  Choice C: "Negotiate scope reduction" → Outcome: "Strategic. The mark of a leader."
```

**Accept criteria:** 3 choices, each shows unique outcome, unlocks zone 6 gate

---

### Phase 8 — Zone Content: Zone 6 Final Room (2 sprints)

---

#### Sprint 8.1 — Zone 6 Background
**Component:** `Zone6Background`

**Files to create:**
- `src/game/art/backgrounds/Zone6Background.tsx` — CSS circular room with starry ceiling

**Visual spec:**
- **Far layer**: `radial-gradient(circle at center, #1a1510 0%, #0f0a08 100%)`
- **Starry ceiling**: 20–30 small circles (`width=2 height=2`, `#fff` with `box-shadow`), randomly positioned
- **Wall rings**: concentric `border-radius: 50%` rings with `rgba(240, 224, 64, 0.05)`
- **Journey icons**: 6 small geometric icons (representing each zone) evenly spaced on circle
- **Floor**: circular platform gradient `#1a1a1a` → `#0f0a08`

**Zone accent:** Warm gold/dark (`#F0E040`, `#1a1510`, `#fff`)

---

#### Sprint 8.2 — Pedestal Prop + Final Monologue
**Components:**
- `src/game/art/props/Pedestal.tsx` — stone pedestal with open book
- Final Room interactable: monologue with typewriter

**Pedestal visual spec:**
- **Base**: trapezoid `polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)`, `#2a2a2a`
- **Top platform**: rect `#1a1a1a` with gold border
- **Book**: 2 angled rects (open book), `#d4a017` pages, golden glow `box-shadow`

**Monologue sequence (auto-triggered on entry):**
```
Line 1: "You've explored the data, the projects, the work."
Line 2: "Now you want to know: why?"
Line 3: "To build systems that matter."
Line 4: "To bridge the gap between intelligence and action."
Line 5: "To prove that a kid from Tulungagung can shape the future of AI."
Line 6: "This is not the end. This is where I begin."
```
Each line types out letter-by-letter (50ms per char). Player presses E to advance. After last line → credits roll.

**Journey wall stats:** SVG showing counts from game state (certifications collected, projects built, skills mastered, years grinding)

**Accept criteria:** All 6 text lines play, journey stats display, credits trigger

---

### Phase 9 — UI Components (12 sprints)

---

#### Sprint 9.1 — Title Screen
**Component:** `TitleScreen`

**Files to create:**
- `src/game/screens/TitleScreen.tsx`

**Visual spec:**
- **Background**: `#0A0A0A`
- **Logo**: "25DGAME", `font-size: 4rem`, `font-weight: 900`, `color: #F0E040`, `font-family: Impact`, centered
- **Boot animation sequence (CSS)**:
  1. Screen flicker (0.3s): flash white then settle to black
  2. Logo fade-in (0.8s): scale up from 0.8x to 1x + opacity 0→1
  3. Scanline drift overlay (subtle CSS animation)
  4. "Press any key to start" blink (0.5s interval) after 2s delay
- **Subtitle**: "Press any key to start", `#888`, `font-size: 1rem`, centered below logo
- **Click handler**: any key or click → dispatch `SET_SCREEN('menu')`

**Accept criteria:** Boot animation plays, any key advances to menu

---

#### Sprint 9.2 — Main Menu
**Component:** `MainMenu`

**Files to create:**
- `src/game/screens/MainMenu.tsx`

**Visual spec:**
- **Background**: `#0A0A0A`
- **Title**: "25DGAME", 2rem, Impact, `#F0E040`, centered
- **Menu items** (3 buttons, centered column):
  | Item | Default border | Selected border | Default color | Selected color |
  |------|---------------|-----------------|---------------|----------------|
  | "▶ START GAME" | `#555` | `#F0E040` | `#888` | `#F0E040` |
  | "■ ABOUT THIS" | `#555` | `#F0E040` | `#888` | `#F0E040` |
  | "★ CREDITS" | `#555` | `#F0E040` | `#888` | `#F0E040` |
- **Button style**: `background: transparent`, `padding: 12px 48px`, `font-size: 1.2rem`, Impact
- **Spacing**: `gap: 16px`, `margin-bottom: 32px` after title

**Navigation spec:**
| Input | Action |
|-------|--------|
| ArrowUp / W | Move selection up (wrap) |
| ArrowDown / S | Move selection down (wrap) |
| Enter / Space | Execute selected item |
| Mouse hover | Set selection to hovered |
| Mouse click | Execute clicked item |

**Accept criteria:** Full keyboard nav, mouse click also works, visual feedback on selection

---

#### Sprint 9.3 — About Modal
**Component:** `AboutModal`

**Files to create:**
- `src/game/screens/AboutModal.tsx`

**Visual spec:**
- **Layout**: centered `max-width: 600px` div
- **Title**: "What is This?", Impact, 2rem, `#F0E040`
- **Body text**: "25DGAME is an interactive portfolio experience. Explore the mind, work, and identity of Abdul Majid Ridwan through a 2.5D side-scrolling game."
- **Text style**: `#888`, Inter font, `line-height: 1.6`
- **Back button**: "← Back", `background: transparent`, `border: 1px solid #555`, `color: #888`, monospace

---

#### Sprint 9.4 — Credits Screen
**Component:** `CreditsScreen`

**Files to create:**
- `src/game/screens/CreditsScreen.tsx`

**Visual spec:**
- **Layout**: centered `max-width: 600px`
- **Title**: "Credits", Impact, 2rem, `#F0E040`
- **Content**: "Built with Astro, React, TypeScript, Tailwind CSS, and Framer Motion. All portfolio data is sourced from local JSON files."
- **Data sources list**: key files and their contribution
- **Back button**: same style as AboutModal

---

#### Sprint 9.5 — Pause Menu
**Component:** `PauseMenu`

**Files to create:**
- `src/game/ui/PauseMenu.tsx`

**Visual spec:**
- **Overlay**: `rgba(0,0,0,0.8)`, full screen
- **Menu items** (centered column, same button style as MainMenu):
  - "▶ RESUME" — closes overlay
  - "💾 SAVE" — triggers save
  - "📂 LOAD" — triggers load prompt
  - "⏭ SKIP GAME" — redirects to StandardPortfolio
  - "⟳ RESET" — confirmation prompt → clears save + resets state
- **Hotkey**: Escape to open/close
- **Close when**: clicking outside menu area or pressing Escape again

---

#### Sprint 9.6 — Dialogue Box
**Component:** `DialogueBox`

**Files to create:**
- `src/game/ui/DialogueBox.tsx`

**Visual spec:**
- **Position**: bottom third of screen, `width: 80%`, centered
- **Background**: `rgba(0,0,0,0.9)`
- **Border**: `2px solid #F0E040`
- **Text**: typewriter effect, char-by-char at 50ms, `#f5f5f5`, monospace
- **Cursor**: blinking `▌` at end of text while typing
- **Skip**: press E/Enter/Space to complete current text instantly
- **Next**: press E/Enter/Space to advance to next dialogue line
- **Close**: last line + E → dispatch close action
- **Name header**: top-left of box, speaker name in `#F0E040`, Impact, small

---

#### Sprint 9.7 — HUD
**Component:** `HUD`

**Files to create:**
- `src/game/ui/HUD.tsx`

**Visual spec:**
- **Layout**: fixed overlay, pointer-events: none
- **Top-left**: hamburger menu icon (☰), clickable → opens PauseMenu
- **Top-center**: zone name, small Impact font, `#F0E040`
- **Top-right**: lore counter "⬡ 0/9" + achievement count "⭐ 0/14", `#888`
- **Fade behavior**: visible on mouse-move or key-press → fade out after 3s idle → 0.5s transition

---

#### Sprint 9.8 — Achievement Toast
**Component:** `AchievementToast`

**Files to create:**
- `src/game/ui/AchievementToast.tsx`

**Visual spec:**
- **Position**: top-right corner
- **Background**: `#1a1a1a`, `border: 1px solid #F0E040`
- **Icon**: star circle, `#F0E040`
- **Text**: "Achievement Unlocked!" in `#F0E040`, achievement name in `#f5f5f5`
- **Animation**: slide in from right (Framer Motion `x: 100% → 0`), stay 4s, slide out
- **Queue**: if multiple achievements trigger, stack them vertically

---

#### Sprint 9.9 — Interaction Prompt
**Component:** `InteractionPrompt`

**Files to create:**
- `src/game/ui/InteractionPrompt.tsx`

**Visual spec:**
- **Position**: bottom-center, `z-index: 100`
- **Content**: "Press **E** to interact"
- **Style**: `#F0E040`, monospace, `background: rgba(0,0,0,0.8)`, `border: 1px solid #F0E040`, `padding: 8px 16px`, `border-radius: 4px`
- **Animation**: pulse via Framer Motion (opacity 0.7 → 1.0 → 0.7)
- **Show only**: when player is within `INTERACTION_DISTANCE` of an interactable

---

#### Sprint 9.10 — Visual Effects (Scanlines + Letterbox)
**Components:**
- `src/game/effects/Scanlines.tsx`
- `src/game/effects/Letterbox.tsx`

**Scanlines visual spec:**
- **CSS**: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)`
- **Position**: fixed overlay, full screen, `pointer-events: none`, `z-index: 9999`
- **Subtle**: opacity 0.3

**Letterbox visual spec:**
- **Bars**: top and bottom, `background: #0A0A0A`, `height: 60px` each
- **Animation**: bars animate in from top/bottom (Framer Motion `y: -100% → 0` / `y: 100% → 0`)
- **Used during**: cinematic moments (Final Room reveal, major cutscenes)

---

#### Sprint 9.11 — Transition Polish
**Components:** Enhance existing transitions

**Files to modify:**
- `src/game/effects/ScreenWipe.tsx` — polish timing
- `src/game/ui/ZoneTitle.tsx` — zone name overlay on entry

**ScreenWipe polish:**
- `800ms` horizontal wipe (center → edges)
- `600ms` zone name display with fade-in
- `400ms` fade to scene
- Zone name: Impact font, 3rem, `#F0E040`, "ZONE 1 — SPAWN AREA" format

**ZoneTitle overlay:**
- Appears on zone entry, positioned center, fades out after 2s
- Name: "SPAWN AREA" in large Impact
- Subtitle: small zone number

---

#### Sprint 9.12 — Standard Portfolio (Skip Game Fallback)
**Component:** `StandardPortfolio`

**Files to create:**
- `src/game/screens/StandardPortfolio.tsx`

**Visual spec:**
- **Layout**: Single scrollable page, max 800px wide, centered
- **Header**: name + headline + tagline
- **Sections**: About, Skills, Projects (compact grid), Experience (timeline), Certifications (compact list)
- **Style**: consistent with game aesthetic (dark bg, yellow accents, monospace body)
- **Links**: GitHub, LinkedIn, Resume download
- **Accessible**: full keyboard nav, screen reader friendly

**Accept criteria:** Shows all portfolio data in readable format, accessible without game interaction

---

### Phase 10 — Content Integration & Tuning (7 sprints)

---

#### Sprint 10.1 — Replace Mock Data
**Files to modify:**
- All zone files: replace hardcoded mock text with data from `src/game/data/index.ts`

**Data mapping:**
| Zone | Data source |
|------|-------------|
| Zone 1 Terminal | `profile.json` |
| Zone 2 Cert Frames | `licenses_certifications.json` |
| Zone 2 Honors | `honors.json` |
| Zone 3 Skills | `skills.json` per category |
| Zone 4 Buildings | `projects.json` |
| Zone 5 Stations | `experience.json` + `volunteering.json` |
| Zone 6 Stats | Aggregate from game state + all data |

---

#### Sprint 10.2 — Puzzle Tuning
**Files to modify:**
- All puzzle components (`TimelineSort`, `AIPipeline`, `ComponentConnect`, `DebugChallenge`, `DecisionSim`)

**Tuning parameters:**
- Hint appears after 60s of inactivity
- Skip Puzzle appears after 2 failed attempts
- Hardcode correct answers (no randomization for MVP)
- Visual feedback timing: 0.5s for correct, 1s for wrong

---

#### Sprint 10.3 — Hidden Lore Fragments
**Components:** 9 lore fragment placements

**Files to modify:**
- Each zone file (add hidden interactables)

| Fragment | Zone | Location | Trigger condition |
|----------|------|----------|-------------------|
| LF-1 | Zone 1 | Filing cabinet, interact 3 times | Counter-based |
| LF-2 | Zone 2 | Offset tile behind right bookshelf | Proximity + E |
| LF-3 | Zone 3 Hub | Under central "rug" (darker floor rect) | Proximity + E |
| LF-4 | Zone 3 AI Lab | Behind glowing screen | Proximity + E |
| LF-5 | Zone 3 Web Studio | Trash bin rect | Proximity + E |
| LF-6 | Zone 3 IoT Workshop | Component drawer | Proximity + E |
| LF-7 | Zone 4 | Gap between 2 buildings | Proximity + E |
| LF-8 | Zone 5 | Green plant rect, interact | Proximity + E |
| LF-9 | Zone 6 | Auto-granted on entry | Auto |

---

#### Sprint 10.4 — Achievement Triggers
**Files to modify:**
- `src/game/state/reducers/achievements.ts`

**Trigger conditions:**
| Achievement | Trigger |
|-------------|---------|
| First Contact | `totalInteractions >= 1` |
| Dedicated Student | `collectedCertIds.length >= 5` |
| Polyglot | `collectedCertIds.length >= 10` |
| Certified | `collectedCertIds.length >= 49` |
| AI Apprentice | `puzzlesCompleted.includes('ai-pipeline')` |
| Web Weaver | `puzzlesCompleted.includes('debug-challenge')` |
| IoT Tinkerer | `puzzlesCompleted.includes('component-connect')` |
| Project Hopper | `zonesVisited.includes('zone4')` (tracked) |
| Deep Dive | project interaction with full read |
| Career Scout | `zonesCompleted.includes('zone5')` |
| Decision Maker | `puzzlesCompleted.includes('decision-sim')` |
| Inner Circle | `zonesCompleted.includes('zone6')` |
| Lore Seeker | `loreFragments.length >= 1` |
| Lore Master | `loreFragments.length >= 9` |
| Speed Demon | `playTime < 900` (15 min) AND game completed |

---

#### Sprint 10.5 — Developer's Commentary Mode
**Component:** Hidden reward

**Files to create/modify:**
- Enable when all 9 lore fragments collected
- Adds toggle in pause menu: "💬 Developer Commentary"
- Shows text overlays during gameplay explaining design decisions
- Subtle `#888` smaller text at bottom of screen

---

#### Sprint 10.6 — Easter Eggs
**Files to modify:**
- Zone files for 2–3 easter egg placements

**Ideas:**
1. **Persona 4 reference**: TV static effect on one monitor in Zone 3, interact → "The truth is out there."
2. **Tech joke**: In Zone 5 corridor, a sticky note: "It's not a bug, it's a feature."
3. **Self-referential**: In Zone 4, one building labeled "25DGAME" → interact shows dev stats

---

#### Sprint 10.7 — Performance + Accessibility
**Files to modify:**
- Performance audit via Lighthouse
- Bundle analysis via `npx astro build` output
- CSS containment `contain: layout style paint` on world container
- Lazy zone loading
- `prefers-reduced-motion` fallback
- `aria-live` regions for dynamic content
- `aria-label` on interactables
- Keyboard nav verification (no mouse required)

---

### Phase 11 — Launch (6 sprints)

---

#### Sprint 11.1 — Build Optimization
- Enable compression
- Optimize SVG output
- Remove unused CSS via Tailwind purge
- Image for OG meta tag

---

#### Sprint 11.2 — Deploy Setup
- Deploy to Cloudflare Pages or Vercel
- Custom domain config
- `_redirects` / `vercel.json` for SPA fallback

---

#### Sprint 11.3 — SEO + Meta
- `robots.txt`
- `sitemap.xml`
- Open Graph meta tags (title, description, image)
- `favicon.ico` (could be small SVG of 25DGAME logo)

---

#### Sprint 11.4 — Resume Page
- `src/pages/resume.astro`
- Standard webpage version of resume content

---

#### Sprint 11.5 — README + Documentation
- Project overview
- Tech stack
- Setup instructions
- Architecture summary
- Contribution guide

---

#### Sprint 11.6 — Launch + Monitor
- Announce on LinkedIn
- Post on GitHub
- Share with peers for feedback
- Monitor analytics
- Plan iteration cycle

---

## 9. RISK ANALYSIS

### 9.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Rendering performance** with complex zone scenes | Low | High | Lazy zone loading, CSS containment, no Canvas, minimal DOM nodes |
| **State management complexity** across zones/puzzles/saves | Medium | Medium | Single Context + reducer pattern, typed actions, unit tests on reducers |
| **Puzzle interactivity** feels janky or unresponsive | Medium | Medium | Framer Motion for animations, simple drag/drop with pointer events |
| **localStorage size limits** (5MB) | Low | Low | Save data is tiny (<10KB JSON); large data is in static bundle |
| **Mobile/touch input** | Medium | Medium | Add touch D-pad overlay, or gracefully downgrade to standard portfolio |
| **Browser compatibility** of CSS animations | Low | Low | `@supports` queries, graceful degradation |

### 9.2 Design Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Visitors don't understand it's a portfolio** | Medium | High | "About" menu option, subtitle on title screen, clear zone names |
| **Too gamey, not professional enough** | Medium | High | Skip Game button, standard portfolio accessible at any time, professional typography |
| **Content feels thin** | Low | Medium | 21 projects, 49 certs, 7 experiences — rich content base |
| **Narrative is confusing** | Medium | Medium | Zone naming + titles clearly communicate purpose |
| **Persona aesthetic overwhelms content** | Low | Medium | Content always takes visual priority; UI frames content, doesn't replace it |

### 9.3 Scope Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Feature creep** (wanting more mechanics) | High | High | MVP-first: core loop + 6 zones + 5 puzzles. All extras in "Future Expansion" |
| **Puzzle development takes too long** | Medium | High | Puzzles are simple drag/sort/click; no physics, no complex logic. 2-attempt skip |
| **All 21 project rooms** feels overwhelming | High | Medium | Only 6 featured projects get full rooms; standard projects shown in compact list |
| **Hidden content** is never found | Low | Low | Lore counter shows "3/9 found" — players will hunt |
| **Testing on real visitors** reveals flow issues | Medium | Medium | Plan for 1 week buffer after Phase 4 for iterative fixes |

### 9.4 Solo Developer Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Burnout** from 7-week intensive build | Medium | High | Phases are 5–7 days with clear boundaries; take weekends off |
| **Knowledge gaps** in game dev patterns | Medium | Medium | HTML/CSS game (not Canvas) drastically reduces complexity |
| **Motivation dips** during Phase 2 (largest workload) | Medium | Medium | Break Zone 4 into 3 sub-tasks; celebrate each zone completion |

---

## 10. FUTURE EXPANSION

### 10.1 Advanced Mechanics

- **3D elements with Three.js/React Three Fiber** — select featured project rooms rendered in 3D
- **Ambient particle system** — floating data particles, circuit traces, matrix rain in IoT workshop
- **Dynamic lighting** — day/night cycle based on real time (subtle)
- **Audio system** — dynamic soundtrack that layers more instruments as zones progress
- **Responsive character** — player avatar changes appearance based on which zone they're in

### 10.2 AI Integration

- **AI Companion NPC** — an LLM-powered assistant that provides contextual hints and commentary on the portfolio content
- **Dynamic puzzle generation** — AI generates unique debugging challenges based on actual project code snippets
- **Chat with the Portfolio** — visitor can ask natural language questions about Abdul's experience, and the system responds with game-appropriate answers sourced from the JSON data
- **Personalized experience** — AI analyzes which zone the visitor spends most time in and adjusts content emphasis

### 10.3 Multiplayer & Social

- **Asynchronous ghosts** — see where other visitors walked (anonymized paths)
- **Visit counter** — subtle "X explorers have entered this world"
- **Social sharing** — visitors can share their achievement completion or lore fragment count
- **Comment book** — in the Final Room, a guestbook where visitors leave impressions

### 10.4 Content Scaling

- **Blog integration** — blog posts become "memory fragments" scattered across zones
- **GitHub activity feed** — recent commits displayed as live terminals in the Workshop
- **Dynamic project updates** — new projects auto-generate buildings in Project District
- **Multiple endings** — based on which zones the visitor focused on, different final room variations

### 10.5 Technical Scaling

- **Canvas rendering layer** — if HTML/CSS performance becomes limiting, migrate to Pixi.js or Phaser for specific high-performance zones
- **WebSocket real-time features** — for future multiplayer/ghost features
- **PWA support** — installable as a standalone app
- **Internationalization** — Indonesian language option

---

## APPENDIX: DATA FIX ACTIONS

Before any development begins, apply these fixes to source JSON files:

1. **Remove `additional_info.json.volunteering`** — redundant with `volunteering.json`
2. **Merge certifications** — pick one file as canonical, update `metrics.certifications` to correct count
3. **Add `id` fields** to honors, projects, experience entries (use slug from title)
4. **Standardize date formats** across all files to YYYY-MM-DD
5. **Fill empty `skills: []`** in certifications with inferred skills from issuer/category

---

*End of Blueprint — 25DGAME*  
*"This is unlike any portfolio I've ever seen."*
