// ═══════════════════════════════════════════════════════════════════════════════
// AIRTABLE PRODUCTS API
// Fetches MakeReal products from Airtable
// ═══════════════════════════════════════════════════════════════════════════════

// Environment variables - set in Vercel dashboard
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || 'appo9jJWfID89uSUC';
const AIRTABLE_TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID || 'tblLADTjgy121q5Ws';
const AIRTABLE_TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

/**
 * Fetch all products from Airtable MakeReal Products table
 * Handles pagination automatically
 */
export async function fetchProducts() {
  const allRecords = [];
  let offset = null;
  
  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`);
    if (offset) url.searchParams.set('offset', offset);
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }
    
    const data = await response.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);
  
  return allRecords.map(transformRecord).filter(p => p.image); // Only products with images
}

/**
 * Transform Airtable record to IMAGE_CATALOG format
 */
function transformRecord(record) {
  const f = record.fields;
  
  // Parse keywords into array
  const keywords = (f.keywords || '')
    .split(',')
    .map(k => k.trim().toLowerCase())
    .filter(k => k.length > 0);
  
  // Add pattern and sector to keywords for search
  if (f.pattern) keywords.push(f.pattern.toLowerCase());
  if (f.sector) keywords.push(f.sector.toLowerCase());
  if (f.corianColor) keywords.push(f.corianColor.toLowerCase());
  
  // Derive mood from keywords/description
  const mood = deriveMood(f.description || '', keywords);
  
  return {
    id: f.id || record.id,
    pattern: f.pattern || 'Custom',
    patternFamily: f.patternFamily || f.pattern || 'Custom',
    title: f.title || 'Untitled',
    sector: f.sector || 'General',
    corianColor: f.corianColor || 'Glacier White',
    mood: mood,
    isBacklit: f.isBacklit || false,
    keywords: keywords,
    image: f.cloudinaryUrl || null,
    specs: {
      material: f.material || 'DuPont Corian®',
      color: f.corianColor || 'Glacier White',
      maxPanel: f.maxPanel || '144" × 60"',
      leadTime: f.leadTime || '6-10 Weeks',
      pricePerSF: f.pricePerSF || 35,
      system: 'InterlockPanel™'
    },
    description: f.description || ''
  };
}

/**
 * Derive mood tags from description and keywords
 */
function deriveMood(description, keywords) {
  const moods = [];
  const text = (description + ' ' + keywords.join(' ')).toLowerCase();
  
  if (text.includes('calm') || text.includes('serene') || text.includes('peaceful')) moods.push('calm');
  if (text.includes('dramatic') || text.includes('bold') || text.includes('statement')) moods.push('dramatic');
  if (text.includes('warm') || text.includes('cozy') || text.includes('inviting')) moods.push('warm');
  if (text.includes('modern') || text.includes('contemporary')) moods.push('modern');
  if (text.includes('luxury') || text.includes('elegant') || text.includes('upscale')) moods.push('luxury');
  if (text.includes('organic') || text.includes('natural') || text.includes('biophilic')) moods.push('organic');
  if (text.includes('backlit') || text.includes('glow') || text.includes('illuminat')) moods.push('glowing');
  if (text.includes('zen') || text.includes('meditat') || text.includes('spiritual')) moods.push('zen');
  
  // Default moods if none detected
  if (moods.length === 0) moods.push('architectural', 'modern');
  
  return moods;
}

export default fetchProducts;
