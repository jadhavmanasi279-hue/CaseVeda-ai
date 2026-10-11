import { CourtJudgment, DocumentComparisonResult, ComparisonFieldResult, ComparisonStatus } from '../types';

/**
 * Compares two analyzed Indian court documents and calculates alignment, discrepancies, and status.
 */
export function compareJudgments(docA: CourtJudgment, docB: CourtJudgment): DocumentComparisonResult {
  const fields: ComparisonFieldResult[] = [];
  let discrepancyCount = 0;

  // 1. Court Name
  const courtMatch = normalizeString(docA.extractedData.courtName.value) === normalizeString(docB.extractedData.courtName.value);
  if (!courtMatch) discrepancyCount++;
  fields.push({
    field: 'courtName',
    label: 'Court Name',
    valA: docA.extractedData.courtName.value,
    valB: docB.extractedData.courtName.value,
    pageA: docA.extractedData.courtName.pageNumber,
    pageB: docB.extractedData.courtName.pageNumber,
    matchStatus: courtMatch ? 'Match' : 'Mismatch',
    details: courtMatch ? 'Jurisdictional forum matches.' : 'Different court forums identified.',
  });

  // 2. Case Number
  const caseNumMatch = normalizeString(docA.extractedData.caseNumber.value) === normalizeString(docB.extractedData.caseNumber.value);
  if (!caseNumMatch) discrepancyCount++;
  fields.push({
    field: 'caseNumber',
    label: 'Case Registration No.',
    valA: docA.extractedData.caseNumber.value,
    valB: docB.extractedData.caseNumber.value,
    pageA: docA.extractedData.caseNumber.pageNumber,
    pageB: docB.extractedData.caseNumber.pageNumber,
    matchStatus: caseNumMatch ? 'Match' : 'Mismatch',
    details: caseNumMatch ? 'Case filing citations match.' : 'Case numbers diverge between documents.',
  });

  // 3. Petitioner / Appellant
  const petA = normalizeString(docA.extractedData.petitioner.value);
  const petB = normalizeString(docB.extractedData.petitioner.value);
  const petMatch = petA.includes(petB) || petB.includes(petA) || petA === petB;
  if (!petMatch) discrepancyCount++;
  fields.push({
    field: 'petitioner',
    label: 'Petitioner / Appellant',
    valA: docA.extractedData.petitioner.value,
    valB: docB.extractedData.petitioner.value,
    pageA: docA.extractedData.petitioner.pageNumber,
    pageB: docB.extractedData.petitioner.pageNumber,
    matchStatus: petMatch ? 'Match' : 'Mismatch',
    details: petMatch ? 'Petitioner party identities align.' : 'Discrepancy in recorded appellant/petitioner.',
  });

  // 4. Respondent
  const respA = normalizeString(docA.extractedData.respondent.value);
  const respB = normalizeString(docB.extractedData.respondent.value);
  const respMatch = respA.includes(respB) || respB.includes(respA) || respA === respB;
  if (!respMatch) discrepancyCount++;
  fields.push({
    field: 'respondent',
    label: 'Respondent / Defendant',
    valA: docA.extractedData.respondent.value,
    valB: docB.extractedData.respondent.value,
    pageA: docA.extractedData.respondent.pageNumber,
    pageB: docB.extractedData.respondent.pageNumber,
    matchStatus: respMatch ? 'Match' : 'Mismatch',
    details: respMatch ? 'Respondent party identities align.' : 'Discrepancy in recorded respondent party.',
  });

  // 5. Final Outcome / Operative Disposition (CRITICAL)
  const outcomeA = docA.extractedData.finalOutcome.disposition;
  const outcomeB = docB.extractedData.finalOutcome.disposition;
  const outcomeMatch = outcomeA === outcomeB && outcomeA !== 'Needs Review';
  if (!outcomeMatch) discrepancyCount += 2; // heavily weighted
  fields.push({
    field: 'finalOutcome',
    label: 'Final Operative Ruling',
    valA: outcomeA,
    valB: outcomeB,
    pageA: docA.extractedData.finalOutcome.pageNumber,
    pageB: docB.extractedData.finalOutcome.pageNumber,
    matchStatus: outcomeMatch ? 'Match' : (outcomeA === 'Needs Review' || outcomeB === 'Needs Review' ? 'Unverified' : 'Mismatch'),
    details: outcomeMatch
      ? 'Operative dispositions match exactly.'
      : (outcomeA === 'Needs Review' || outcomeB === 'Needs Review'
        ? 'Operative ruling in one document requires manual verification.'
        : 'CRITICAL ALERT: Rulings conflict between documents! Possible modification or different order.'),
  });

  // 6. Acts and Sections Cited
  const sectionsA = new Set(docA.extractedData.actsAndSections.map(s => `${s.act} - ${s.section}`));
  const sectionsB = new Set(docB.extractedData.actsAndSections.map(s => `${s.act} - ${s.section}`));
  const commonSections = [...sectionsA].filter(x => sectionsB.has(x));
  const totalUniqueSections = new Set([...sectionsA, ...sectionsB]).size;
  const sectionSimilarity = totalUniqueSections > 0 ? (commonSections.length / totalUniqueSections) * 100 : 100;
  
  const sectionStatus = sectionSimilarity >= 80 ? 'Match' : (sectionSimilarity >= 40 ? 'Partial' : 'Mismatch');
  if (sectionStatus === 'Mismatch') discrepancyCount++;

  fields.push({
    field: 'actsAndSections',
    label: 'Statutory Provisions Cited',
    valA: `${docA.extractedData.actsAndSections.length} sections cited (${docA.extractedData.actsAndSections.map(s => s.section).join(', ') || 'None'})`,
    valB: `${docB.extractedData.actsAndSections.length} sections cited (${docB.extractedData.actsAndSections.map(s => s.section).join(', ') || 'None'})`,
    matchStatus: sectionStatus,
    details: `${Math.round(sectionSimilarity)}% overlap in statutory provisions cited.`,
  });

  // Determine Overall Status
  let overallStatus: ComparisonStatus;
  let similarityScore = Math.max(0, Math.round(100 - (discrepancyCount * 18)));

  const hasUncertainty = docA.overallStatus === 'Needs Review' || docB.overallStatus === 'Needs Review';

  if (discrepancyCount > 0 && !caseNumMatch) {
    overallStatus = 'Mismatch Detected';
    similarityScore = Math.min(similarityScore, 48);
  } else if (!outcomeMatch && outcomeA !== 'Needs Review' && outcomeB !== 'Needs Review') {
    overallStatus = 'Mismatch Detected';
    similarityScore = Math.min(similarityScore, 35);
  } else if (hasUncertainty || docA.confidenceScore < 60 || docB.confidenceScore < 60) {
    overallStatus = 'Unverified';
  } else if (discrepancyCount === 0) {
    overallStatus = 'Verified Match';
    similarityScore = Math.max(92, similarityScore);
  } else {
    overallStatus = 'Mismatch Detected';
  }

  const notice = "CaseVeda AI Protocol Warning: 'Verified Match' indicates structural and semantic alignment between the two analyzed files. It does NOT claim external document authenticity unless independently verified against trusted authoritative court portals (e.g., eCourts.gov.in, sci.gov.in, or certified physical copies).";

  return {
    id: `comp-${Date.now()}`,
    timestamp: new Date().toISOString(),
    docAId: docA.id,
    docAName: docA.fileName,
    docBId: docB.id,
    docBName: docB.fileName,
    overallStatus,
    similarityScore,
    authoritativeSourceChecked: false,
    discrepanciesCount: discrepancyCount,
    fields,
    verdictComparison: {
      outcomeA,
      outcomeB,
      isMatch: outcomeMatch,
      evidenceQuoteA: docA.extractedData.finalOutcome.evidenceQuote,
      evidenceQuoteB: docB.extractedData.finalOutcome.evidenceQuote,
    },
    notice,
  };
}

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}
