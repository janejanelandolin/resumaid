
/**
 * Extract relevant keywords from job description text
 */
export function extractKeywords(text: string): string[] {
  if (!text) return [];

  // Common technical skills and keywords
  const keywordPatterns = [
    /react/i, /javascript/i, /typescript/i, /node\.?js/i, /vue/i, /angular/i, 
    /python/i, /java/i, /c\+\+/i, /c#/i, /\.net/i, /sql/i, /nosql/i, /aws/i,
    /azure/i, /cloud/i, /docker/i, /kubernetes/i, /devops/i, /ci\/cd/i,
    /rest/i, /api/i, /frontend/i, /backend/i, /fullstack/i, /ui\/ux/i,
    /html/i, /css/i, /sass/i, /less/i, /tailwind/i, /bootstrap/i,
    /git/i, /agile/i, /scrum/i, /qa/i, /testing/i, /automation/i,
    /design/i, /marketing/i, /seo/i, /analytics/i, /data/i, /ai/i, /ml/i, 
    /mobile/i, /android/i, /ios/i, /swift/i, /kotlin/i, /flutter/i,
    /react native/i, /management/i, /leadership/i, /communication/i,
    /degree/i, /bachelor/i, /master/i, /certification/i, /experience/i
  ];

  // Extract all matches
  const keywords = new Set<string>();
  keywordPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      keywords.add(matches[0]);
    }
  });

  // Get top 5-8 keywords (random selection if more than 8)
  const keywordArray = Array.from(keywords);
  if (keywordArray.length <= 8) {
    return keywordArray;
  }
  
  // Select 5-8 random keywords
  const numKeywords = Math.min(Math.floor(Math.random() * 4) + 5, keywordArray.length);
  const shuffled = keywordArray.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numKeywords);
}
