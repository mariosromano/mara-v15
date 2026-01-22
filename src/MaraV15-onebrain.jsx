import { useState, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// MARA V15 - ONE BRAIN ARCHITECTURE
// Claude decides everything. Local code just renders.
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
    isWaterFeature: true,
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
    isWaterFeature: true,
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
    isWaterFeature: true,
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
    isWaterFeature: true,
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
    isWaterFeature: true,
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
    id: 'sand-dune-1',
    pattern: 'Sand Dune',
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
- Linear patterns: $25/SF
- Custom patterns: $50/SF
- Backlighting add-on: +$15/SF
- Water feature add-on: +$20/SF
- Lead time: 4-10 weeks depending on complexity

## HOW TO SHOW CONTENT
Use these tags in your response to display media:
- [Image: id] — shows a product image
- [Project: id] — shows a project/case study
- [Video: id] — shows an instructional video

Example: "Lake is perfect for meditation spaces. [Image: lake-backlit-1]"

## RULES
1. Show max 2 images per response
2. NEVER ask "would you like to see it backlit?" if the item already has isBacklit: true
3. Don't show the same item twice in a conversation — pick something new
4. General questions (who is Mario, what is MR Walls, pricing) do NOT need images
5. Match the user's depth — design language for explorers, technical for specifiers
6. If user says "yes", "more", "show me more" — show the next relevant item, don't repeat

## AVAILABLE PRODUCTS (IMAGE_CATALOG)
${JSON.stringify(imageList, null, 2)}

## COMPLETED PROJECTS (PROJECTS_CATALOG)
${JSON.stringify(projectList, null, 2)}

## INSTRUCTIONAL VIDEOS (VIDEOS_CATALOG)
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

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          <button className="px-3 py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-lg text-sm transition-colors">
            AI Generate
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message if no messages */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
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
                    <div key={j} className="relative w-72 aspect-[4/3] rounded-xl overflow-hidden border border-stone-800">
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
                    </div>
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
    </div>
  );
}
