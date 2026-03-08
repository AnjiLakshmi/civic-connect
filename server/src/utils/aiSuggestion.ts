export const aiIssueMapping: Record<string, { dept: string; priority: 'low' | 'medium' | 'high' }> = {
  'Streetlight Not Working': { dept: 'BESCOM', priority: 'medium' },
  'Electric Pole Damage': { dept: 'BESCOM', priority: 'high' },
  'Power Line Issue': { dept: 'BESCOM', priority: 'high' },
  'Garbage Pile': { dept: 'BBMP', priority: 'medium' },
  'Pothole': { dept: 'BBMP', priority: 'high' },
  'Drainage Issue': { dept: 'BBMP', priority: 'high' },
  'Road Crack': { dept: 'BBMP', priority: 'low' },
  'Broken Footpath': { dept: 'BBMP', priority: 'medium' },
};

export function getSuggestion(issueType: string) {
  return aiIssueMapping[issueType] || { dept: 'Unknown', priority: 'low' };
}
