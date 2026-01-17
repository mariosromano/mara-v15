# Mara v6 - MR Walls Design Assistant

AI-powered design assistant for exploring carved Corian wall surfaces.

## Features

- **Single-image flow** — Large image left, chat right
- **Claude-powered** — Intelligent image selection based on conversation
- **36 images** — 10 patterns across multiple sectors
- **Specs modal** — Click any image for details, pricing, downloads

## Deploy to Vercel

### Step 1: Push to GitHub
1. Create new repo called `mara-v6`
2. Upload all these files

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project" → Import your GitHub repo
3. Add Environment Variable:
   - Name: `VITE_ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key from console.anthropic.com
4. Click Deploy

### Step 3: Done!
You'll get a URL like `mara-v6.vercel.app`

## Local Development

```bash
npm install
cp .env.example .env
# Edit .env and add your Anthropic API key
npm run dev
```

## Adding Real Images

Edit the `IMAGE_CATALOG` array in `src/MaraV6.jsx`. Each image has an `image_url` field — add your Cloudinary URLs there:

```javascript
{
  "id": "billow-strand-purple-01",
  "image_url": "https://res.cloudinary.com/your-cloud/image/upload/v123/billow-strand.jpg",
  // ... other fields
}
```

## Patterns Included

- Billow (4 images)
- Seattle (4 images)
- Great Wave (5 images)
- Brick (5 images)
- Custom Portrait (2 images)
- Buddha Mandala (2 images)
- Fins (2 images)
- Flame (4 images)
- Desert Sunset (4 images)
- Sand Dune (4 images)
