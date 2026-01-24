# Mara V15 - Project Context

## What is Mara?
Mara is an AI design assistant for MR Walls - a company that creates carved DuPont Corian wall surfaces. Mara helps architects and designers explore patterns, visualize designs, and get project information through a conversational chat interface.

## Architecture: One Brain
Claude API makes ALL decisions about what content to show. Local code just renders.

### Key Files
```
/src/MaraV15-onebrain.jsx  - Main component (all logic, catalogs, UI)
/src/main.jsx              - Entry point
/.env                      - API keys (VITE_ANTHROPIC_API_KEY, VITE_FAL_API_KEY)
/CLAUDE.md                 - This file (project memory)
```

---

## Three Data Catalogs

### IMAGE_CATALOG (Products) - ~45 entries
Orderable patterns with specs and pricing.
- Fields: id, pattern, patternFamily, title, sector, corianColor, mood[], isBacklit, isWaterFeature, keywords[], image, additionalImages[], shopDrawing, specs{}, description
- Key patterns: Lake, Flame, Fins, Great Wave, Industrial Brick, Desert Sunset, Buddha Mandala, Fingerprint, Billow, Honey, Bloom, Flame 2-Sheet

### PROJECTS_CATALOG (Portfolio) - 3 entries
Completed installations/case studies.
- Fields: id, title, client, location, sector, patterns[], designer, year, isBacklit, keywords[], image, description
- Projects: LAX American Airlines, Morongo Casino, Capital One Arena

### VIDEOS_CATALOG (Instructional) - 2 entries
- InterlockPanel Installation (how-to)
- Water Feature Demo

---

## Pricing (Updated Jan 2025)
| Type | Price |
|------|-------|
| Linear Patterns (Industrial Brick) | $25/SF |
| Ready Made Designs (Flame, Great Wave, Buddha, Cactus) | $50/SF |
| Backlighting add-on | +$50/SF |
| Lead time | 4-6 weeks |

---

## System Prompt Tags
Claude uses these tags to specify media:
- `[Image: id]` - shows a product from IMAGE_CATALOG
- `[Project: id]` - shows a project from PROJECTS_CATALOG
- `[Video: id]` - shows a video from VIDEOS_CATALOG

### Catalog Selection Rules
- "your work", "projects", "portfolio" -> PROJECTS_CATALOG
- Specific pattern names, "products" -> IMAGE_CATALOG
- "installation", "how to" -> VIDEOS_CATALOG

---

## AI Generate Feature

### FAL API Configuration
```javascript
Endpoint: https://fal.run/fal-ai/flux-2/lora
Auth Header: Authorization: Key ${VITE_FAL_API_KEY}
```

### LoRA Models
| Model | Trigger | Scale | Status |
|-------|---------|-------|--------|
| Lake | `mrlake` | 1.0 | Production Ready |
| Flame | `mrflame` | 1.3 | Internal only (~15 gens needed) |
| Fins | `fnptrn` | 1.0 | Untested |

### LoRA URLs
```
Lake:  https://v3.fal.media/files/b/0a87e361/Tc4UZShpbQ9FmneXxjoc4_pytorch_lora_weights.safetensors
Flame: https://v3.fal.media/files/b/0a883628/Iyraeb6tJunafTQ8q_i5N_pytorch_lora_weights.safetensors
Fins:  https://v3.fal.media/files/b/0a87f1e6/mBUGXAbUMaM1wWFhzhI9g_pytorch_lora_weights.safetensors
```

### Generation Parameters
```javascript
{
  image_size: 'landscape_16_9',
  num_images: 1,
  output_format: 'jpeg',
  guidance_scale: 2.5,
  num_inference_steps: 28,
  enable_safety_checker: false
}
```

### Prompt Best Practices
- Pattern description must include "carved white Corian" prominently
- Trigger word at END of prompt
- Include lighting type (backlit, grazing, natural)
- Add photography style ("architectural photography", "shot on Sony A7R IV")

---

## UI Features

### Chat
- Centered layout (max-w-3xl)
- Auto-focus input after messages
- Clickable images open specs page

### Gallery Modal (Browse All)
- Grid of all products grouped by pattern family
- Click to open product specs

### Product Specs Page
- Hero image with pattern gallery (supports additionalImages)
- Specifications grid
- Pricing section
- Shop drawing download (if available)
- Request Quote / Add to Inquiry buttons

### AI Generate Modal
- Step-by-step: Pattern -> Sector -> Application -> Backlight -> Generate
- Progress dots indicator
- Download and "Generate Another" buttons

---

## Environment Variables

### Local (.env)
```
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
VITE_FAL_API_KEY=3e417ede-cd4b-4b81-8116-...
```

### Vercel
Same variables in Project Settings -> Environment Variables
Remember to Redeploy after changing env vars!

---

## Deployment
- **Repo:** github.com/mariosromano/mara-v15
- **Branch:** main
- **Hosting:** Vercel (auto-deploys on push)
- **URL:** https://mara-v15.vercel.app

---

## Git Branches
- `main` - Production (One Brain architecture)
- `one-brain` - Development branch
- `two-brain-backup` - Old architecture backup

---

## Cloudinary

### Image URLs
```
Base: https://res.cloudinary.com/dtlodxxio/image/upload/
```

### PDF Downloads
Use `raw/upload` for downloadable PDFs:
```
https://res.cloudinary.com/dtlodxxio/raw/upload/filename.pdf
```

Enable "Allow delivery of PDF and ZIP files" in Cloudinary Security settings.

---

## Common Issues & Fixes

### "Failed to fetch" on AI Generate
- Check VITE_FAL_API_KEY exists in Vercel env vars
- Redeploy after adding env vars

### CORS error on FAL API
- Use synchronous endpoint `fal.run` not `queue.fal.run`
- Polling endpoints have CORS restrictions

### LoRA not showing in generated images
- Ensure trigger word is at END of prompt
- Use `flux-2/lora` endpoint (not `flux-lora`)
- Pattern description must include "carved white Corian"

### Claude showing products instead of projects
- System prompt has CRITICAL section for catalog selection
- PROJECTS_CATALOG listed before IMAGE_CATALOG in prompt

---

## Recent Changes (Jan 2025)

1. Migrated from Two-Brain to One-Brain architecture
2. Added AI Generate feature with FAL LoRA integration
3. Added Gallery Modal (Browse All)
4. Added Product Specs Page with shop drawing downloads
5. Added new products: Fingerprint, Billow, Honey, Bloom, Flame 2-Sheet
6. Updated pricing: Linear $25, Ready Made $50, Backlit +$50
7. Fixed catalog selection (projects vs products)
8. Centered chat layout

---

*Last Updated: January 23, 2026*
