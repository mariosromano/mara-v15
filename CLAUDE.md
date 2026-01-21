# Mara V15 - Project Context

## What is Mara?
Mara is an AI design assistant for MR Walls - a company that creates carved DuPont Corian wall surfaces. Mara helps architects and designers explore patterns, visualize designs, and get project information through a conversational chat interface.

## Current Architecture

### Three Data Catalogs

```
IMAGE_CATALOG      → Products (orderable patterns with specs, pricing)
PROJECTS_CATALOG   → Portfolio (7 completed installations/case studies)
VIDEOS_CATALOG     → Instructional content (2 videos)
```

**IMAGE_CATALOG (Products)** - ~40+ entries
- Fields: id, pattern, patternFamily, title, sector, corianColor, mood[], isBacklit, keywords[], image, specs{}, description
- Example patterns: Lake, Flame, Fins, Great Wave, Industrial Brick, Desert Sunset, Buddha Mandala, Nazare, Sand Dune

**PROJECTS_CATALOG (Portfolio)** - 7 entries
- Fields: id, title, client, location, sector, patterns[], designer, year, isBacklit, keywords[], image, description
- Projects:
  1. Water Feature Miami
  2. Capital One Arena (with Gensler)
  3. Rainbow RGB Coral (RGB programmable)
  4. Quantum Spa Cold Plunge
  5. LA Kings/Crypto Arena (with Gensler)
  6. Toll Brothers Lindley Facade
  7. The Strand Stairway

**VIDEOS_CATALOG (Instructional)** - 2 entries
- Fields: id, title, type (instructional/demo), description, keywords[], video, relatedProducts[]
- Videos:
  1. InterlockPanel Installation (how-to)
  2. Water Feature Demo

### Chat Logic Flow

```
User Input
    ↓
1. Generate intent ("create my own") → Start AI generate flow
2. Browse intent ("show me all") → Open gallery modal
3. Follow-up ("yes", "more", "show me more projects") → Cycle through content
4. Search catalogs:
   - searchProjects(query)
   - searchVideos(query)
   - searchImages(query)
5. Priority: Projects/Videos first → General questions (text-only) → Products
6. Context-aware follow-up question (won't ask "backlit?" if already backlit)
```

### Context Tracking

Each assistant message stores:
```javascript
{
  role: 'assistant',
  text: '...',
  image: {...} | null,           // Product from IMAGE_CATALOG
  project: {...} | null,         // Project from PROJECTS_CATALOG
  video: {...} | null,           // Video from VIDEOS_CATALOG
  contentType: 'project' | 'video' | null,
  projectIndex: 0-6,             // For cycling through projects
  videoIndex: 0-1,               // For cycling through videos
  allMatches: [...]              // For "show more" on products
}
```

### Key Behaviors

| User says | System does |
|-----------|-------------|
| "show me lake pattern" | Shows Lake product |
| "show me your projects" | Shows project from PROJECTS_CATALOG |
| "show me more projects" | Cycles to next project |
| "how does installation work?" | Shows video |
| "yes" / "more" | Shows next item of same type |
| "what's your company name?" | Text-only response (no image) |
| Random query, no match | Random diverse products |

### System Prompt Tags

Mara's system prompt tells Claude to use:
- `[Image: id]` for products
- `[Project: id]` for portfolio
- `[Video: id]` for instructional content

Local search functions serve as fallbacks when Claude doesn't use tags.

## Known Architecture Issue: Two Brains

Currently there are TWO decision-making systems that can conflict:

**Brain 1: Claude (API)**
- Generates conversational text
- Uses tags to specify media
- Doesn't know what was actually shown to user

**Brain 2: Local JavaScript**
- searchImages(), searchProjects(), searchVideos()
- Follow-up logic ("yes" → show next)
- Context tracking

**The conflict:** Claude might ask "see it backlit?" when local system already showed backlit image. User says "yes" and local system decides what to show, but Claude doesn't know.

### Future Consideration: Unify to One Brain

**Option A: Claude-First**
- Claude makes ALL decisions
- Pass full context of what was shown
- Claude returns structured JSON with media choices
- Local system only renders

**Option B: Local-First**
- Claude only generates text
- All media decisions rule-based
- Faster but less intelligent

**Option C: Better Handoff**
- Keep both but sync context
- Tell Claude what was shown
- Claude informs local logic

## File Structure

```
/src/MaraV15.jsx    - Main component (all logic, catalogs, UI)
/.env               - VITE_ANTHROPIC_API_KEY for Claude API
/CLAUDE.md          - This file (project memory)
```

## Recent Changes (Jan 2025)

1. Created separate PROJECTS_CATALOG and VIDEOS_CATALOG (was all in IMAGE_CATALOG)
2. Added project/video cycling with "yes" / "show me more"
3. Fixed: No longer asks "backlit?" for already-backlit images
4. Fixed: Projects/videos don't fall through to product logic
5. Fixed: Removed Buddha as default fallback (now random diverse)
6. Increased chat image sizes by 20%
7. Added download button for AI-generated images

## Git Branch

Main branch: `main`
Deployed to: Vercel (mara-v15.vercel.app)
