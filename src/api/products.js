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
 * Handles pagination automatically (Airtable returns max 100 per page)
 */
export async function fetchProducts() {
  const allRecords = [];
  let offset = undefined;
  let pageCount = 0;
  const maxPages = 10; // Safety limit
  
  console.log('[Airtable] Starting fetch, token exists:', !!AIRTABLE_TOKEN);
  
  try {
    do {
      const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`);
      url.searchParams.set('pageSize', '100');
      if (offset) url.searchParams.set('offset', offset);
      
      console.log(`[Airtable] Fetching page ${pageCount + 1}...`);
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Airtable] API error ${response.status}:`, errorText);
        throw new Error(`Airtable API error: ${response.status}`);
      }
      
      const data = await response.json();
      allRecords.push(...data.records);
      offset = data.offset; // Will be undefined when no more pages
      pageCount++;
      
      console.log(`[Airtable] Page ${pageCount}: ${data.records.length} records, total so far: ${allRecords.length}, hasMore: ${!!offset}`);
      
      // Safety check
      if (pageCount >= maxPages) {
        console.warn('[Airtable] Hit max pages limit');
        break;
      }
    } while (offset);
    
    console.log(`[Airtable] Total records fetched: ${allRecords.length}`);
    
    // Filter to only products with valid Cloudinary URLs (not expired DASH URLs)
    const withImages = allRecords
      .map(transformRecord)
      .filter(p => p.image && p.image.includes('res.cloudinary.com'));
    
    console.log(`[Airtable] Products with valid Cloudinary images: ${withImages.length}`);
    return withImages;
  } catch (error) {
    console.error('[Airtable] Fetch failed:', error);
    throw error;
  }
}

/**
 * Transform Airtable record to IMAGE_CATALOG format
 */
function transformRecord(record) {
  const f = record.fields;
  
  // Parse keywords into array (Airtable uses semicolons)
  const keywords = (f.keywords || '')
    .split(/[;,]/)  // Split on semicolon OR comma
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
