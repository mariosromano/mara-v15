import { useState, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// MARA V15 - ONE BRAIN ARCHITECTURE
// Claude decides everything. Local code just renders.
// ═══════════════════════════════════════════════════════════════════════════════

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dtlodxxio/image/upload';

// ⚠️ FAL API KEY (from environment variable)
const FAL_API_KEY = import.meta.env.VITE_FAL_API_KEY;

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
// IMAGE CATALOG (Products - orderable patterns with specs)
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
    specs: { material: 'DuPont Corian®', color: 'Carbon Concrete', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 25, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Dove', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 25, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Neutral Concrete', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 25, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Artista Mist', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 25, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Laguna', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 25, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Verdant', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 25, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 100, enhancement: 'Backlighting', system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Blue', maxPanel: '12" × 12"', leadTime: '4-6 Weeks', pricePerSF: 45, system: 'Fins' },
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
    specs: { material: 'DuPont Corian®', color: 'Mixed (Dove + Glacier White)', maxPanel: '24" × 24" tiles', leadTime: '4-6 Weeks', pricePerSF: 35, system: 'Modular Tile' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 48"', leadTime: '4-6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 48"', leadTime: '4-6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 48"', leadTime: '4-6 Weeks', pricePerSF: 100, enhancement: 'UV-Stable Exterior', system: 'French Cleat' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 48"', leadTime: '4-6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 48"', leadTime: '4-6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
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
    isWaterFeature: true,
    keywords: ['brick', 'water', 'fountain', 'pool', 'waterfall', 'outdoor', 'black'],
    image: `${CLOUDINARY_BASE}/Brick_waterfeature_05_copy_kewkyh.png`,
    specs: { material: 'DuPont Corian®', color: 'Deep Nocturne (Black)', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 85, enhancement: 'Water Feature', system: 'InterlockPanel™' },
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
    isWaterFeature: true,
    keywords: ['brick', 'water', 'pool', 'outdoor', 'cabana', 'resort', 'black'],
    image: `${CLOUDINARY_BASE}/Brick_waterfeature_18_copy_oce67r.png`,
    specs: { material: 'DuPont Corian®', color: 'Deep Nocturne (Black)', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 85, enhancement: 'Water Feature', system: 'InterlockPanel™' },
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
    isWaterFeature: true,
    keywords: ['brick', 'water', 'backlit', 'backlight', 'glow', 'night', 'dramatic', 'white'],
    image: `${CLOUDINARY_BASE}/Brick_waterfeature_20_copy_ffh4px.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 120, enhancement: 'Backlit + Water Feature', system: 'InterlockPanel™' },
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
    isWaterFeature: true,
    keywords: ['brick', 'water', 'night', 'evening', 'black', 'ambient'],
    image: `${CLOUDINARY_BASE}/Brick_waterfeature_27_copy_nxcqhx.png`,
    specs: { material: 'DuPont Corian®', color: 'Deep Nocturne (Black)', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 85, enhancement: 'Water Feature', system: 'InterlockPanel™' },
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
    isWaterFeature: true,
    keywords: ['brick', 'water', 'day', 'daylight', 'natural', 'pool', 'black'],
    image: `${CLOUDINARY_BASE}/Brick_waterfeature_12_copy_gdmjok.png`,
    specs: { material: 'DuPont Corian®', color: 'Deep Nocturne (Black)', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 85, enhancement: 'Water Feature', system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 75, enhancement: 'Backlighting', system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 75, enhancement: 'Backlighting', system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 85, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 85, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '120" × 60"', leadTime: '4-6 Weeks', pricePerSF: 75, enhancement: 'UV-Stable Exterior', system: 'French Cleat' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '120" × 60"', leadTime: '4-6 Weeks', pricePerSF: 75, enhancement: 'UV-Stable Exterior', system: 'French Cleat' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 100, enhancement: 'RGB Backlighting', system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 50, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', height: '142"', width: '239¾"', slabs: 5, leadTime: '4-6 Weeks', pricePerSF: 35, enhancement: 'Backlighting', system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 35, system: 'InterlockPanel™' },
    description: 'Desert Sunset variation — mountain ridges and desert sky.'
  },
  {
    id: 'sand-dune-1',
    pattern: 'Sand Dune',
    title: 'Desert Mountains Orange',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['warm', 'sunset', 'southwestern'],
    isBacklit: false,
    keywords: ['desert', 'mountain', 'landscape', 'warm', 'orange', 'hospitality'],
    image: `${CLOUDINARY_BASE}/mr-render-1768082338412_copy_wqymkx.png`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 35, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Glacier White', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 35, system: 'InterlockPanel™' },
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
    specs: { material: 'DuPont Corian®', color: 'Deep Nocturne (Black)', maxPanel: '144" × 60"', leadTime: '4-6 Weeks', pricePerSF: 95, enhancement: 'Thermoformed Curve', system: 'InterlockPanel™' },
    description: 'Sand Dune pattern thermoformed into dramatic curved column.'
  },

  // FINGERPRINT
  {
    id: 'fingerprint-1',
    pattern: 'Fingerprint',
    patternFamily: 'Fingerprint',
    title: 'Fingerprint',
    sector: 'Corporate',
    corianColor: 'Bone',
    mood: ['organic', 'unique', 'sculptural'],
    isBacklit: false,
    keywords: ['fingerprint', 'organic', 'unique', 'identity', 'bone', 'large scale'],
    image: `${CLOUDINARY_BASE}/v1769147366/Fingerprint_-_Large_udpxci.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Bone', size: '12\' H × 20\' W', leadTime: '4-6 Weeks', pricePerSF: 35, system: 'InterlockPanel™' },
    description: 'Fingerprint — organic carved ridges create a unique, one-of-a-kind identity wall. 12 feet high by 20 feet wide.'
  },

  // BILLOW
  {
    id: 'billow-backlit-1',
    pattern: 'Billow',
    patternFamily: 'Billow',
    title: 'Billow Backlit',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['soft', 'flowing', 'dramatic', 'glowing'],
    isBacklit: true,
    keywords: ['billow', 'backlit', 'backlight', 'flowing', 'soft', 'clouds', 'glow'],
    image: `${CLOUDINARY_BASE}/v1769147362/billow-backlight_w4hjru.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', size: '20\' H × 12\' W', leadTime: '4-6 Weeks', pricePerSF: 100, enhancement: 'Backlighting', system: 'InterlockPanel™' },
    description: 'Billow with backlighting — soft flowing forms glow dramatically. 20 feet tall by 12 feet wide.'
  },

  // HONEY
  {
    id: 'honey-backlit-1',
    pattern: 'Honey',
    patternFamily: 'Honey',
    title: 'Honey Backlit',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['geometric', 'natural', 'warm', 'glowing'],
    isBacklit: true,
    keywords: ['honey', 'honeycomb', 'backlit', 'backlight', 'geometric', 'hexagon', 'glow', 'dining'],
    image: `${CLOUDINARY_BASE}/v1769147358/honey-dinning-people_okihjf.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', size: '10\' H × 17\' W', leadTime: '4-6 Weeks', pricePerSF: 100, enhancement: 'Backlighting', system: 'InterlockPanel™' },
    description: 'Honey with backlighting — honeycomb-inspired pattern glows warmly. 10 feet high by 17 feet wide.'
  },

  // BLOOM
  {
    id: 'bloom-backlit-1',
    pattern: 'Bloom',
    patternFamily: 'Bloom',
    title: 'Bloom Backlit',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['organic', 'floral', 'artistic', 'glowing'],
    isBacklit: true,
    keywords: ['bloom', 'flower', 'floral', 'backlit', 'backlight', 'artistic', 'image processing', 'glow'],
    image: `${CLOUDINARY_BASE}/v1769147350/Bloom-free_reo20n.jpg`,
    specs: { material: 'DuPont Corian®', color: 'Glacier White', size: '9\' H × 22\' W', leadTime: '4-6 Weeks', pricePerSF: 75, enhancement: 'Backlighting + Image Processing', system: 'InterlockPanel™' },
    description: 'Bloom with backlighting — image-processed floral design includes all backlighting materials. 9 feet high by 22 feet wide.'
  },

  // FLAME 2-SHEET (separate family)
  {
    id: 'flame-2sheet-1',
    pattern: 'Flame 2-Sheet',
    patternFamily: 'Flame 2-Sheet',
    title: 'Flame 2-Sheet',
    sector: 'Hospitality',
    corianColor: 'Glacier White',
    mood: ['warm', 'flowing', 'dramatic', 'sculptural'],
    isBacklit: false,
    keywords: ['flame', 'flowing', 'vertical', 'hospitality', 'white', '2 sheet', 'two sheet'],
    image: `${CLOUDINARY_BASE}/v1769212741/flame-hospitality_h9crvd.png`,
    additionalImages: [`${CLOUDINARY_BASE}/v1769212741/Flame-2_sheet_render_fdry5m.png`],
    shopDrawing: 'https://res.cloudinary.com/dtlodxxio/image/upload/fl_attachment/v1769212741/Flame_-_2_Sheet_-_Shop_Drawing_tvlpb1.pdf',
    specs: { material: 'DuPont Corian®', color: 'Glacier White', size: '12\' H × 8\' W', sqft: 96, leadTime: '4-6 Weeks', pricePerSF: 35, totalPrice: 3360, system: 'InterlockPanel™' },
    description: 'Flame 2-Sheet — flowing vertical waves in white Corian. 12 feet high by 8 feet wide. Shop drawings available.'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS CATALOG (Portfolio - completed installations/case studies)
// ═══════════════════════════════════════════════════════════════════════════════

const PROJECTS_CATALOG = [
  {
    id: 'project-lax-american',
    title: 'LAX American Airlines',
    client: 'American Airlines',
    location: 'Los Angeles, CA',
    sector: 'Aviation',
    patterns: ['Custom'],
    designer: 'MR Walls Studio',
    year: 2022,
    isBacklit: false,
    keywords: ['lax', 'airport', 'american airlines', 'aviation', 'los angeles', 'terminal'],
    image: `${CLOUDINARY_BASE}/v1765939857/LAX_American_Airlines_-_Large_nlbf8w.jpg`,
    description: 'Custom carved wall installation at LAX for American Airlines. A signature piece in one of the busiest airports in the world.'
  },
  {
    id: 'project-morongo-casino',
    title: 'Morongo Casino Ceiling',
    client: 'Morongo Casino',
    location: 'Cabazon, CA',
    sector: 'Hospitality',
    patterns: ['Custom'],
    designer: 'MR Walls Studio',
    year: 2021,
    isBacklit: true,
    keywords: ['morongo', 'casino', 'ceiling', 'hospitality', 'backlit', 'gaming'],
    image: `${CLOUDINARY_BASE}/v1765939772/Morongo_Casino_-_Medium_w9ymlt.jpg`,
    description: 'Dramatic backlit ceiling installation at Morongo Casino. Custom pattern creates an immersive gaming environment.'
  },
  {
    id: 'project-capital-one-arena',
    title: 'Capital One Arena',
    client: 'Capital One',
    location: 'Washington, DC',
    sector: 'Sports & Entertainment',
    patterns: ['Custom'],
    designer: 'Gensler',
    year: 2022,
    isBacklit: true,
    keywords: ['arena', 'sports', 'capital one', 'gensler', 'washington', 'dc', 'entertainment', 'backlit'],
    image: `${CLOUDINARY_BASE}/v1765773871/Capital_One_Arena_-_Large_ule5uh.png`,
    description: 'Custom branded wall installation for Capital One Arena. Designed in collaboration with Gensler.'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEOS CATALOG (Instructional content)
// ═══════════════════════════════════════════════════════════════════════════════

const VIDEOS_CATALOG = [
  {
    id: 'video-interlock-install',
    title: 'InterlockPanel Installation',
    type: 'instructional',
    description: 'Step-by-step guide showing how InterlockPanel pieces puzzle together for seamless installation. No visible fasteners, perfect alignment every time.',
    keywords: ['install', 'installation', 'how to', 'interlock', 'panel', 'puzzle', 'mounting'],
    video: 'https://res.cloudinary.com/dtlodxxio/video/upload/v1765772971/install_MR-LAX_720_-_puzzle_video_-_720_x_1280_m2ewcs.mp4',
    relatedProducts: ['lake-backlit-1', 'flame-1', 'greatwave-1']
  },
  {
    id: 'video-water-feature-demo',
    title: 'Water Feature Demo',
    type: 'demo',
    description: 'See how water flows through carved Corian channels to create dramatic waterfall effects. Showcases the Brick pattern water feature in action.',
    keywords: ['water', 'fountain', 'waterfall', 'demo', 'brick', 'outdoor'],
    video: `${CLOUDINARY_BASE}/v1765772971/water_feature_demo.mp4`,
    relatedProducts: ['brick-water-1', 'brick-water-2', 'brick-water-3']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// ONE-BRAIN SYSTEM PROMPT
// Claude decides everything. Full catalogs included.
// ═══════════════════════════════════════════════════════════════════════════════

const buildSystemPrompt = () => {
  // Create simplified catalog for Claude (just essential fields)
  const imageList = IMAGE_CATALOG.map(img => ({
    id: img.id,
    pattern: img.pattern,
    title: img.title,
    sector: img.sector,
    color: img.corianColor,
    isBacklit: img.isBacklit,
    isWaterFeature: img.isWaterFeature || false,
    keywords: img.keywords.join(', '),
    description: img.description
  }));

  const projectList = PROJECTS_CATALOG.map(p => ({
    id: p.id,
    title: p.title,
    client: p.client,
    location: p.location,
    sector: p.sector,
    patterns: p.patterns.join(', '),
    designer: p.designer,
    year: p.year,
    isBacklit: p.isBacklit,
    description: p.description
  }));

  const videoList = VIDEOS_CATALOG.map(v => ({
    id: v.id,
    title: v.title,
    type: v.type,
    description: v.description,
    keywords: v.keywords.join(', ')
  }));

  return `You are Mara, the MR Walls design assistant. You help architects, interior designers, and design professionals explore carved Corian wall surfaces.

## YOUR PERSONALITY
- Design-focused first, technical when needed
- Conversational and warm, not robotic or salesy
- Knowledgeable but humble
- Brief responses (max 50 words unless detailed info requested)
- Ask ONE good follow-up question per response

## WHO IS MR WALLS
MR Walls creates carved DuPont Corian solid surface wall panels. Exclusive North American partner with DuPont for architectural walls. Over 1,000 projects including LAX, Wynn Casino, Mercedes F1 HQ, Cedars-Sinai, Crypto.com Arena.

Team: Mario Romano (Founder), Carlo & Kamila (VP), Sawyer & Toni (Sales), Samanta (Innovation)

## PRICING (only discuss when asked)
- Linear Patterns (repeatable, like Industrial Brick): $25/SF
- Ready Made Designs (sculptural, like Flame, Great Wave, Buddha, Cactus): $50/SF
- Backlighting add-on: +$50/SF
- Lead time: 4-6 weeks depending on complexity

## ⚠️ CRITICAL: CHOOSING THE RIGHT CATALOG ⚠️
This is the MOST IMPORTANT rule. You must choose the correct catalog based on user intent:

**USE PROJECTS_CATALOG (tag: [Project: id]) when user asks about:**
- "your work" / "your projects" / "show me your work"
- "portfolio" / "completed installations" / "case studies"
- "projects you've done" / "past projects" / "installations"
- "who have you worked with" / "clients"
- Generic questions about MR Walls' work/experience

**USE IMAGE_CATALOG (tag: [Image: id]) when user asks about:**
- A SPECIFIC pattern by name ("show me Lake", "Flame pattern", "Great Wave")
- "patterns" / "products" / "available designs"
- Specific applications ("shower", "fireplace", "lobby")
- Specific features ("backlit", "water feature")

**USE VIDEOS_CATALOG (tag: [Video: id]) when user asks about:**
- "installation" / "how to install"
- "how it works" / "demo"

⚠️ DO NOT confuse products with projects. Products are patterns (Lake, Flame, Brick). Projects are completed installations (LAX, Morongo Casino, Capital One Arena).

## HOW TO SHOW CONTENT
Use these EXACT tags with the ID from the catalogs:
- [Image: id] — shows a PRODUCT (pattern like Lake, Flame, Great Wave)
- [Project: id] — shows a COMPLETED PROJECT (LAX, Morongo, Capital One)
- [Video: id] — shows an instructional video

IMPORTANT: Use ONLY the exact IDs from the catalogs. Do NOT use URLs or make up IDs.

Examples:
- "Lake is perfect for meditation spaces. [Image: lake-backlit-1]"
- "Here's our LAX project for American Airlines. [Project: project-lax-american]"
- "Here's how installation works. [Video: video-interlock-install]"

## RULES
1. Show max 2 items per response
2. CRITICAL: If an item has isBacklit: true, NEVER ask "would you like to see it backlit?" — it already IS backlit
3. Don't show the same item twice in a conversation
4. General questions (who is Mario, what is MR Walls, pricing) do NOT need images
5. Match the user's depth — design language for explorers, technical for specifiers
6. If user says "yes", "more", "show me more" — show the next relevant item, don't repeat
7. When showing a backlit item, you can mention it's backlit but don't ask if they want to see it backlit

## COMPLETED PROJECTS (PROJECTS_CATALOG) — Use [Project: id]
These are REAL completed installations. Use when asked about "work", "projects", "portfolio".
${JSON.stringify(projectList, null, 2)}

## AVAILABLE PRODUCTS (IMAGE_CATALOG) — Use [Image: id]
These are PATTERNS/PRODUCTS for sale. Use when asked about specific patterns or products.
${JSON.stringify(imageList, null, 2)}

## INSTRUCTIONAL VIDEOS (VIDEOS_CATALOG) — Use [Video: id]
${JSON.stringify(videoList, null, 2)}

## AI GENERATION
If user wants to "create my own", "design my own", "generate", tell them to click the AI Generate button in the top right.

When the user describes a custom vision, specific dimensions, or something not in the catalog, offer to generate a custom visualization using AI Generate. Say something like "I can create a custom visualization of that for you — want to try AI Generate?"

## RESPONSE FORMAT
Keep responses conversational. Include tags inline with your text. Never use markdown formatting like ** or *.`;
};

// ═══════════════════════════════════════════════════════════════════════════════
// PARSE RESPONSE - Extract tags from Claude's response
// ═══════════════════════════════════════════════════════════════════════════════

const parseResponse = (text) => {
  const result = {
    cleanText: text,
    images: [],
    projects: [],
    videos: []
  };

  // Extract [Image: xxx] tags - validate ID exists before adding
  const imageMatches = text.match(/\[Image:\s*([^\]]+)\]/g) || [];
  imageMatches.forEach(match => {
    const id = match.match(/\[Image:\s*([^\]]+)\]/)[1].trim();
    const found = IMAGE_CATALOG.find(img => img.id === id);
    if (found) {
      result.images.push(found);
    } else {
      console.warn(`Invalid image ID from Claude: "${id}" - not found in IMAGE_CATALOG`);
    }
  });

  // Extract [Project: xxx] tags - validate ID exists before adding
  const projectMatches = text.match(/\[Project:\s*([^\]]+)\]/g) || [];
  projectMatches.forEach(match => {
    const id = match.match(/\[Project:\s*([^\]]+)\]/)[1].trim();
    const found = PROJECTS_CATALOG.find(p => p.id === id);
    if (found) {
      result.projects.push(found);
    } else {
      console.warn(`Invalid project ID from Claude: "${id}" - not found in PROJECTS_CATALOG`);
    }
  });

  // Extract [Video: xxx] tags - validate ID exists before adding
  const videoMatches = text.match(/\[Video:\s*([^\]]+)\]/g) || [];
  videoMatches.forEach(match => {
    const id = match.match(/\[Video:\s*([^\]]+)\]/)[1].trim();
    const found = VIDEOS_CATALOG.find(v => v.id === id);
    if (found) {
      result.videos.push(found);
    } else {
      console.warn(`Invalid video ID from Claude: "${id}" - not found in VIDEOS_CATALOG`);
    }
  });

  // Clean tags from text
  result.cleanText = text
    .replace(/\[Image:\s*[^\]]+\]/g, '')
    .replace(/\[Project:\s*[^\]]+\]/g, '')
    .replace(/\[Video:\s*[^\]]+\]/g, '')
    .trim();

  return result;
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function MaraV15() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [shownItems, setShownItems] = useState(new Set()); // Track what's been shown

  // Gallery and Specs state
  const [showGallery, setShowGallery] = useState(false);
  const [specsImage, setSpecsImage] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [patternGallery, setPatternGallery] = useState([]);

  // AI Generate state
  const [showGenerate, setShowGenerate] = useState(false);
  const [genStep, setGenStep] = useState(1); // 1=pattern, 2=sector, 3=application, 4=backlight, 5=generating, 6=result
  const [genPattern, setGenPattern] = useState(null);
  const [genSector, setGenSector] = useState(null);
  const [genApplication, setGenApplication] = useState(null);
  const [genBacklight, setGenBacklight] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState(null);
  const [genError, setGenError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Group images by pattern for gallery
  const getGalleryPatterns = () => {
    const patterns = {};
    IMAGE_CATALOG.forEach(img => {
      if (!patterns[img.pattern]) patterns[img.pattern] = [];
      patterns[img.pattern].push(img);
    });
    return patterns;
  };

  // Handle clicking an image to open specs page
  const handleImageClick = (img) => {
    setSpecsImage(img);
    setHeroImage(img);

    // Build gallery: start with current image, add additionalImages, then related products
    let gallery = [img];

    // Add additionalImages as clickable gallery items
    if (img.additionalImages?.length > 0) {
      img.additionalImages.forEach((imgUrl, idx) => {
        gallery.push({
          ...img,
          id: `${img.id}-additional-${idx}`,
          image: imgUrl,
          title: `${img.title} - View ${idx + 2}`
        });
      });
    }

    // Add other products with same pattern (if any)
    const related = IMAGE_CATALOG.filter(i => i.pattern === img.pattern && i.id !== img.id).slice(0, 4 - gallery.length);
    gallery = [...gallery, ...related].slice(0, 4);

    setPatternGallery(gallery);
  };

  // Swap hero image in specs page
  const swapHeroImage = (img) => {
    setHeroImage(img);
  };

  // Close specs page
  const closeSpecs = () => {
    setSpecsImage(null);
    setHeroImage(null);
    setPatternGallery([]);
  };

  // Reset AI Generate modal
  const resetGenerate = () => {
    setGenStep(1);
    setGenPattern(null);
    setGenSector(null);
    setGenApplication(null);
    setGenBacklight(null);
    setGenResult(null);
    setGenError(null);
    setGenLoading(false);
  };

  // Close AI Generate modal
  const closeGenerate = () => {
    setShowGenerate(false);
    resetGenerate();
  };

  // Build the prompt for FAL
  const buildGeneratePrompt = () => {
    const lora = LORA_MODELS[genPattern];
    const sectorKey = genSector;
    const template = PROMPT_TEMPLATES[sectorKey]?.[genApplication];
    const backlightPhrase = genBacklight ? BACKLIGHT_COLORS[genBacklight].phrase : 'soft ambient lighting';

    if (!template) return null;

    const prompt = template
      .replace('{pattern}', `${lora.trigger} ${lora.patternDescription}`)
      .replace('{backlight}', backlightPhrase);

    return prompt;
  };

  // Call FAL API to generate image
  const generateImage = async () => {
    setGenLoading(true);
    setGenError(null);
    setGenStep(5);

    const lora = LORA_MODELS[genPattern];
    const prompt = buildGeneratePrompt();

    if (!prompt) {
      setGenError('Could not build prompt');
      setGenLoading(false);
      return;
    }

    try {
      // Submit the request
      const submitResponse = await fetch('https://queue.fal.run/fal-ai/flux-lora', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          loras: [{
            path: lora.url,
            scale: lora.scale
          }],
          image_size: 'landscape_16_9',
          num_images: 1,
          enable_safety_checker: false,
          output_format: 'jpeg',
          num_inference_steps: 28,
          guidance_scale: 3.5
        })
      });

      if (!submitResponse.ok) {
        throw new Error(`FAL API error: ${submitResponse.status}`);
      }

      const result = await submitResponse.json();

      // Check if we got images directly or need to poll
      if (result.images && result.images.length > 0) {
        setGenResult({
          url: result.images[0].url,
          prompt: prompt,
          pattern: lora.name,
          sector: SECTORS[genSector].name,
          application: genApplication,
          backlight: genBacklight ? BACKLIGHT_COLORS[genBacklight].name : 'None'
        });
        setGenStep(6);
      } else if (result.request_id) {
        // Poll for result
        const pollResult = await pollForResult(result.request_id);
        if (pollResult.images && pollResult.images.length > 0) {
          setGenResult({
            url: pollResult.images[0].url,
            prompt: prompt,
            pattern: lora.name,
            sector: SECTORS[genSector].name,
            application: genApplication,
            backlight: genBacklight ? BACKLIGHT_COLORS[genBacklight].name : 'None'
          });
          setGenStep(6);
        } else {
          throw new Error('No images in result');
        }
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Generate error:', err);
      setGenError(err.message || 'Failed to generate image');
      setGenStep(4); // Go back to last step
    } finally {
      setGenLoading(false);
    }
  };

  // Poll for FAL result
  const pollForResult = async (requestId, maxAttempts = 60) => {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch(`https://queue.fal.run/fal-ai/flux-lora/requests/${requestId}/status`, {
        headers: {
          'Authorization': `Key ${FAL_API_KEY}`
        }
      });

      const status = await response.json();

      if (status.status === 'COMPLETED') {
        // Fetch the actual result
        const resultResponse = await fetch(`https://queue.fal.run/fal-ai/flux-lora/requests/${requestId}`, {
          headers: {
            'Authorization': `Key ${FAL_API_KEY}`
          }
        });
        return await resultResponse.json();
      } else if (status.status === 'FAILED') {
        throw new Error('Generation failed');
      }
    }
    throw new Error('Generation timed out');
  };

  // Download generated image
  const downloadGeneratedImage = async () => {
    if (!genResult?.url) return;

    try {
      const response = await fetch(genResult.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mara-${genResult.pattern.toLowerCase()}-${genResult.application.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  // Auto-scroll to bottom and keep input focused
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Re-focus input after scroll
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Build conversation history for Claude
  const buildHistory = () => {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.originalText || msg.text
    }));
  };

  // Call Claude API
  const callClaude = async (userMessage) => {
    const history = buildHistory();
    const apiMessages = [...history, { role: 'user', content: userMessage }];

    // Add context about what's already been shown
    const shownContext = shownItems.size > 0
      ? `\n\n[Context: Already shown in this conversation: ${Array.from(shownItems).join(', ')}. Do not repeat these.]`
      : '';

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
          max_tokens: 500,
          system: buildSystemPrompt() + shownContext,
          messages: apiMessages
        })
      });

      const data = await response.json();
      console.log('Claude response:', data);

      if (data.content?.[0]) {
        return data.content[0].text;
      }
      throw new Error(data.error?.message || 'API error');
    } catch (error) {
      console.error('Claude API error:', error);
      return null;
    }
  };

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    // Get Claude's response
    const response = await callClaude(userMessage);

    if (response) {
      const parsed = parseResponse(response);

      // Track shown items
      const newShown = new Set(shownItems);
      parsed.images.forEach(img => newShown.add(img.id));
      parsed.projects.forEach(p => newShown.add(p.id));
      parsed.videos.forEach(v => newShown.add(v.id));
      setShownItems(newShown);

      // Add assistant message with parsed content
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: parsed.cleanText,
        originalText: response,
        images: parsed.images,
        projects: parsed.projects,
        videos: parsed.videos
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "I'm having trouble connecting. Could you try again?"
      }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  // Handle key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen bg-stone-950 text-stone-100 flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Header */}
      <header className="p-4 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-stone-700 to-stone-800 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-stone-300">M</span>
          </div>
          <div>
            <h1 className="font-semibold text-stone-100">Mara</h1>
            <p className="text-xs text-stone-500">MR Walls • One Brain</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGallery(true)}
            className="flex items-center gap-2 px-3 py-2 bg-stone-900 hover:bg-stone-800 rounded-lg border border-stone-700 text-sm text-stone-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Browse All
          </button>
          <button
            onClick={() => { resetGenerate(); setShowGenerate(true); }}
            className="px-3 py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-lg text-sm transition-colors"
          >
            AI Generate
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Welcome message if no messages */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-stone-700 to-stone-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-semibold text-stone-300">M</span>
              </div>
              <p className="text-stone-400 mb-2">Hey! I'm Mara from MR Walls.</p>
              <p className="text-stone-500 text-sm max-w-md">
                I help architects explore carved Corian surfaces. Ask me about patterns, projects, pricing, or just say what you're designing.
              </p>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'space-y-3'}`}>

              {/* Text bubble */}
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-stone-700 text-stone-100'
                  : 'bg-stone-900 border border-stone-800'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>

              {/* Images */}
              {msg.images?.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {msg.images.map((img, j) => (
                    <button
                      key={j}
                      onClick={() => handleImageClick(img)}
                      className="relative w-72 aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 hover:border-stone-600 transition-all text-left"
                    >
                      <img src={img.image} alt={img.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-sm font-medium text-white">{img.title}</p>
                        <p className="text-xs text-stone-400">{img.pattern} • {img.sector}</p>
                      </div>
                      {img.isWaterFeature && (
                        <div className="absolute top-2 left-2 bg-blue-400 text-black text-[10px] font-medium px-2 py-0.5 rounded-full">
                          Water Feature
                        </div>
                      )}
                      {img.isBacklit && !img.isWaterFeature && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-black text-[10px] font-medium px-2 py-0.5 rounded-full">
                          Backlit
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Projects */}
              {msg.projects?.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {msg.projects.map((proj, j) => (
                    <div key={j} className="relative w-72 aspect-[4/3] rounded-xl overflow-hidden border border-stone-800">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-sm font-medium text-white">{proj.title}</p>
                        <p className="text-xs text-stone-400">{proj.client} • {proj.location}</p>
                      </div>
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                        Project
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Videos */}
              {msg.videos?.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {msg.videos.map((vid, j) => (
                    <div key={j} className="w-72 rounded-xl overflow-hidden border border-stone-800 bg-stone-900">
                      <video
                        src={vid.video}
                        controls
                        className="w-full aspect-video"
                      />
                      <div className="p-3">
                        <p className="text-sm font-medium text-white">{vid.title}</p>
                        <p className="text-xs text-stone-400 mt-1">{vid.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

          {/* Loading indicator */}
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
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 border-t border-stone-800">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about patterns, projects, pricing..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-stone-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-stone-100 text-stone-900 rounded-xl font-medium text-sm hover:bg-white disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </footer>

      {/* GALLERY MODAL */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-black/80 backdrop-blur-sm py-4 -mx-4 px-4 z-10">
              <div>
                <h2 className="text-xl font-semibold text-stone-100">Full Collection</h2>
                <p className="text-sm text-stone-500">{IMAGE_CATALOG.length} products • Tap to explore</p>
              </div>
              <button
                onClick={() => setShowGallery(false)}
                className="w-10 h-10 bg-stone-800 hover:bg-stone-700 rounded-full flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {Object.entries(getGalleryPatterns()).map(([pattern, images]) => (
              <div key={pattern} className="mb-8">
                <h3 className="text-sm font-medium text-stone-400 uppercase tracking-wide mb-3">{pattern}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setShowGallery(false); handleImageClick(img); }}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-800 hover:border-stone-600 transition-all group text-left"
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
                          {img.isWaterFeature && <span className="text-[10px] text-blue-400 ml-1">Water</span>}
                          {img.isBacklit && !img.isWaterFeature && <span className="text-[10px] text-amber-400 ml-1">Backlit</span>}
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

      {/* PRODUCT SPECS PAGE */}
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
              {/* Hero Image */}
              <div className="relative rounded-xl overflow-hidden mb-4 bg-stone-900">
                <img
                  src={heroImage?.image || specsImage.image}
                  alt={heroImage?.title || specsImage.title}
                  className="w-full h-auto object-contain"
                />
                {(heroImage || specsImage).isWaterFeature && (
                  <div className="absolute top-4 left-4 bg-blue-400 text-black text-xs font-medium px-3 py-1 rounded-full">
                    Water Feature
                  </div>
                )}
                {(heroImage || specsImage).isBacklit && !(heroImage || specsImage).isWaterFeature && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-medium px-3 py-1 rounded-full">
                    Backlit
                  </div>
                )}
              </div>

              {/* Pattern Gallery - click to swap hero */}
              {patternGallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {patternGallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => swapHeroImage(img)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        heroImage?.id === img.id ? 'border-amber-500' : 'border-stone-700 hover:border-stone-500'
                      }`}
                    >
                      <img src={img.image} alt={img.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Title & Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-stone-100 mb-1">{heroImage?.title || specsImage.title}</h2>
                <p className="text-sm text-stone-400 mb-4">{specsImage.pattern} • {heroImage?.sector || specsImage.sector}</p>
                <p className="text-sm text-stone-300 leading-relaxed">{heroImage?.description || specsImage.description}</p>
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
                    <p className="text-xs text-stone-500 uppercase">{specsImage.specs.size ? 'Size' : 'Max Panel'}</p>
                    <p className="text-sm text-stone-200">{specsImage.specs.size || specsImage.specs.maxPanel || 'Custom'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase">Lead Time</p>
                    <p className="text-sm text-stone-200">{specsImage.specs.leadTime || '4-8 Weeks'}</p>
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
                    <span className="text-stone-400">Base Panel</span>
                    <span className="text-stone-200">${specsImage.specs.pricePerSF || 25}/SF</span>
                  </div>
                  {specsImage.isBacklit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">Backlighting</span>
                      <span className="text-stone-200">+$15/SF</span>
                    </div>
                  )}
                  {specsImage.isWaterFeature && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">Water Feature</span>
                      <span className="text-stone-200">+$20/SF</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Backlight Info */}
              {specsImage.isBacklit && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-6">
                  <h3 className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-3">Backlight Package Includes</h3>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    LED strips, drivers, power supplies, shop drawings, and custom lighting diagram. Turnkey system with remote control.
                  </p>
                </div>
              )}

              {/* Shop Drawing Download */}
              {specsImage.shopDrawing && (
                <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-5 mb-6">
                  <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">Technical Documents</h3>
                  <a
                    href={specsImage.shopDrawing}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-stone-200">Download Shop Drawing</p>
                      <p className="text-xs text-stone-500">PDF with dimensions and panel layout</p>
                    </div>
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => alert('Quote request feature coming soon!')}
                  className="flex-1 py-4 bg-stone-800 hover:bg-stone-700 rounded-xl font-medium text-sm border border-stone-700 transition-colors"
                >
                  Request Quote
                </button>
                <button
                  onClick={() => alert('Added to inquiry! Feature coming soon.')}
                  className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-medium text-sm transition-colors"
                >
                  Add to Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI GENERATE MODAL */}
      {showGenerate && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
          <div className="min-h-full flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-stone-100">AI Generate</h2>
                  <p className="text-xs text-stone-500">Create custom visualizations</p>
                </div>
              </div>
              <button
                onClick={closeGenerate}
                className="w-10 h-10 bg-stone-800 hover:bg-stone-700 rounded-full flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-2xl mx-auto w-full px-4 pb-8">
              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-2 my-6">
                {[1, 2, 3, 4].map(step => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      genStep >= step ? 'bg-amber-500' : 'bg-stone-700'
                    }`}
                  />
                ))}
              </div>

              {/* Step 1: Choose Pattern */}
              {genStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-stone-100 text-center mb-6">Choose a Pattern</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(LORA_MODELS).map(([key, lora]) => (
                      <button
                        key={key}
                        onClick={() => { setGenPattern(key); setGenStep(2); }}
                        className="flex items-center gap-4 p-4 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 rounded-xl transition-all text-left"
                      >
                        <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center text-2xl">
                          {key === 'lake' && '🌊'}
                          {key === 'flame' && '🔥'}
                          {key === 'fins' && '◇'}
                        </div>
                        <div>
                          <p className="font-medium text-stone-100">{lora.name}</p>
                          <p className="text-sm text-stone-400">{lora.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Choose Sector */}
              {genStep === 2 && (
                <div className="space-y-4">
                  <button onClick={() => setGenStep(1)} className="text-sm text-stone-500 hover:text-stone-300 mb-2">
                    ← Back to patterns
                  </button>
                  <h3 className="text-lg font-medium text-stone-100 text-center mb-6">Choose a Sector</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(SECTORS).map(([key, sector]) => (
                      <button
                        key={key}
                        onClick={() => { setGenSector(key); setGenStep(3); }}
                        className="p-4 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 rounded-xl transition-all text-left"
                      >
                        <p className="font-medium text-stone-100">{sector.name}</p>
                        <p className="text-xs text-stone-500 mt-1">{sector.applications.length} applications</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Choose Application */}
              {genStep === 3 && (
                <div className="space-y-4">
                  <button onClick={() => setGenStep(2)} className="text-sm text-stone-500 hover:text-stone-300 mb-2">
                    ← Back to sectors
                  </button>
                  <h3 className="text-lg font-medium text-stone-100 text-center mb-6">Choose an Application</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {SECTORS[genSector]?.applications.map(app => (
                      <button
                        key={app}
                        onClick={() => { setGenApplication(app); setGenStep(4); }}
                        className="p-4 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 rounded-xl transition-all text-left"
                      >
                        <p className="font-medium text-stone-100">{app}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Choose Backlight Color */}
              {genStep === 4 && (
                <div className="space-y-4">
                  <button onClick={() => setGenStep(3)} className="text-sm text-stone-500 hover:text-stone-300 mb-2">
                    ← Back to applications
                  </button>
                  <h3 className="text-lg font-medium text-stone-100 text-center mb-2">Choose Backlight Color</h3>
                  <p className="text-sm text-stone-500 text-center mb-6">Optional: adds dramatic glow effect</p>

                  {genError && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm mb-4">
                      {genError}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {Object.entries(BACKLIGHT_COLORS).map(([key, color]) => (
                      <button
                        key={key}
                        onClick={() => setGenBacklight(key)}
                        className={`p-3 rounded-xl border transition-all ${
                          genBacklight === key
                            ? 'bg-amber-500/20 border-amber-500'
                            : 'bg-stone-900 border-stone-700 hover:border-stone-500'
                        }`}
                      >
                        <div
                          className="w-full h-6 rounded mb-2"
                          style={{
                            background: key === 'warm' ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' :
                                        key === 'cool' ? 'linear-gradient(90deg, #f5f5f5, #e5e5e5)' :
                                        key === 'pink' ? 'linear-gradient(90deg, #ec4899, #db2777)' :
                                        key === 'blue' ? 'linear-gradient(90deg, #3b82f6, #2563eb)' :
                                        key === 'cyan' ? 'linear-gradient(90deg, #06b6d4, #0891b2)' :
                                        'linear-gradient(90deg, #a855f7, #9333ea)'
                          }}
                        />
                        <p className="text-xs text-stone-300">{color.name}</p>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setGenBacklight(null)}
                    className={`w-full p-3 rounded-xl border transition-all mb-6 ${
                      genBacklight === null
                        ? 'bg-stone-700/50 border-stone-500'
                        : 'bg-stone-900 border-stone-700 hover:border-stone-500'
                    }`}
                  >
                    <p className="text-sm text-stone-300">No backlight (ambient light only)</p>
                  </button>

                  {/* Summary */}
                  <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-4 mb-6">
                    <p className="text-xs text-stone-500 uppercase mb-2">Your Selection</p>
                    <p className="text-sm text-stone-300">
                      <span className="text-amber-400">{LORA_MODELS[genPattern]?.name}</span> pattern in a{' '}
                      <span className="text-amber-400">{SECTORS[genSector]?.name}</span>{' '}
                      <span className="text-amber-400">{genApplication}</span>
                      {genBacklight && <> with <span className="text-amber-400">{BACKLIGHT_COLORS[genBacklight]?.name}</span> backlighting</>}
                    </p>
                  </div>

                  <button
                    onClick={generateImage}
                    disabled={genLoading}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black font-medium rounded-xl transition-colors"
                  >
                    Generate Visualization
                  </button>
                </div>
              )}

              {/* Step 5: Generating */}
              {genStep === 5 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-6" />
                  <h3 className="text-lg font-medium text-stone-100 mb-2">Generating your visualization...</h3>
                  <p className="text-sm text-stone-500">This usually takes 15-30 seconds</p>
                </div>
              )}

              {/* Step 6: Result */}
              {genStep === 6 && genResult && (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-stone-900">
                    <img
                      src={genResult.url}
                      alt="Generated visualization"
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-4">
                    <p className="text-xs text-stone-500 uppercase mb-2">Generated Design</p>
                    <p className="text-sm text-stone-300">
                      <span className="text-amber-400">{genResult.pattern}</span> in{' '}
                      <span className="text-amber-400">{genResult.sector}</span>{' '}
                      <span className="text-amber-400">{genResult.application}</span>
                      {genResult.backlight !== 'None' && <> with <span className="text-amber-400">{genResult.backlight}</span> backlighting</>}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={downloadGeneratedImage}
                      className="flex-1 py-4 bg-stone-800 hover:bg-stone-700 rounded-xl font-medium text-sm border border-stone-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={resetGenerate}
                      className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-medium text-sm transition-colors"
                    >
                      Generate Another
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
