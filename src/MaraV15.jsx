import { useState, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// MARA V15 - V14 + AI Generate with FAL LoRA models
// "The only AI that shows you what you can actually build."
// ═══════════════════════════════════════════════════════════════════════════════

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dtlodxxio/image/upload';

// ⚠️ FAL API KEY
const FAL_API_KEY = "3e417ede-cd4b-4b81-8116-2684760b5a70:2e1ad6ff3d9d2a171a31d6ebc2612073";

// ═══════════════════════════════════════════════════════════════════════════════
// LORA MODELS FOR AI GENERATE
// ═══════════════════════════════════════════════════════════════════════════════

const LORA_MODELS = {
  lake: {
    name: 'Lake',
    trigger: 'mrlake',
    url: 'https://v3.fal.media/files/b/0a87e361/Tc4UZShpbQ9FmneXxjoc4_pytorch_lora_weights.safetensors',
    scale: 1.0,
    hasBacklight: true,
    description: 'Concentric ripples radiating outward',
    patternDescription: 'carved white Corian horizontal wave ridges'
  },
  flame: {
    name: 'Flame',
    trigger: 'mrflame',
    url: 'https://v3.fal.media/files/b/0a883628/Iyraeb6tJunafTQ8q_i5N_pytorch_lora_weights.safetensors',
    scale: 1.3,
    hasBacklight: true,
    description: 'Flowing vertical waves that interweave',
    patternDescription: 'carved white Corian flowing vertical waves interweaving'
  },
  fins: {
    name: 'Fins',
    trigger: 'fnptrn',
    url: 'https://v3.fal.media/files/b/0a87f1e6/mBUGXAbUMaM1wWFhzhI9g_pytorch_lora_weights.safetensors',
    scale: 1.0,
    hasBacklight: false,
    description: 'Diamond chevron fins with parallel ridges',
    patternDescription: 'carved white Corian diamond chevron fins'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTORS & APPLICATIONS FOR AI GENERATE
// ═══════════════════════════════════════════════════════════════════════════════

const SECTORS = {
  healthcare: {
    name: 'Healthcare',
    applications: ['Lobby', 'Elevator Lobby', 'Patient Room', 'Meditation Room']
  },
  corporate: {
    name: 'Corporate',
    applications: ['Reception', 'Elevator Lobby', 'Boardroom']
  },
  hospitality: {
    name: 'Hospitality',
    applications: ['Hotel Lobby', 'Restaurant', 'Bar', 'Spa']
  },
  residential: {
    name: 'Residential',
    applications: ['Living Room', 'Bathroom', 'Fireplace', 'Shower']
  }
};

const BACKLIGHT_COLORS = {
  warm: { name: 'Warm Golden', phrase: 'warm golden LED backlighting' },
  cool: { name: 'Cool White', phrase: 'cool white LED backlighting' },
  pink: { name: 'Pink', phrase: 'pink LED backlighting' },
  blue: { name: 'Blue', phrase: 'cool blue LED backlighting' },
  cyan: { name: 'Cyan', phrase: 'cyan LED backlighting' },
  purple: { name: 'Purple', phrase: 'purple LED backlighting' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT TEMPLATES FOR AI GENERATE
// ═══════════════════════════════════════════════════════════════════════════════

const PROMPT_TEMPLATES = {
  healthcare: {
    'Lobby': 'Grand modern hospital atrium lobby with double height glass curtain walls, sweeping curved reception desk, monumental floor to ceiling backlit feature wall with {pattern}, {backlight}, polished concrete floors, indoor trees, natural daylight flooding in, hyperrealistic healthcare architecture photography',
    'Elevator Lobby': 'Hospital elevator lobby with curved thermoformed walls wrapping around two elevator doors with bronze frames, {pattern}, {backlight}, LED cove light strip following curved ceiling line, polished stone floor, immersive sculptural healthcare interior, architectural photography',
    'Patient Room': 'Upscale hospital patient suite with comfortable bed, backlit headboard wall with {pattern}, {backlight}, boutique hotel aesthetic, wood grain accents, armchair for visitors, large window with garden view, natural daylight, healing hospitality design',
    'Meditation Room': 'Hospital meditation and prayer room, floor to ceiling backlit feature wall with {pattern}, {backlight}, wooden bench seating, peaceful spiritual atmosphere, healthcare wellness design'
  },
  corporate: {
    'Reception': 'Modern corporate headquarters lobby with floor to ceiling feature wall featuring {pattern}, {backlight}, grazing light revealing sculptural depth, polished concrete floor, reception desk, architectural photography',
    'Elevator Lobby': 'Corporate elevator lobby with stainless steel elevator doors, floor to ceiling backlit translucent wall with {pattern} glowing from behind, {backlight}, commercial office interior photography',
    'Boardroom': 'Executive boardroom with dramatic feature wall of {pattern}, {backlight}, polished conference table, leather chairs, sophisticated corporate interior'
  },
  hospitality: {
    'Hotel Lobby': 'Luxury hotel lobby with soaring ceilings, monumental backlit feature wall with {pattern}, {backlight}, marble floors, designer furniture, dramatic arrival experience',
    'Restaurant': 'Upscale restaurant interior with feature wall of {pattern}, {backlight}, intimate dining atmosphere, fine dining setting',
    'Bar': 'High-end bar with dramatic backlit wall featuring {pattern}, {backlight}, polished bar top, moody sophisticated atmosphere',
    'Spa': 'Luxury spa reception with calming feature wall of {pattern}, {backlight}, tranquil wellness environment, natural materials'
  },
  residential: {
    'Living Room': 'Contemporary living room with floor to ceiling backlit feature wall featuring {pattern} surrounding linear gas fireplace, {backlight}, sectional sofa, hardwood floors, residential interior design',
    'Bathroom': 'Luxury residential primary bathroom with seamless {pattern} walls, {backlight}, frameless glass enclosure, freestanding soaking tub, natural daylight from skylight, marble floor, spa-like atmosphere',
    'Fireplace': 'Modern fireplace surround with dramatic {pattern}, {backlight}, contemporary living space, warm intimate atmosphere',
    'Shower': 'Seamless luxury shower with {pattern} walls, {backlight}, frameless glass, rainfall showerhead, spa-like residential bathroom'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CORIAN COLOR DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const CORIAN_COLORS = {
  "Glacier White": { hex: "#f5f5f5" },
  "Deep Nocturne": { hex: "#1a1a1a" },
  "Carbon Concrete": { hex: "#3a3a3a" },
  "Dove": { hex: "#9a9a9a" },
  "Neutral Concrete": { hex: "#b8b5b0" },
  "Artista Mist": { hex: "#c5c5c5" },
  "Laguna": { hex: "#1e3a5f" },
  "Verdant": { hex: "#2d4a4a" },
  "Blue": { hex: "#2563eb" }
};

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE CATALOG (unchanged from V14)
// ═══════════════════════════════════════════════════════════════════════════════

const IMAGE_CATALOG = [
  // INDUSTRIAL BRICK - 6 Colors
  {
    id: 'industrial-brick-carbon',
    pattern: 'Industrial Brick',
    patternFamily: 'Industrial Brick',
    title: 'Industrial Brick',
    sector: 'Aviation',
    corianColor: 'Carbon Concrete',
    mood: ['dramatic', 'industrial', 'modern'],
    isBacklit: false,
    keywords: ['industrial', 'brick', 'carbon', 'concrete', 'dark', 'grey', 'gray', 'aviation', 'airport'],
    image: `${CLOUDINARY_BASE}/Carbon_Concrete-industrial_vxloqv.png`,
    specs: { material: 'DuPont Corian®', color: 'Carbon Concrete', maxPanel: '144" × 60"', leadTime: '6-10 Weeks', pricePerSF: 25, system: 'InterlockPanel™' },
    description: 'Industrial Brick in Carbon Concrete — dark shale grey. The texture pops against the dark background.'
  },
  {
    id: 'industrial-brick-dove',
    pattern: 'Industrial Brick',
    patternFamily: 'Industrial Brick',
    title: 'Industrial Brick',
    sector: 'Aviation',
    corianColor: 'Dove',
    mood: ['warm', 'neutral', 'calm'],
    isBacklit: false,
    keywords: ['industrial', 'brick', 'dove', 'grey', 'gray', 'warm', 'soft', 'aviation'],
    image: `${CLOUDINARY_BASE}/Dove_industrial_w6jvlx.png`,
    specs: { material: 'DuPont Corian®', color: 'Dove', maxPanel: '144" × 60"', leadTime: '6-10 Weeks', pricePerSF: 25, system: 'InterlockPanel™' },
    description: 'Industrial Brick in Dove — soft warm grey. Versatile, inviting, works anywhere.'
  },
  {
    id: 'industrial-brick-neutral',
    pattern: 'Industrial Brick',
    patternFamily: 'Industrial Brick',
    title: 'Industrial Brick',
    sector: 'Aviation',
    corianColor: 'Neutral Concrete',
    mood: ['neutral', 'honest', 'modern'],
    isBacklit: false,
    keywords: ['industrial', 'brick', 'neutral', 'concrete', 'light', 'grey', 'gray', 'aviation'],
    image: `${CLOUDINARY_BASE}/Neautral_concrete-industrial_v7gbel.png`,
    specs: { material: 'DuPont Corian®', color: 'Neutral Concrete', maxPanel: '144" × 60"', leadTime: '6-10 Weeks', pricePerSF: 25, system: 'InterlockPanel™' },
    description: 'Industrial Brick in Neutral Concrete — reads as honest material. Architects love it.'
  },
  {
    id: 'industrial-brick-artista',
    pattern: 'Industrial Brick',
    patternFamily: 'Industrial Brick',
    title: 'Industrial Brick',
    sector: 'Aviation',
    corianColor: 'Artista Mist',
    mood: ['subtle', 'refined', 'calm'],
    isBacklit: false,
    keywords: ['industrial', 'brick', 'artista', 'mist', 'grey', 'gray', 'subtle', 'aviation'],
    image: `${CLOUDINARY_BASE}/Artista_Mist_Industrial_zfaemp.png`,
    specs: { material: 'DuPont Corian®', color: 'Artista Mist', maxPanel: '144" × 60"', leadTime: '6-10 Weeks', pricePerSF: 25, system: 'InterlockPanel™' },
    description: 'Industrial Brick in Artista Mist — subtle movement in the surface.'
  },
  {
    id: 'industrial-brick-laguna',
    pattern: 'Industrial Brick',
    patternFamily: 'Industrial Brick',
    title: 'Industrial Brick',
    sector: 'Aviation',
    corianColor: 'Laguna',
    mood: ['bold', 'dramatic', 'statement'],
    isBacklit: false,
    keywords: ['industrial', 'brick', 'laguna', 'blue', 'deep', 'bold', 'statement', 'aviation', 'branding'],
    image: `${CLOUDINARY_BASE}/Laguna-blue-industrial_ksz6w7.png`,
    specs: { material: 'DuPont Corian®', color: 'Laguna', maxPanel: '144" × 60"', leadTime: '6-10 Weeks', pricePerSF: 25, system: 'InterlockPanel™' },
    description: 'Industrial Brick in Laguna — bold deep blue. Makes a real statement.'
  },
  {
    id: 'industrial-brick-verdant',
    pattern: 'Industrial Brick',
    patternFamily: 'Industrial Brick',
    title: 'Industrial Brick',
    sector: 'Aviation',
    corianColor: 'Verdant',
    mood: ['natural', 'calm', 'biophilic'],
    isBacklit: false,
    keywords: ['industrial', 'brick', 'verdant', 'green', 'teal', 'nature', 'calming', 'aviation'],
    image: `${CLOUDINARY_BASE}/Verdant_Industrial_bmkodk.png`,
    specs: { material: 'DuPont Corian®', color: 'Verdant', maxPanel: '144" × 60"', leadTime: '6-10 Weeks', pricePerSF: 25, system: 'InterlockPanel™' },
    description: 'Industrial Brick in Verdant — brings nature in. The deep teal is surprisingly calming.'
  },

  // LAKE
  {
    id: 'lake-backlit-1',
    pattern: 'Lake',
    patternFamily: 'Lake',
    title: 'Lake Backlit Feature Wall',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['calm', 'zen', 'glowing', 'dramatic'],
    isBacklit: true,
    keywords: ['lake', 'ripple', 'concentric', 'backlit', 'backlight', 'glow', 'zen', 'calm', 'meditation'],
    image: `${CLOUDINARY_BASE}/v1765939772/Lake_Backlight_Feature_Wall_with_Model_touch_bdzoxn.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '8 Weeks', pricePerSF: 65, enhancement: 'Backlighting', system: 'InterlockPanel™' },
    description: 'Lake pattern — concentric ripples radiating outward like a stone dropped in still water. Backlit for ethereal glow.'
  },

  // SOLDIER
  {
    id: 'soldier-facade-blue',
    pattern: 'Soldier',
    patternFamily: 'Soldier',
    title: 'Soldier Facade',
    sector: 'Healthcare',
    corianColor: 'Blue',
    mood: ['bold', 'patriotic', 'architectural', 'modern'],
    isBacklit: false,
    keywords: ['soldier', 'exterior', 'facade', 'siding', 'veterans', 'hospital', 'VA', 'blue', 'outdoor', 'cladding'],
    image: `${CLOUDINARY_BASE}/v1765771518/blue_-facade-_soldier-VA_-_Large_rc45wv.png`,
    specs: { material: 'DuPont Corian®', color: 'Blue', maxPanel: '12" × 12"', leadTime: '4 Weeks', pricePerSF: 45, system: 'Fins' },
    description: 'Soldier pattern — bold blue exterior facade panels. Perfect for Veterans Hospital and healthcare facilities.'
  },

  // SEATTLE
  {
    id: 'seattle-1',
    pattern: 'Seattle',
    title: 'Seattle Tiles',
    sector: 'Healthcare',
    corianColor: 'Mixed',
    mood: ['calm', 'modular', 'clinical'],
    isBacklit: false,
    keywords: ['seattle', 'tile', 'modular', 'healthcare', 'hospital', 'corridor'],
    image: `${CLOUDINARY_BASE}/Seattle-V2-tile-02_bvcqwc.png`,
    specs: { material: 'DuPont Corian®', color: 'Mixed (Dove + Glacier White)', maxPanel: '24" × 24" tiles', leadTime: '4 Weeks', pricePerSF: 35, system: 'Modular Tile' },
    description: 'Seattle modular tiles — alternating carved wave and flat panels. Perfect for healthcare.'
  },

  // GREAT WAVE
  {
    id: 'greatwave-1',
    pattern: 'Great Wave',
    title: 'Great Wave Artistic',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['dramatic', 'artistic', 'statement'],
    isBacklit: false,
    keywords: ['great wave', 'wave', 'ocean', 'japanese', 'hokusai', 'dramatic', 'artistic'],
    image: `${CLOUDINARY_BASE}/Great_Wave_banana_03_copy_herewl.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 48"', leadTime: '6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
    description: 'Great Wave — inspired by Hokusai. Dramatic, artistic statement piece.'
  },
  {
    id: 'greatwave-shower',
    pattern: 'Great Wave',
    title: 'Great Wave Shower',
    sector: 'Residential',
    corianColor: 'Glacier White',
    mood: ['calm', 'luxury', 'spa'],
    isBacklit: false,
    keywords: ['great wave', 'shower', 'bathroom', 'residential', 'luxury', 'spa'],
    image: `${CLOUDINARY_BASE}/Lim_Great_Wave_shower_contrast_square_copy_yvkh08.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 48"', leadTime: '6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
    description: 'Great Wave in residential shower — seamless, no grout lines.'
  },
  {
    id: 'greatwave-exterior',
    pattern: 'Great Wave',
    title: 'Great Wave Exterior',
    sector: 'Residential',
    corianColor: 'Glacier White',
    mood: ['dramatic', 'outdoor'],
    isBacklit: false,
    keywords: ['great wave', 'exterior', 'facade', 'outdoor', 'pool'],
    image: `${CLOUDINARY_BASE}/Great_Wave_banana_20_copy_abzou8.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 48"', leadTime: '8 Weeks', pricePerSF: 65, enhancement: 'UV-Stable Exterior', system: 'French Cleat' },
    description: 'Great Wave on exterior facade — UV-stable formulation handles full sun.'
  },
  {
    id: 'greatwave-restaurant',
    pattern: 'Great Wave',
    title: 'Great Wave Restaurant',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['dramatic', 'statement', 'social'],
    isBacklit: false,
    keywords: ['great wave', 'restaurant', 'hospitality', 'dining', 'feature wall'],
    image: `${CLOUDINARY_BASE}/Great_Wave_banana_09_copy_lcqfa0.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 48"', leadTime: '6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
    description: 'Great Wave as restaurant feature wall — photographs beautifully.'
  },
  {
    id: 'greatwave-lobby',
    pattern: 'Great Wave',
    title: 'Great Wave Lobby',
    sector: 'Corporate',
    corianColor: 'Glacier White',
    mood: ['dramatic', 'bold', 'corporate'],
    isBacklit: false,
    keywords: ['great wave', 'lobby', 'corporate', 'reception', 'feature wall'],
    image: `${CLOUDINARY_BASE}/Great_Wave_banana_16_copy_ojsshm.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 48"', leadTime: '6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
    description: 'Great Wave in corporate lobby — makes a statement about creativity.'
  },

  // BRICK WATER FEATURE
  {
    id: 'brick-water-1',
    pattern: 'Brick',
    title: 'Brick Water Feature',
    sector: 'Residential',
    corianColor: 'Deep Nocturne',
    mood: ['dramatic', 'luxury', 'tropical'],
    isBacklit: false,
    keywords: ['brick', 'water', 'fountain', 'pool', 'waterfall', 'outdoor', 'black'],
    image: `${CLOUDINARY_BASE}/Brick_waterfeature_05_copy_kewkyh.png`,
    specs: { material: 'DuPont Corian®', color: 'Deep Nocturne (Black)', maxPanel: '144" × 60"', leadTime: '8 Weeks', pricePerSF: 85, enhancement: 'Water Feature', system: 'InterlockPanel™' },
    description: 'Brick pattern water feature in black — carved lines channel water into waterfalls.'
  },
  {
    id: 'brick-water-2',
    pattern: 'Brick',
    title: 'Brick Pool Wall',
    sector: 'Residential',
    corianColor: 'Deep Nocturne',
    mood: ['dramatic', 'resort', 'luxury'],
    isBacklit: false,
    keywords: ['brick', 'water', 'pool', 'outdoor', 'cabana', 'resort', 'black'],
    image: `${CLOUDINARY_BASE}/Brick_waterfeature_18_copy_oce67r.png`,
    specs: { material: 'DuPont Corian®', color: 'Deep Nocturne (Black)', maxPanel: '144" × 60"', leadTime: '8 Weeks', pricePerSF: 85, enhancement: 'Water Feature', system: 'InterlockPanel™' },
    description: 'Monumental Brick water feature in black anchoring resort-style pool.'
  },
  {
    id: 'brick-water-3',
    pattern: 'Brick',
    title: 'Brick Backlit + Water',
    sector: 'Residential',
    corianColor: 'Glacier White',
    mood: ['dramatic', 'luxury', 'glowing'],
    isBacklit: true,
    keywords: ['brick', 'water', 'backlit', 'backlight', 'glow', 'night', 'dramatic', 'white'],
    image: `${CLOUDINARY_BASE}/Brick_waterfeature_20_copy_ffh4px.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '10 Weeks', pricePerSF: 120, enhancement: 'Backlit + Water Feature', system: 'InterlockPanel™' },
    description: 'Brick with backlighting AND water — light glows through carved channels.'
  },
  {
    id: 'brick-water-4',
    pattern: 'Brick',
    title: 'Brick Night Ambient',
    sector: 'Residential',
    corianColor: 'Deep Nocturne',
    mood: ['dramatic', 'evening', 'ambient'],
    isBacklit: false,
    keywords: ['brick', 'water', 'night', 'evening', 'black', 'ambient'],
    image: `${CLOUDINARY_BASE}/Brick_waterfeature_27_copy_nxcqhx.png`,
    specs: { material: 'DuPont Corian®', color: 'Deep Nocturne (Black)', maxPanel: '144" × 60"', leadTime: '8 Weeks', pricePerSF: 85, enhancement: 'Water Feature', system: 'InterlockPanel™' },
    description: 'Brick water feature at night — uplighting catches the spray.'
  },
  {
    id: 'brick-water-5',
    pattern: 'Brick',
    title: 'Brick Daylight',
    sector: 'Residential',
    corianColor: 'Deep Nocturne',
    mood: ['natural', 'outdoor', 'daylight'],
    isBacklit: false,
    keywords: ['brick', 'water', 'day', 'daylight', 'natural', 'pool', 'black'],
    image: `${CLOUDINARY_BASE}/Brick_waterfeature_12_copy_gdmjok.png`,
    specs: { material: 'DuPont Corian®', color: 'Deep Nocturne (Black)', maxPanel: '144" × 60"', leadTime: '8 Weeks', pricePerSF: 85, enhancement: 'Water Feature', system: 'InterlockPanel™' },
    description: 'Brick water feature in bright daylight — texture catches sun.'
  },

  // BUDDHA (backlit)
  {
    id: 'buddha-1',
    pattern: 'Buddha Mandala',
    title: 'Buddha Mandala Spa',
    sector: 'Wellness',
    corianColor: 'Glacier White',
    mood: ['calm', 'spiritual', 'meditation', 'zen'],
    isBacklit: true,
    keywords: ['buddha', 'zen', 'meditation', 'spiritual', 'calm', 'spa', 'wellness', 'backlit', 'backlight', 'glow'],
    image: `${CLOUDINARY_BASE}/spa-_Buddha_2_zid08z.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '8 Weeks', pricePerSF: 75, enhancement: 'Backlighting', system: 'InterlockPanel™' },
    description: 'Buddha mandala — custom carved with intricate detail. Backlit for ethereal glow.'
  },
  {
    id: 'buddha-2',
    pattern: 'Buddha Mandala',
    title: 'Buddha Restaurant',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['calm', 'zen', 'warm', 'dining'],
    isBacklit: true,
    keywords: ['buddha', 'restaurant', 'asian', 'zen', 'dining', 'backlit', 'backlight'],
    image: `${CLOUDINARY_BASE}/Spa_Buddha_restaurant_yybtdi.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '8 Weeks', pricePerSF: 75, enhancement: 'Backlighting', system: 'InterlockPanel™' },
    description: 'Buddha in restaurant setting — warm backlighting sets the mood.'
  },

  // MARILYN
  {
    id: 'marilyn-1',
    pattern: 'Custom Portrait',
    title: 'Marilyn Portrait',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['artistic', 'bold', 'custom', 'iconic'],
    isBacklit: false,
    keywords: ['marilyn', 'portrait', 'hollywood', 'custom', 'branding', 'art', 'celebrity'],
    image: `${CLOUDINARY_BASE}/Marilynn_sm_copy_gcvzcb.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '8 Weeks', pricePerSF: 85, system: 'InterlockPanel™' },
    description: 'Custom Marilyn portrait — any image can be carved. Brand logos, celebrities, custom artwork.'
  },
  {
    id: 'marilyn-2',
    pattern: 'Custom Portrait',
    title: 'Marilyn Art',
    sector: 'Art',
    corianColor: 'Glacier White',
    mood: ['artistic', 'gallery', 'sculptural'],
    isBacklit: false,
    keywords: ['marilyn', 'portrait', 'art', 'gallery', 'sculpture'],
    image: `${CLOUDINARY_BASE}/Maryilynn2_c71acw.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '8 Weeks', pricePerSF: 85, system: 'InterlockPanel™' },
    description: 'Marilyn as gallery art piece — carved Corian bridges architecture and fine art.'
  },

  // FINS
  {
    id: 'fins-1',
    pattern: 'Fins',
    title: 'Fins Exterior',
    sector: 'Corporate',
    corianColor: 'Glacier White',
    mood: ['modern', 'architectural', 'shadow'],
    isBacklit: false,
    keywords: ['fins', 'exterior', 'facade', 'corporate', 'modern', 'dimensional'],
    image: `${CLOUDINARY_BASE}/Fins_exterior_white_gcccvq.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '120" × 60"', leadTime: '8 Weeks', pricePerSF: 75, enhancement: 'UV-Stable Exterior', system: 'French Cleat' },
    description: 'Fins pattern on exterior facade — dimensional fins create deep shadow lines.'
  },
  {
    id: 'fins-2',
    pattern: 'Fins',
    title: 'Fins Patio',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['outdoor', 'dining', 'architectural'],
    isBacklit: false,
    keywords: ['fins', 'exterior', 'patio', 'restaurant', 'outdoor', 'dining'],
    image: `${CLOUDINARY_BASE}/Fins_exterior2_lh1vlw.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '120" × 60"', leadTime: '8 Weeks', pricePerSF: 75, enhancement: 'UV-Stable Exterior', system: 'French Cleat' },
    description: 'Fins on restaurant patio — architectural backdrop for outdoor dining.'
  },

  // FLAME
  {
    id: 'flame-1',
    pattern: 'Flame',
    title: 'Flame Pattern',
    sector: 'General',
    corianColor: 'Glacier White',
    mood: ['warm', 'organic', 'flowing', 'vertical'],
    isBacklit: false,
    keywords: ['flame', 'fire', 'warm', 'organic', 'flowing', 'vertical'],
    image: `${CLOUDINARY_BASE}/Flame-_qle4y3.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
    description: 'Flame pattern — flowing vertical waves that interweave. Warm, organic, dynamic.'
  },
  {
    id: 'flame-bed',
    pattern: 'Flame',
    title: 'Flame Headboard',
    sector: 'Residential',
    corianColor: 'Glacier White',
    mood: ['warm', 'intimate', 'luxury'],
    isBacklit: false,
    keywords: ['flame', 'bedroom', 'headboard', 'residential', 'luxury', 'warm'],
    image: `${CLOUDINARY_BASE}/Flamebed_yggqrp.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
    description: 'Flame as headboard wall — warm, inviting, perfect for primary bedroom.'
  },
  {
    id: 'flame-pink',
    pattern: 'Flame',
    title: 'Flame Pink RGB',
    sector: 'Residential',
    corianColor: 'Glacier White',
    mood: ['dramatic', 'romantic', 'bold', 'glowing'],
    isBacklit: true,
    keywords: ['flame', 'pink', 'rgb', 'backlit', 'backlight', 'bedroom', 'romantic', 'glow'],
    image: `${CLOUDINARY_BASE}/Flame_pink_obxnpm.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '8 Weeks', pricePerSF: 65, enhancement: 'RGB Backlighting', system: 'InterlockPanel™' },
    description: 'Flame with pink RGB backlighting — dramatic, romantic atmosphere.'
  },
  {
    id: 'flame-lobby',
    pattern: 'Flame',
    title: 'Flame Lobby',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['warm', 'energy', 'dramatic'],
    isBacklit: false,
    keywords: ['flame', 'lobby', 'feature', 'hospitality', 'hotel'],
    image: `${CLOUDINARY_BASE}/Flames_qthl01.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
    description: 'Flame in hospitality lobby — vertical movement draws the eye up.'
  },

  // DESERT SUNSET
  {
    id: 'desert-sunset-1',
    pattern: 'Desert Sunset',
    title: 'Desert Sunset Cactus',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['calm', 'regional', 'warm', 'southwestern'],
    isBacklit: true,
    keywords: ['desert', 'sunset', 'cactus', 'arizona', 'southwest', 'scottsdale', 'backlit', 'backlight'],
    image: `${CLOUDINARY_BASE}/v1768111216/mr-render-1767989995638_copy_vtszj0.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', height: '142"', width: '239¾"', slabs: 5, leadTime: '4 Weeks', pricePerSF: 35, enhancement: 'Backlighting', system: 'InterlockPanel™' },
    shopDrawing: `${CLOUDINARY_BASE}/v1768330379/shop_drawing-Cactus_rovjta.png`,
    description: 'Desert Sunset — saguaro cactus silhouettes against carved mountain ridges. Southwest hospitality.'
  },
  {
    id: 'desert-sunset-2',
    pattern: 'Desert Sunset',
    title: 'Desert Sunset Mountains',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['calm', 'warm', 'southwestern'],
    isBacklit: false,
    keywords: ['desert', 'sunset', 'mountain', 'landscape', 'southwest', 'warm'],
    image: `${CLOUDINARY_BASE}/v1768111216/mr-render-1767992780170_ufyyef.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4 Weeks', pricePerSF: 35, system: 'InterlockPanel™' },
    description: 'Desert Sunset variation — mountain ridges and desert sky.'
  },
  {
    id: 'desert-sunset-3',
    pattern: 'Desert Sunset',
    title: 'Desert Mountains Orange',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['warm', 'sunset', 'southwestern'],
    isBacklit: false,
    keywords: ['desert', 'mountain', 'landscape', 'warm', 'orange', 'hospitality'],
    image: `${CLOUDINARY_BASE}/mr-render-1768082338412_copy_wqymkx.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4 Weeks', pricePerSF: 35, system: 'InterlockPanel™' },
    description: 'Desert mountain landscape — carved ridgelines evoke the Southwest.'
  },
  {
    id: 'desert-sunset-4',
    pattern: 'Desert Sunset',
    title: 'Desert Abstract',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['calm', 'abstract', 'minimal'],
    isBacklit: false,
    keywords: ['desert', 'abstract', 'landscape', 'artistic'],
    image: `${CLOUDINARY_BASE}/mr-render-1767989272197_copy_eka0g1.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4 Weeks', pricePerSF: 35, system: 'InterlockPanel™' },
    description: 'Desert Sunset abstract — simplified mountain forms.'
  },

  // SAND DUNE
  {
    id: 'sanddune-curved-black',
    pattern: 'Sand Dune',
    title: 'Sand Dune Curved',
    sector: 'Corporate',
    corianColor: 'Deep Nocturne',
    mood: ['dramatic', 'sculptural', 'bold'],
    isBacklit: false,
    keywords: ['sand dune', 'curved', 'black', 'column', 'dramatic', 'thermoformed'],
    image: `${CLOUDINARY_BASE}/Fins_Sandune_texture_Curved_black_m1vtil.png`,
    specs: { material: 'DuPont Corian®', color: 'Deep Nocturne (Black)', maxPanel: '144" × 60"', leadTime: '10 Weeks', pricePerSF: 95, enhancement: 'Thermoformed Curve', system: 'InterlockPanel™' },
    description: 'Sand Dune pattern thermoformed into dramatic curved column.'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// SMART FAMILY GROUPING
// ═══════════════════════════════════════════════════════════════════════════════

const getFamilyImages = (selectedImage) => {
  if (!selectedImage) return [];
  
  if (selectedImage.patternFamily) {
    const colorVariants = IMAGE_CATALOG.filter(
      img => img.patternFamily === selectedImage.patternFamily && img.id !== selectedImage.id
    );
    if (colorVariants.length >= 3) return colorVariants.slice(0, 4);
  }
  
  const patternVariants = IMAGE_CATALOG.filter(
    img => img.pattern === selectedImage.pattern && img.id !== selectedImage.id
  );
  if (patternVariants.length >= 3) return patternVariants.slice(0, 4);
  
  const similar = IMAGE_CATALOG.map(img => {
    if (img.id === selectedImage.id) return { ...img, score: -1 };
    let score = 0;
    if (selectedImage.isBacklit && img.isBacklit) score += 5;
    if (selectedImage.specs.enhancement && img.specs.enhancement === selectedImage.specs.enhancement) score += 3;
    const sharedMoods = selectedImage.mood?.filter(m => img.mood?.includes(m)) || [];
    score += sharedMoods.length * 2;
    if (img.sector === selectedImage.sector) score += 2;
    const sharedKeywords = selectedImage.keywords.filter(k => img.keywords.includes(k));
    score += Math.min(sharedKeywords.length, 3);
    return { ...img, score };
  })
  .filter(img => img.score > 2)
  .sort((a, b) => b.score - a.score)
  .slice(0, 4);
  
  if (similar.length < 2) {
    return IMAGE_CATALOG.filter(img => img.id !== selectedImage.id).slice(0, 4);
  }
  return similar;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════════════════════════════════════

const searchImages = (query) => {
  if (!query) return [];
  const lower = query.toLowerCase();
  
  if (lower.includes('backlight') || lower.includes('backlit') || lower.includes('glow') || lower.includes('illuminat')) {
    return IMAGE_CATALOG.filter(img => img.isBacklit === true).slice(0, 2);
  }
  
  const terms = lower.split(/\s+/).filter(t => t.length > 2);
  const scored = IMAGE_CATALOG.map(img => {
    let score = 0;
    terms.forEach(term => {
      if (img.keywords.some(k => k.includes(term))) score += 15;
      if (img.pattern.toLowerCase().includes(term)) score += 12;
      if (img.sector.toLowerCase().includes(term)) score += 10;
      if (img.title.toLowerCase().includes(term)) score += 8;
      if (img.mood?.some(m => m.includes(term))) score += 6;
      if (img.corianColor?.toLowerCase().includes(term)) score += 5;
    });
    return { ...img, score };
  });
  
  return scored.filter(img => img.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);
};

// ═══════════════════════════════════════════════════════════════════════════════
// MARA SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════════════════════════

const MARA_SYSTEM_PROMPT = `You are Mara, the MR Walls design assistant. Brief, warm, knowledgeable.

## RULES
1. MAX 50 words for general chat, but OK to be longer for technical questions about installation/backlighting
2. Use [Image: id] tags for product images (max 2)
3. ONE question per response
4. For installation/backlight questions, share URLs as markdown links

## BACKLIGHT IMAGES ONLY (isBacklit: true)
- buddha-1, buddha-2
- brick-water-3
- flame-pink
- desert-sunset-1
- lake-backlit-1

When user asks "backlight" → ONLY show from this list.

## OTHER IDS
- Industrial Brick: industrial-brick-carbon, industrial-brick-laguna, etc.
- Lake: lake-backlit-1
- Soldier: soldier-facade-blue (exterior, facade, veterans hospital)
- Great Wave: greatwave-1, greatwave-shower, etc.
- Brick: brick-water-1 through 5
- Flame: flame-1, flame-bed, flame-pink, flame-lobby
- Desert Sunset: desert-sunset-1 through 4

## BACKLIGHTING
Backlighting is our signature capability. The carved surface becomes luminous.

How It Works:
- LED strips mount behind the panel
- Light transmits through the thinner carved areas
- Deeper cuts = more light transmission = brighter glow
- Creates gradient effects impossible with other materials

Technical Requirements:
- Clearance: 3" minimum from back of panel to LED strip
- LED type: 24V DC strips
- Color options: Static white, tunable CCT (2700K-6500K), RGB
- Power: ~4W per linear foot typical
- Dimming: 0-10V, DALI, or DMX compatible

MR Walls provides a complete backlighting package: All drawings, electrical sizing, drivers, and controls included.

Carve Depth Effects:
- 1/8" (shallow): Soft, diffused glow
- 1/4" (medium): Defined pattern with even light
- 3/8"+ (deep): Dramatic, bright transmission — LED placement matters more

## INSTALLATION REFERENCES
When user asks about backlight, "how do I backlight", installation, or construction:

MUST include:
1. Technical info: 3" clearance, 24V DC LEDs, complete package included
2. Installation detail URL: https://res.cloudinary.com/dtlodxxio/image/upload/v1765759401/Backlight_Install_Wip_detail.jpe_xmaf6u.jpg
3. Install video URL: https://res.cloudinary.com/dtlodxxio/video/upload/v1765772971/install_MR-LAX_720_-_puzzle_video_-_720_x_1280_m2ewcs.mp4

Example response:
"You'll need 3" clearance behind the panel for LEDs. We use 24V DC strips and provide everything — drawings, drivers, controls.

Installation detail: https://res.cloudinary.com/dtlodxxio/image/upload/v1765759401/Backlight_Install_Wip_detail.jpe_xmaf6u.jpg

Install video: https://res.cloudinary.com/dtlodxxio/video/upload/v1765772971/install_MR-LAX_720_-_puzzle_video_-_720_x_1280_m2ewcs.mp4"

Share the full URLs so users can click them.`;

const extractImageTags = (text) => {
  const matches = text.match(/\[Image:\s*([^\]]+)\]/g) || [];
  return matches.map(m => {
    const id = m.match(/\[Image:\s*([^\]]+)\]/)[1].trim();
    return IMAGE_CATALOG.find(img => img.id === id);
  }).filter(Boolean);
};

const cleanResponse = (text) => text.replace(/\[Image:\s*[^\]]+\]/g, '').trim();

// Helper to render text with clickable URLs
const renderTextWithLinks = (text) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-300 underline break-all"
        >
          {part.length > 50 ? part.slice(0, 50) + '...' : part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function MaraV15() {
  // Chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  
  // Intro text (no typing effect - instant)
  const fullIntro = "Hey! I'm Mara from MR Walls. I help architects explore carved Corian surfaces.\n\nTap an image to explore, ask me anything, or ";
  const generateLinkText = "I can generate a custom visualization";
  const afterLink = " for your space.";
  
  // Image viewing state
  const [selectedImage, setSelectedImage] = useState(null);
  const [familyImages, setFamilyImages] = useState([]);
  const [specsImage, setSpecsImage] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  
  // AI Generate state
  const [generateFlow, setGenerateFlow] = useState(null); // null, 'pattern', 'sector', 'application', 'backlight', 'generating'
  const [genPattern, setGenPattern] = useState(null);
  const [genSector, setGenSector] = useState(null);
  const [genApplication, setGenApplication] = useState(null);
  const [genBacklight, setGenBacklight] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [showGeneratedModal, setShowGeneratedModal] = useState(false);
  const [showAIGenView, setShowAIGenView] = useState(false);
  const [productMaraText, setProductMaraText] = useState('');
  const [productMaraComplete, setProductMaraComplete] = useState(false);

  const messagesEndRef = useRef(null);
  const modalInputRef = useRef(null);

  // Add initial images on mount (no typing effect)
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      text: '',
      images: [
        IMAGE_CATALOG.find(i => i.id === 'buddha-1'),
        IMAGE_CATALOG.find(i => i.id === 'greatwave-1')
      ],
      isIntroImages: true
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generateFlow]);

  // Product page Mara typing effect
  useEffect(() => {
    if (!specsImage) {
      setProductMaraText('');
      setProductMaraComplete(false);
      return;
    }

    const fullText = "How can I help? If you need a custom size I can connect you to our designers.";
    let i = 0;
    setProductMaraText('');
    setProductMaraComplete(false);

    const timer = setInterval(() => {
      if (i < fullText.length) {
        setProductMaraText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setProductMaraComplete(true);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [specsImage]);

  const getGalleryPatterns = () => {
    const patterns = {};
    IMAGE_CATALOG.forEach(img => {
      if (!patterns[img.pattern]) patterns[img.pattern] = [];
      patterns[img.pattern].push(img);
    });
    return patterns;
  };

  const handleImageClick = (img) => {
    // Go directly to product page
    setSpecsImage(img);
    setSelectedImage(null);
    setFamilyImages([]);
  };

  const handleFamilyClick = (img) => {
    setSpecsImage(img);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setFamilyImages([]);
    setSpecsImage(null);
  };

  const closeSpecs = () => {
    setSpecsImage(null);
    setSelectedImage(null);
    setFamilyImages([]);
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // AI GENERATE FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  const startGenerateFlow = () => {
    setGenerateFlow('pattern');
    setGenPattern(null);
    setGenSector(null);
    setGenApplication(null);
    setGenBacklight(null);
    setMessages(m => [...m, {
      role: 'assistant',
      text: "Let's create something. Choose a pattern:",
      isGenerateStep: true
    }]);
  };

  const selectPattern = (patternKey) => {
    setGenPattern(patternKey);
    setGenerateFlow('sector');
    setMessages(m => [...m, 
      { role: 'user', text: LORA_MODELS[patternKey].name },
      { role: 'assistant', text: `${LORA_MODELS[patternKey].name} — ${LORA_MODELS[patternKey].description}.\n\nWhat sector?`, isGenerateStep: true }
    ]);
  };

  const selectSector = (sectorKey) => {
    setGenSector(sectorKey);
    setGenerateFlow('application');
    setMessages(m => [...m,
      { role: 'user', text: SECTORS[sectorKey].name },
      { role: 'assistant', text: `Got it, ${SECTORS[sectorKey].name}. What application?`, isGenerateStep: true }
    ]);
  };

  const selectApplication = (app) => {
    setGenApplication(app);
    const model = LORA_MODELS[genPattern];
    
    if (model.hasBacklight) {
      setGenerateFlow('backlight');
      setMessages(m => [...m,
        { role: 'user', text: app },
        { role: 'assistant', text: 'What backlight color?', isGenerateStep: true }
      ]);
    } else {
      // Fins doesn't have backlight, go straight to generate
      setMessages(m => [...m, { role: 'user', text: app }]);
      generateImage(genPattern, genSector, app, null);
    }
  };

  const selectBacklight = (colorKey) => {
    setGenBacklight(colorKey);
    setMessages(m => [...m, { role: 'user', text: BACKLIGHT_COLORS[colorKey].name }]);
    generateImage(genPattern, genSector, genApplication, colorKey);
  };

  const buildPrompt = (patternKey, sectorKey, application, backlightKey) => {
    const model = LORA_MODELS[patternKey];
    const template = PROMPT_TEMPLATES[sectorKey]?.[application];
    const backlight = backlightKey ? BACKLIGHT_COLORS[backlightKey].phrase : 'soft ambient lighting';
    
    if (template) {
      let prompt = template.replace('{pattern}', model.patternDescription);
      prompt = prompt.replace('{backlight}', backlight);
      return `${prompt}, ${model.trigger}`;
    }
    
    return `Architectural interior with floor to ceiling feature wall featuring ${model.patternDescription}, ${backlight}, professional architecture photography, ${model.trigger}`;
  };

  const generateImage = async (patternKey, sectorKey, application, backlightKey) => {
    setGenerateFlow('generating');
    const model = LORA_MODELS[patternKey];
    const sectorName = SECTORS[sectorKey]?.name || sectorKey;
    const prompt = buildPrompt(patternKey, sectorKey, application, backlightKey);
    
    console.log('Generating with prompt:', prompt);
    
    setMessages(m => [...m, 
      { role: 'assistant', text: `Generating ${model.name} for ${sectorName} ${application}...`, isGenerateStep: true }
    ]);

    try {
      // Step 1: Submit to FAL queue
      const response = await fetch('https://queue.fal.run/fal-ai/flux-2/lora', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          loras: [{ path: model.url, scale: model.scale }],
          image_size: 'landscape_16_9',
          num_images: 1,
          output_format: 'jpeg',
          guidance_scale: 2.5,
          num_inference_steps: 28,
          enable_safety_checker: false
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const queueData = await response.json();
      console.log('Queue response:', queueData);

     // Step 2: Poll for result
      const requestId = queueData.request_id;
      let attempts = 0;
      const maxAttempts = 120;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`https://queue.fal.run/fal-ai/flux-lora/requests/${requestId}/status`, {
          headers: { 'Authorization': `Key ${FAL_API_KEY}` }
        });
        const statusData = await statusResponse.json();
        console.log('Poll attempt', attempts, statusData.status);

        if (statusData.status === 'COMPLETED') {
          break;
        } else if (statusData.status === 'FAILED') {
          throw new Error('Generation failed');
        }
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Generation timed out');
      }

      // Step 3: Fetch final result
      const resultResponse = await fetch(`https://queue.fal.run/fal-ai/flux-lora/requests/${requestId}`, {
        headers: { 'Authorization': `Key ${FAL_API_KEY}` }
      });
      const result = await resultResponse.json();

      // Step 3: Process result
      if (result.images && result.images.length > 0) {
        const genImg = {
          url: result.images[0].url,
          pattern: model.name,
          sector: sectorName,
          application: application,
          backlight: backlightKey ? BACKLIGHT_COLORS[backlightKey].name : null
        };
        setGeneratedImage(genImg);
        setShowGeneratedModal(true);
        setMessages(m => [...m,
          { role: 'assistant', text: `Here's your ${model.name} visualization! This design is buildable — we can generate shop drawings and pricing.`, isGenerateStep: true }
        ]);
      } else {
        throw new Error('No image returned');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setMessages(m => [...m, 
        { role: 'assistant', text: 'Hmm, something went wrong. Want to try again?', isGenerateStep: true }
      ]);
    } finally {
      setGenerateFlow('complete');
    }
  };
     

  const generateAnother = () => {
    setShowGeneratedModal(false);
    setGeneratedImage(null);
    setGenerateFlow('pattern');
    setGenPattern(null);
    setGenSector(null);
    setGenApplication(null);
    setGenBacklight(null);
    setMessages(m => [...m, {
      role: 'assistant',
      text: "Let's create another. Choose a pattern:",
      isGenerateStep: true
    }]);
  };

  const closeGeneratedModal = () => {
    setShowGeneratedModal(false);
  };

  const downloadGeneratedImage = async (url, pattern) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `MRWalls-${pattern}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // CLAUDE API
  // ═══════════════════════════════════════════════════════════════════════════════

  const callClaude = async (userMsg, hist) => {
    const apiMessages = [...hist, { role: 'user', content: userMsg }];
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          system: MARA_SYSTEM_PROMPT,
          messages: apiMessages
        })
      });
      const data = await response.json();
      if (data.content?.[0]) return data.content[0].text;
      throw new Error(data.error?.message || 'API error');
    } catch (error) {
      console.error('Claude API error:', error);
      return null;
    }
  };

  const send = async (text, fromModal = false) => {
    if (!text?.trim() || loading) return;
    
    const userMsg = text.trim();
    const lower = userMsg.toLowerCase();
    
    // Check for generate intent
    if (lower.includes('generate') || lower.includes('create') || lower.includes('visualiz')) {
      setInput('');
      setMessages(m => [...m, { role: 'user', text: userMsg }]);
      startGenerateFlow();
      if (fromModal) closeModal();
      return;
    }
    
    // Browse intent
    if (lower.includes('everything') || lower.includes('all image') || lower.includes('browse') || lower.includes('scroll') || lower.includes('gallery') || lower.includes('show me all') || lower.includes('see all')) {
      setMessages(m => [...m,
        { role: 'user', text: userMsg },
        { role: 'assistant', text: "Here's our full collection — tap any image to explore.", images: [] }
      ]);
      setShowGallery(true);
      if (fromModal) closeModal();
      return;
    }

    // Backlight / Installation intent
    if (lower.includes('backlight') || lower.includes('install') || lower.includes('how do i') || lower.includes('led') || lower.includes('clearance')) {
      setInput('');
      const backlightResponse = `Great question! Here's what you need to know:

**Technical Requirements:**
• 3" minimum clearance behind panel for LED strips
• 24V DC LED strips (we use high-quality strips)
• Power: ~4W per linear foot
• Dimming: 0-10V, DALI, or DMX compatible

**We provide a complete backlight package:** drawings, electrical sizing, drivers, and controls — all included.

**Carve depth affects the glow:**
• 1/8" shallow = soft diffused glow
• 1/4" medium = defined pattern
• 3/8"+ deep = dramatic bright transmission

Want me to show you some backlit patterns?`;

      setMessages(m => [...m,
        { role: 'user', text: userMsg },
        {
          role: 'assistant',
          text: backlightResponse,
          media: [
            { type: 'image', url: 'https://res.cloudinary.com/dtlodxxio/image/upload/v1765759401/Backlight_Install_Wip_detail.jpe_xmaf6u.jpg', caption: 'Installation detail — 3" spacing with acrylic stiffeners' },
            { type: 'video', url: 'https://res.cloudinary.com/dtlodxxio/video/upload/v1765772971/install_MR-LAX_720_-_puzzle_video_-_720_x_1280_m2ewcs.mp4', caption: 'InterlockPanel puzzle installation' }
          ]
        }
      ]);
      if (fromModal) closeModal();
      return;
    }
    
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userMsg }]);
    setLoading(true);

    const claudeResponse = await callClaude(userMsg, history);
    
    let responseText = '';
    let responseImages = [];
    
    if (claudeResponse) {
      responseImages = extractImageTags(claudeResponse);
      responseText = cleanResponse(claudeResponse);
      setHistory([...history, 
        { role: 'user', content: userMsg },
        { role: 'assistant', content: claudeResponse }
      ]);
    }
    
    if (!claudeResponse || responseImages.length === 0) {
      responseImages = searchImages(userMsg);
      if (responseImages.length > 0) {
        responseText = responseText || `Here's what I found:`;
      } else {
        responseText = responseText || "What sector is this for — healthcare, hospitality, residential?";
        responseImages = [IMAGE_CATALOG.find(i => i.id === 'buddha-1'), IMAGE_CATALOG.find(i => i.id === 'lake-backlit-1')];
      }
    }

    setMessages(m => [...m, {
      role: 'assistant',
      text: responseText,
      images: responseImages.slice(0, 2)
    }]);
    
    setLoading(false);
    if (fromModal) closeModal();
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  
  // Render intro text with clickable generate link (instant, no typing)
  const renderIntroText = () => {
    return (
      <>
        {fullIntro}
        <button
          onClick={startGenerateFlow}
          className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
        >
          {generateLinkText}
        </button>
        {afterLink}
      </>
    );
  };

  // Render generate flow buttons
  const renderGenerateButtons = () => {
    if (generateFlow === 'pattern') {
      return (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(LORA_MODELS).map(([key, model]) => (
            <button
              key={key}
              onClick={() => selectPattern(key)}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded-lg text-sm transition-colors"
            >
              {model.name}
            </button>
          ))}
        </div>
      );
    }
    
    if (generateFlow === 'sector') {
      return (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(SECTORS).map(([key, sector]) => (
            <button
              key={key}
              onClick={() => selectSector(key)}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded-lg text-sm transition-colors"
            >
              {sector.name}
            </button>
          ))}
        </div>
      );
    }
    
    if (generateFlow === 'application' && genSector) {
      return (
        <div className="flex flex-wrap gap-2 mt-3">
          {SECTORS[genSector].applications.map((app) => (
            <button
              key={app}
              onClick={() => selectApplication(app)}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded-lg text-sm transition-colors"
            >
              {app}
            </button>
          ))}
        </div>
      );
    }
    
    if (generateFlow === 'backlight') {
      return (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(BACKLIGHT_COLORS).map(([key, color]) => (
            <button
              key={key}
              onClick={() => selectBacklight(key)}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded-lg text-sm transition-colors"
            >
              {color.name}
            </button>
          ))}
        </div>
      );
    }
    
    if (generateFlow === 'generating') {
      return (
        <div className="flex items-center gap-2 mt-3">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-stone-400">Generating...</span>
        </div>
      );
    }
    
    if (generateFlow === 'complete') {
      return (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setShowGeneratedModal(true)}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded-lg text-sm transition-colors"
          >
            View Image
          </button>
          <button
            onClick={generateAnother}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm transition-colors"
          >
            Generate Another
          </button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="h-screen bg-stone-950 text-stone-100 flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Smoky Animation Styles */}
      <style>{`
        @keyframes smokeIn {
          0% {
            opacity: 0;
            backdrop-filter: blur(0px);
            transform: scale(1.02);
          }
          100% {
            opacity: 1;
            backdrop-filter: blur(8px);
            transform: scale(1);
          }
        }
        @keyframes smokeOut {
          0% {
            opacity: 1;
            backdrop-filter: blur(8px);
          }
          100% {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
        }
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .smoke-overlay {
          animation: smokeIn 0.5s ease-out forwards;
        }
        .smoke-content {
          animation: fadeSlideUp 0.6s ease-out 0.1s forwards;
          opacity: 0;
        }
        .pattern-card {
          animation: fadeSlideUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .pattern-card:nth-child(1) { animation-delay: 0.2s; }
        .pattern-card:nth-child(2) { animation-delay: 0.3s; }
        .pattern-card:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      {/* Header */}
      <header className="p-4 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-stone-700 to-stone-800 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-stone-300">M</span>
          </div>
          <div>
            <h1 className="font-semibold text-stone-100">Mara</h1>
            <p className="text-xs text-stone-500">Mara × MR Walls</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAIGenView(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-lg text-sm text-white font-medium transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            AI Generate
          </button>
          <button
            onClick={() => setShowGallery(true)}
            className="flex items-center gap-2 px-3 py-2 bg-stone-900 hover:bg-stone-800 rounded-lg border border-stone-700 text-sm text-stone-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Browse All
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Intro Message with Typing Effect */}
        <div className="flex justify-start">
          <div className="max-w-[85%]">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl px-4 py-3">
              <p className="text-sm whitespace-pre-wrap">{renderIntroText()}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%]">
              {msg.text && (
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-stone-700 text-stone-100' 
                    : 'bg-stone-900 border border-stone-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{renderTextWithLinks(msg.text)}</p>

                  {/* Show generate buttons after generate step messages */}
                  {msg.isGenerateStep && i === messages.length - 1 && renderGenerateButtons()}
                  
                  {/* Show generating spinner */}
                  {msg.isGenerating && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )}
              
              {msg.images && msg.images.length > 0 && (
                <div className={`grid grid-cols-2 gap-3 ${msg.text ? 'mt-3' : ''}`}>
                  {msg.images.map((img, j) => (
                    <button
                      key={j}
                      onClick={() => handleImageClick(img)}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 hover:border-stone-600 transition-all text-left"
                    >
                      <img src={img.image} alt={img.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-sm font-medium text-white truncate">{img.title}</p>
                        <p className="text-xs text-stone-400">{img.pattern} • {img.sector}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Embedded media (images/videos) */}
              {msg.media && msg.media.length > 0 && (
                <div className={`grid grid-cols-2 gap-3 ${msg.text ? 'mt-3' : ''}`}>
                  {msg.media.map((item, j) => (
                    <div key={j} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-700">
                      {item.type === 'image' && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                          <img src={item.url} alt={item.caption || 'Reference image'} className="w-full h-full object-cover" />
                        </a>
                      )}
                      {item.type === 'video' && (
                        <video
                          src={item.url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      )}
                      {item.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                          <p className="text-xs text-stone-300">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Show generate buttons at end if in flow but no message has them */}
        {generateFlow && !messages.some(m => m.isGenerateStep && messages.indexOf(m) === messages.length - 1) && generateFlow !== 'generating' && generateFlow !== 'complete' && (
          <div className="flex justify-start">
            <div className="max-w-[85%]">
              {renderGenerateButtons()}
            </div>
          </div>
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-stone-600 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-stone-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-stone-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer className="p-4 border-t border-stone-800">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask about patterns, colors, backlighting..."
            disabled={loading || generateFlow === 'generating'}
            className="flex-1 px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-sm focus:outline-none focus:border-stone-500 disabled:opacity-50"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim() || generateFlow === 'generating'}
            className="px-5 py-3 bg-stone-100 text-stone-900 rounded-xl font-medium text-sm hover:bg-white disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </footer>

      {/* GENERATED IMAGE MODAL */}
      {showGeneratedModal && generatedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
              <img 
                src={generatedImage.url} 
                alt={`${generatedImage.pattern} in ${generatedImage.application}`}
                className="w-full h-full object-cover"
              />
              {/* AI Generated Badge */}
              <div className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-medium px-3 py-1 rounded-full">
                AI Generated
              </div>
              {/* Close button */}
              <button 
                onClick={closeGeneratedModal}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>
            
            {/* Info */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-white mb-1">
                {generatedImage.pattern} • {generatedImage.sector} {generatedImage.application}
              </h3>
              {generatedImage.backlight && (
                <p className="text-sm text-stone-400">{generatedImage.backlight} backlight</p>
              )}
              <p className="text-xs text-stone-500 mt-2">Every image is buildable — CNC files, shop drawings, pricing available.</p>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => downloadGeneratedImage(generatedImage.url, generatedImage.pattern)}
                className="px-6 py-3 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded-xl text-sm font-medium transition-colors"
              >
                Download
              </button>
              <button
                onClick={generateAnother}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-sm font-medium transition-colors"
              >
                Generate Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAMILY MODAL */}
      {selectedImage && !specsImage && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowGallery(true)}
                className="flex items-center gap-2 px-3 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-sm text-stone-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Browse All
              </button>
              <button 
                onClick={closeModal}
                className="w-10 h-10 bg-stone-800 hover:bg-stone-700 rounded-full flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video relative rounded-xl overflow-hidden mb-4">
              <img src={selectedImage.image} alt={selectedImage.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-lg font-medium">{selectedImage.title}</div>
                <div className="text-sm text-stone-300">{selectedImage.pattern} • {selectedImage.sector}</div>
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-stone-700 to-stone-800 rounded-full flex items-center justify-center text-xs font-medium shrink-0">M</div>
                <div className="flex-1">
                  <p className="text-sm text-stone-300">{selectedImage.description}</p>
                  <p className="text-sm text-stone-500 mt-2">Tap a related image below for specs, or ask me anything.</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <input
                  ref={modalInputRef}
                  placeholder="Ask Mara about this pattern..."
                  className="flex-1 px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-sm focus:outline-none focus:border-stone-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      send(e.target.value, true);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (modalInputRef.current?.value.trim()) {
                      send(modalInputRef.current.value, true);
                      modalInputRef.current.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-stone-100 text-stone-900 rounded-lg text-sm font-medium hover:bg-white"
                >
                  Ask
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              {familyImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => handleFamilyClick(img)}
                  className="relative aspect-square rounded-lg overflow-hidden border border-stone-700 hover:border-stone-500 transition-all"
                >
                  <img src={img.image} alt={img.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-[10px] text-white truncate">{img.title}</p>
                    {img.corianColor && CORIAN_COLORS[img.corianColor] && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-2 h-2 rounded-full border border-white/30" style={{ backgroundColor: CORIAN_COLORS[img.corianColor].hex }} />
                        <span className="text-[8px] text-stone-400">{img.corianColor}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => handleFamilyClick(selectedImage)}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 rounded-xl text-sm font-medium"
            >
              View Full Specs for {selectedImage.title}
            </button>
          </div>
        </div>
      )}

      {/* PRODUCT PAGE MODAL */}
      {specsImage && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto" onClick={closeSpecs}>
          <div className="min-h-full flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
              <button
                onClick={(e) => { e.stopPropagation(); setShowGallery(true); closeSpecs(); }}
                className="flex items-center gap-2 px-3 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-sm text-stone-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Browse All
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); closeSpecs(); }}
                className="w-10 h-10 bg-stone-800 hover:bg-stone-700 rounded-full flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-3xl mx-auto w-full px-4 pb-8" onClick={(e) => e.stopPropagation()}>
              {/* Mara Assistant - Top */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-stone-700 to-stone-800 rounded-full flex items-center justify-center text-xs font-medium shrink-0">M</div>
                  <div className="flex-1">
                    <p className="text-sm text-stone-300">
                      {productMaraText}
                      {!productMaraComplete && <span className="animate-pulse">|</span>}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    ref={modalInputRef}
                    placeholder="Ask Mara about this product..."
                    className="flex-1 px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-sm focus:outline-none focus:border-stone-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        send(e.target.value, true);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (modalInputRef.current?.value.trim()) {
                        send(modalInputRef.current.value, true);
                        modalInputRef.current.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-stone-100 text-stone-900 rounded-lg text-sm font-medium hover:bg-white"
                  >
                    Ask
                  </button>
                </div>
              </div>

              {/* Image - full visible, not cut off */}
              <div className="relative rounded-xl overflow-hidden mb-6 bg-stone-900">
                <img
                  src={specsImage.image}
                  alt={specsImage.title}
                  className="w-full h-auto object-contain"
                />
                {specsImage.isBacklit && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-medium px-3 py-1 rounded-full">
                    ✦ Backlit
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-stone-100 mb-1">{specsImage.title}</h2>
                <p className="text-sm text-stone-400 mb-4">{specsImage.pattern} • {specsImage.sector}</p>
                <p className="text-sm text-stone-300 leading-relaxed">{specsImage.description}</p>
              </div>

              {/* Specs Grid */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-5 mb-6">
                <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-stone-500 uppercase">Material</p>
                    <p className="text-sm text-stone-200">{specsImage.specs.material}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase">Color</p>
                    <p className="text-sm text-stone-200">{specsImage.corianColor || specsImage.specs.color}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase">Wall Dimension</p>
                    <p className="text-sm text-stone-200">12' wide × 8' tall</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase">Lead Time</p>
                    <p className="text-sm text-stone-200">4 Weeks</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase">System</p>
                    <p className="text-sm text-stone-200">{specsImage.specs.system}</p>
                  </div>
                  {specsImage.specs.enhancement && (
                    <div>
                      <p className="text-xs text-stone-500 uppercase">Enhancement</p>
                      <p className="text-sm text-stone-200">{specsImage.specs.enhancement}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-5 mb-6">
                <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-4">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">Panel</span>
                    <span className="text-stone-200">$35/SF</span>
                  </div>
                  {specsImage.isBacklit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">Backlighting</span>
                      <span className="text-stone-200">+$35/SF</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">Size</span>
                    <span className="text-stone-200">96 SF</span>
                  </div>
                  <div className="border-t border-stone-700 pt-2 mt-2 flex justify-between">
                    <span className="text-stone-200 font-medium">Total</span>
                    <span className="text-xl font-semibold text-white">
                      {specsImage.isBacklit ? '$6,720' : '$3,360'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Backlight Includes Section */}
              {specsImage.isBacklit && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-6">
                  <h3 className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-3">Backlight Package Includes</h3>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    Backlighting materials, shop drawings, custom lighting diagram, power supplies. Turnkey backlight system with remote.
                  </p>
                </div>
              )}

              {/* Shop Drawing Link */}
              {specsImage.shopDrawing && (
                <a
                  href={specsImage.shopDrawing}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-6 text-center text-sm text-stone-400 hover:text-stone-200 underline underline-offset-4"
                >
                  View Shop Drawing →
                </a>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 py-4 bg-stone-800 hover:bg-stone-700 rounded-xl font-medium text-sm border border-stone-700 transition-colors">
                  Download Spec
                </button>
                <button
                  onClick={() => alert('Added to cart! Cart feature coming soon.')}
                  className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-medium text-sm transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY MODAL */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-black/80 backdrop-blur-sm py-4 -mx-4 px-4 z-10">
              <div>
                <h2 className="text-xl font-semibold text-stone-100">Full Collection</h2>
                <p className="text-sm text-stone-500">{IMAGE_CATALOG.length} images • Tap to explore</p>
              </div>
              <button onClick={() => setShowGallery(false)} className="w-10 h-10 bg-stone-800 hover:bg-stone-700 rounded-full flex items-center justify-center text-white">✕</button>
            </div>

            {Object.entries(getGalleryPatterns()).map(([pattern, images]) => (
              <div key={pattern} className="mb-8">
                <h3 className="text-sm font-medium text-stone-400 uppercase tracking-wide mb-3">{pattern}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setShowGallery(false); handleImageClick(img); }}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-800 hover:border-stone-600 transition-all group"
                    >
                      <img src={img.image} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-xs font-medium text-white truncate">{img.title}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {img.corianColor && CORIAN_COLORS[img.corianColor] && (
                            <div className="w-2 h-2 rounded-full border border-white/30" style={{ backgroundColor: CORIAN_COLORS[img.corianColor].hex }} />
                          )}
                          <span className="text-[10px] text-stone-400">{img.sector}</span>
                          {img.isBacklit && <span className="text-[10px] text-amber-400 ml-1">✦ Backlit</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI GENERATE VIEW */}
      {showAIGenView && (
        <div className="fixed inset-0 bg-stone-950/98 z-50 smoke-overlay">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-stone-900/50" />

          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-800/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm text-stone-400">AI Generate</span>
              </div>
              <button
                onClick={() => {
                  setShowAIGenView(false);
                  setGeneratedImage(null);
                  setGenerateFlow(null);
                }}
                className="w-10 h-10 bg-stone-800/50 hover:bg-stone-700 rounded-full flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
              {/* Show pattern selection when no generation in progress */}
              {!generatedImage && generateFlow !== 'generating' && (
                <div className="smoke-content max-w-3xl w-full">
                  {/* Headline */}
                  <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      Push a button. Make a wall.
                    </h2>
                    <p className="text-lg text-stone-400">
                      Select a pattern to generate a custom visualization
                    </p>
                  </div>

                  {/* Pattern Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(LORA_MODELS).map(([key, model], index) => (
                      <button
                        key={key}
                        onClick={() => {
                          setGenPattern(key);
                          // Use default sector/application for quick generation
                          const defaultSector = 'hospitality';
                          const defaultApp = 'Hotel Lobby';
                          const defaultBacklight = model.hasBacklight ? 'warm' : null;
                          setGenSector(defaultSector);
                          setGenApplication(defaultApp);
                          setGenBacklight(defaultBacklight);
                          generateImage(key, defaultSector, defaultApp, defaultBacklight);
                        }}
                        className="pattern-card group relative bg-stone-900/50 border border-stone-700 hover:border-amber-500/50 rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10"
                        style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                      >
                        {/* Pattern icon/preview area */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                          <div className="text-6xl text-stone-700 group-hover:text-amber-500/30 transition-colors">
                            {key === 'lake' && (
                              <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="3" />
                                <circle cx="12" cy="12" r="6" />
                                <circle cx="12" cy="12" r="9" />
                              </svg>
                            )}
                            {key === 'flame' && (
                              <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 2c0 4-4 6-4 10a4 4 0 108 0c0-4-4-6-4-10z" />
                                <path d="M12 6c0 2-2 3-2 5a2 2 0 104 0c0-2-2-3-2-5z" />
                              </svg>
                            )}
                            {key === 'fins' && (
                              <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M4 4l8 8-8 8" />
                                <path d="M12 4l8 8-8 8" />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Pattern info */}
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                          {model.name}
                        </h3>
                        <p className="text-sm text-stone-400 line-clamp-2">
                          {model.description}
                        </p>

                        {/* Backlight badge */}
                        {model.hasBacklight && (
                          <div className="absolute top-4 right-4 px-2 py-1 bg-amber-500/20 rounded-full">
                            <span className="text-xs text-amber-400">✦ Backlit</span>
                          </div>
                        )}

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {generateFlow === 'generating' && !generatedImage && (
                <div className="smoke-content text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-stone-700" />
                    <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Creating your wall...</h3>
                  <p className="text-stone-400">
                    Generating {genPattern ? LORA_MODELS[genPattern]?.name : 'pattern'} visualization
                  </p>
                </div>
              )}

              {/* Result View */}
              {generatedImage && (
                <div className="smoke-content max-w-4xl w-full">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 shadow-2xl">
                    <img
                      src={generatedImage.url}
                      alt={`${generatedImage.pattern} visualization`}
                      className="w-full h-full object-cover"
                    />
                    {/* AI Generated Badge */}
                    <div className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-medium px-3 py-1 rounded-full">
                      AI Generated
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {generatedImage.pattern} • {generatedImage.application}
                    </h3>
                    {generatedImage.backlight && (
                      <p className="text-stone-400">{generatedImage.backlight} backlight</p>
                    )}
                    <p className="text-sm text-stone-500 mt-3">
                      This design is buildable — CNC files, shop drawings, and pricing available.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => alert('Custom Quote feature coming soon! Contact us at sales@mrwalls.com')}
                      className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl font-medium text-lg transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                    >
                      Custom Quote
                    </button>
                    <button
                      onClick={() => downloadGeneratedImage(generatedImage.url, generatedImage.pattern)}
                      className="px-8 py-4 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-white rounded-xl font-medium text-lg transition-colors text-center"
                    >
                      Download
                    </button>
                  </div>

                  {/* Generate Another */}
                  <div className="text-center mt-8">
                    <button
                      onClick={() => {
                        setGeneratedImage(null);
                        setGenerateFlow(null);
                        setGenPattern(null);
                      }}
                      className="text-stone-400 hover:text-white text-sm underline underline-offset-4 transition-colors"
                    >
                      ← Generate another pattern
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
