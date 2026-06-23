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
│   ├── data/
│   │   ├── index.ts                   # Unified loader: aggregates all JSON
│   │   ├── transform.ts               # Normalization utilities
│   │   ├── __generated__/
│   │   │   └── types.ts               # (Auto) Generated from JSON schema
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
- Player sprite: CSS-styled div with pseudo-element character
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

### Phase 0 — Planning & Scaffolding (Week 1)

**Goal:** Project setup, data normalization, architecture validation

**Tasks:**
1. Initialize Astro + React + TypeScript project
2. Install Tailwind CSS, Framer Motion
3. Configure `tsconfig.json` with path aliases (`@data/*`, `@game/*`)
4. Create folder structure per architecture blueprint
5. Write all TypeScript interfaces in `types.ts`
6. Create `src/game/data/transform.ts` — normalize all JSON data
7. Create `src/game/data/index.ts` — unified data loader
8. Write data validation unit tests (vitest or bun:test)
9. Set up ESLint + Prettier config
10. Set up GitHub repo + CI (basic lint + typecheck)

**Dependencies:** None  
**Risks:** JSON schema inconsistencies (see data audit) — mitigate by fixing source files first  
**Deliverables:** Running project skeleton, typed data layer, passing tests  
**Timeline:** 5–7 days

### Phase 1 — Foundation (Week 2)

**Goal:** Core engine, state management, player movement

**Tasks:**
1. Implement `GameContext` + reducers (progress, inventory, achievements, puzzles)
2. Implement `useSaveState` — localStorage read/write with versioning
3. Build `GameCanvas` component — viewport container
4. Build `useGameLoop` — requestAnimationFrame tick (for timer only)
5. Build `useCamera` — player-following camera with spring physics
6. Build `usePlayerMovement` — arrow/WASD input → position state
7. Build `useCollision` — AABB collision against world bounds
8. Build `useInteraction` — proximity detection + E key dispatch
9. Create `Player` entity component
10. Create `Interactable` base entity component
11. Create `Door` entity component with zone transition trigger
12. Implement `ScreenWipe` transition animation
13. Create `HUD` component with zone name, progress, counters

**Dependencies:** Phase 0 complete  
**Risks:** Movement physics feeling unpolished — tune spring values early  
**Deliverables:** Playable prototype: player moves in a test world, collides with boundaries, triggers interactions  
**Timeline:** 5–7 days

### Phase 2 — World Building (Week 3–4)

**Goal:** All six zones built with content from JSON

**Tasks:**
1. Build `ZoneRenderer` — zone routing + mount/unmount
2. **Zone 1:** Spawn Area scene, terminal interactable, filing cabinet lore
3. **Zone 2:** Academy Room scene, certificate frames (auto-generated from data), honors pedestals, Timeline Sort puzzle
4. **Zone 3:** Workshop hub + 3 sub-room scenes, skill displays per category, AI Pipeline + Component Connect + Debug Challenge puzzles
5. **Zone 4:** Project District scene, auto-generated building entities from `projects.json`, building interior view, 6 featured project premium interiors
6. **Zone 5:** Career Corridor scene, auto-generated stations from `experience.json`, volunteering segment, Decision Sim puzzle
7. **Zone 6:** Final Room scene, monologue pedestal, journey wall stats
8. Zone unlock logic in progress reducer
9. Zone title overlays on entry

**Dependencies:** Phase 1, all normalized data  
**Risks:** Zone 4 is largest — parallelize by scaffolding one building and testing, then generate remaining  
**Deliverables:** Full game loop playable from title to Final Room  
**Timeline:** 10–14 days

### Phase 3 — UI & Polish (Week 5)

**Goal:** Title screen, menus, HUD, effects, transitions

**Tasks:**
1. `TitleScreen` — PS2 boot animation sequence (CSS animation sequence: logo fade, scanline drift, "Press any key" blink)
2. `MainMenu` — keyboard-navigated menu with arrow highlight effect
3. `AboutModal` — "What is this?" explanation screen
4. `CreditsScreen` — data sources, tech stack, references
5. `PauseMenu` — Resume, Save, Load, Skip Game, Reset
6. `DialogueBox` — typewriter effect with persona-style styling
7. `AchievementToast` — slide-in notification
8. `InteractionPrompt` — "Press E" with pulse animation
9. `Scanlines` — subtle CRT overlay component
10. `Letterbox` — cinematic bars for important moments
11. `StandardPortfolio` — fallback "Skip Game" page (simple bio + links)
12. Transitions: screen wipe, fade, zone title overlay polish

**Dependencies:** Phase 2 zones  
**Risks:** Title screen animation complexity — keep CSS-based, avoid JS animationlibs  
**Deliverables:** Polished, cinematic-quality game experience  
**Timeline:** 5–7 days

### Phase 4 — Content Integration & Tuning (Week 6)

**Goal:** All data integrated, balanced, tested

**Tasks:**
1. Replace mock data with real normalized data in all zones
2. Tune puzzle difficulty (attempt counts, hint timing)
3. Implement hidden lore fragment placement in all 9 locations
4. Implement achievement trigger logic across all events
5. Implement secret "Developer's Commentary" mode (lore master reward)
6. Add "speedrun timer" (optional, hidden toggle)
7. Easter eggs: 2–3 pop culture references (Persona 4 references, tech jokes)
8. Performance profiling: Lighthouse, bundle analysis
9. Accessibility audit: keyboard nav, screen reader, reduced motion
10. Cross-browser testing (Chrome, Firefox, Safari)
11. Mobile responsiveness (graceful degradation)

**Dependencies:** Phase 3 UI complete  
**Risks:** Puzzle balance — test with 3 external users  
**Deliverables:** Feature-complete game, QA-ready  
**Timeline:** 5–7 days

### Phase 5 — Launch (Week 7)

**Goal:** Deploy, announce, iterate

**Tasks:**
1. Astro production build optimization
2. Deploy to Cloudflare Pages (recommended) or Vercel
3. Custom domain setup (if applicable)
4. `robots.txt` + `sitemap.xml` config
5. Open Graph meta tags for social preview
6. Add `resume_url` → `/resume` route
7. Write README
8. Announce on LinkedIn + GitHub
9. Monitor analytics (post-launch)
10. Collect feedback, plan Phase 6 improvements

**Dependencies:** Phase 4  
**Risks:** Deploy platform limits — Cloudflare Pages free tier sufficient for SSG  
**Deliverables:** Live, production-ready portfolio game  
**Timeline:** 3–5 days

### Phase 0–5 Total Timeline: 6–7 weeks

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
