import { 
  CourtJudgment, 
  ExtractedField, 
  CitedSection, 
  ExtractedOutcome, 
  PageContent, 
  VerificationStatus,
  OrderClassification,
  CasePriority,
  PriorityClassification
} from '../types';

// Statutory database for Indian law
interface StatutoryRef {
  regex: RegExp;
  act: string;
  section: string;
  description: string;
}

const STATUTORY_KNOWLEDGE_BASE: StatutoryRef[] = [
  {
    regex: /(?:Section|Sec\.?|S\.)\s*302\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*302\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 302',
    description: 'Punishment for murder (Capital punishment or life imprisonment and fine).',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*304\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*304\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 304',
    description: 'Punishment for culpable homicide not amounting to murder.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*307\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*307\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 307',
    description: 'Attempt to murder.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*420\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*420\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 420',
    description: 'Cheating and dishonestly inducing delivery of property.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*498A\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*498A\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 498A',
    description: 'Husband or relative of husband of a woman subjecting her to cruelty (Dowry harassment).',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*34\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*34\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 34',
    description: 'Acts done by several persons in furtherance of common intention.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*120B\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*120B\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 120B',
    description: 'Punishment of criminal conspiracy.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*439\b.*?(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b|(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b.*?(?:Section|Sec\.?|S\.)\s*439\b/i,
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 439',
    description: 'Special powers of High Court or Court of Session regarding bail.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*438\b.*?(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b|(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b.*?(?:Section|Sec\.?|S\.)\s*438\b/i,
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 438',
    description: 'Direction for grant of bail to person apprehending arrest (Anticipatory Bail).',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*482\b.*?(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b|(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b.*?(?:Section|Sec\.?|S\.)\s*482\b/i,
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 482',
    description: 'Saving of inherent powers of High Court to prevent abuse of process of any court.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*154\b.*?(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b/i,
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 154',
    description: 'Information in cognizable cases (First Information Report - FIR).',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*313\b.*?(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b/i,
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 313',
    description: 'Power to examine the accused personally in trial.',
  },
  {
    regex: /Article\s+226\b.*?(?:Constitution\s+of\s+India|Constitution)\b|(?:Constitution\s+of\s+India|Constitution)\b.*?Article\s+226\b/i,
    act: 'Constitution of India, 1950',
    section: 'Article 226',
    description: 'Power of High Courts to issue certain writs (Habeas Corpus, Mandamus, Certiorari, etc.).',
  },
  {
    regex: /Article\s+32\b.*?(?:Constitution\s+of\s+India|Constitution)\b|(?:Constitution\s+of\s+India|Constitution)\b.*?Article\s+32\b/i,
    act: 'Constitution of India, 1950',
    section: 'Article 32',
    description: 'Remedies for enforcement of Fundamental Rights conferred by Part III.',
  },
  {
    regex: /Article\s+21\b.*?(?:Constitution\s+of\s+India|Constitution)\b|(?:Constitution\s+of\s+India|Constitution)\b.*?Article\s+21\b/i,
    act: 'Constitution of India, 1950',
    section: 'Article 21',
    description: 'Protection of life and personal liberty.',
  },
  {
    regex: /Article\s+136\b.*?(?:Constitution\s+of\s+India|Constitution)\b|(?:Constitution\s+of\s+India|Constitution)\b.*?Article\s+136\b/i,
    act: 'Constitution of India, 1950',
    section: 'Article 136',
    description: 'Special leave to appeal by the Supreme Court (SLP jurisdiction).',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*138\b.*?(?:Negotiable\s+Instruments\s+Act|NI\s+Act)\b|(?:Negotiable\s+Instruments\s+Act|NI\s+Act)\b.*?(?:Section|Sec\.?|S\.)\s*138\b/i,
    act: 'Negotiable Instruments Act, 1881',
    section: 'Section 138',
    description: 'Dishonour of cheque for insufficiency of funds in the bank account.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*141\b.*?(?:Negotiable\s+Instruments\s+Act|NI\s+Act)\b|(?:Negotiable\s+Instruments\s+Act|NI\s+Act)\b.*?(?:Section|Sec\.?|S\.)\s*141\b/i,
    act: 'Negotiable Instruments Act, 1881',
    section: 'Section 141',
    description: 'Offences by companies and vicarious liability of Directors.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*139\b.*?(?:Negotiable\s+Instruments\s+Act|NI\s+Act)\b|(?:Negotiable\s+Instruments\s+Act|NI\s+Act)\b.*?(?:Section|Sec\.?|S\.)\s*139\b/i,
    act: 'Negotiable Instruments Act, 1881',
    section: 'Section 139',
    description: 'Presumption in favour of holder regarding legally enforceable debt.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*34\b.*?(?:Arbitration\s+and\s+Conciliation\s+Act|Arbitration\s+Act)\b/i,
    act: 'Arbitration and Conciliation Act, 1996',
    section: 'Section 34',
    description: 'Application for setting aside arbitral award on grounds of patent illegality or public policy.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*9\b.*?(?:Arbitration\s+and\s+Conciliation\s+Act|Arbitration\s+Act)\b/i,
    act: 'Arbitration and Conciliation Act, 1996',
    section: 'Section 9',
    description: 'Interim measures by court before or during arbitral proceedings.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*37\b.*?(?:Arbitration\s+and\s+Conciliation\s+Act|Arbitration\s+Act)\b/i,
    act: 'Arbitration and Conciliation Act, 1996',
    section: 'Section 37',
    description: 'Appealable orders in arbitration matters.',
  },
  {
    regex: /Order\s+(?:XXXIX|39)\s+Rule\s+(?:1|2|1\s+and\s+2)\b.*?(?:CPC|Code\s+of\s+Civil\s+Procedure)\b/i,
    act: 'Code of Civil Procedure, 1908',
    section: 'Order 39 Rules 1 & 2',
    description: 'Temporary injunctions and interlocutory orders.',
  },
];

/**
 * Validates whether quote exists in pageText after only safe whitespace normalization.
 * Returns true only if it is an exact substring.
 */
export function validateEvidenceQuote(pageText: string, quote: string): boolean {
  if (!pageText || !quote) return false;
  const normPage = pageText.replace(/\s+/g, ' ').trim();
  const normQuote = quote.replace(/\s+/g, ' ').trim();
  return normPage.includes(normQuote);
}

/**
 * Extracts a complete, natural sentence containing the match without arbitrary slicing or fake ellipsis.
 * Ensures the returned quote is a direct substring of the page text.
 */
function extractCleanSentence(text: string, matchIndex: number, matchLength: number): string {
  if (!text || matchIndex < 0) return '';

  // Look backwards for sentence start (punctuation followed by whitespace/newline or start of paragraph)
  let start = 0;
  for (let i = matchIndex - 1; i >= 0; i--) {
    const char = text[i];
    if (char === '\n') {
      start = i + 1;
      break;
    }
    if ((char === '.' || char === '!' || char === '?') && i + 1 < matchIndex && /\s/.test(text[i + 1])) {
      // Avoid breaking on abbreviations like "Mr.", "No.", "v.", "J.", "Ors.", "Anr."
      const precedingWord = text.substring(Math.max(0, i - 6), i + 1);
      if (!/\b(?:Mr|Ms|Dr|No|vs|v|J|CJI|Ors|Anr|Sec|Art|Hon'ble)\.$/i.test(precedingWord)) {
        start = i + 1;
        break;
      }
    }
  }

  // Look forward for sentence end
  let end = text.length;
  for (let i = matchIndex + matchLength; i < text.length; i++) {
    const char = text[i];
    if (char === '\n') {
      end = i;
      break;
    }
    if (char === '.' || char === '!' || char === '?') {
      const precedingWord = text.substring(Math.max(0, i - 6), i + 1);
      if (!/\b(?:Mr|Ms|Dr|No|vs|v|J|CJI|Ors|Anr|Sec|Art|Hon'ble)\.$/i.test(precedingWord)) {
        end = i + 1;
        break;
      }
    }
  }

  const rawSentence = text.substring(start, end).trim();

  // Strip trailing signature lines, dots or dates if captured
  const cleanSentence = rawSentence
    .replace(/[._\-]{3,}.*$/g, '')
    .replace(/\s*\[?(?:NEW\s+DELHI|MUMBAI|ALLAHABAD|KOLKATA|BOMBAY|DELHI|BENCH)[\s;:,].*$/i, '')
    .trim();

  // Validate that the sentence is a valid substring of text
  if (text.includes(cleanSentence) && cleanSentence.length > 5) {
    return cleanSentence;
  }

  // Fallback: exact match chunk without breaking words
  const fallback = text.substring(matchIndex, Math.min(text.length, matchIndex + matchLength)).trim();
  return fallback;
}

/**
 * Searches pages for an exact regex and extracts a clean, validated sentence.
 */
function findInPagesClean(pages: PageContent[], regex: RegExp): { match: RegExpMatchArray; page: number; sentence: string } | null {
  for (const p of pages) {
    const match = p.text.match(regex);
    if (match && match.index !== undefined) {
      const sentence = extractCleanSentence(p.text, match.index, match[0].length);
      if (sentence && validateEvidenceQuote(p.text, sentence)) {
        return { match, page: p.pageNumber, sentence };
      }
    }
  }
  return null;
}

/**
 * Extracts Indian Court Name from front page text
 */
function extractCourtName(pages: PageContent[]): ExtractedField {
  const frontPages = pages.slice(0, 2);

  const courtPatterns = [
    { name: 'Supreme Court of India', regex: /(?:IN\s+THE\s+)?SUPREME\s+COURT\s+OF\s+INDIA\b/i },
    { name: 'High Court of Judicature at Bombay', regex: /(?:HIGH\s+COURT\s+OF\s+JUDICATURE\s+AT\s+BOMBAY|BOMBAY\s+HIGH\s+COURT)\b/i },
    { name: 'High Court of Delhi', regex: /(?:HIGH\s+COURT\s+OF\s+DELHI|DELHI\s+HIGH\s+COURT)\b/i },
    { name: 'High Court of Judicature at Allahabad', regex: /(?:HIGH\s+COURT\s+OF\s+JUDICATURE\s+AT\s+ALLAHABAD|ALLAHABAD\s+HIGH\s+COURT)\b/i },
    { name: 'High Court of Judicature at Madras', regex: /(?:HIGH\s+COURT\s+OF\s+JUDICATURE\s+AT\s+MADRAS|MADRAS\s+HIGH\s+COURT)\b/i },
    { name: 'High Court at Calcutta', regex: /(?:HIGH\s+COURT\s+AT\s+CALCUTTA|CALCUTTA\s+HIGH\s+COURT)\b/i },
    { name: 'High Court of Karnataka', regex: /(?:HIGH\s+COURT\s+OF\s+KARNATAKA|KARNATAKA\s+HIGH\s+COURT)\b/i },
    { name: 'National Company Law Appellate Tribunal', regex: /(?:NATIONAL\s+COMPANY\s+LAW\s+APPELLATE\s+TRIBUNAL|NCLAT)\b/i },
    { name: 'Court of Sessions / District Court', regex: /(?:IN\s+THE\s+COURT\s+OF\s+(?:ADDITIONAL\s+)?SESSIONS\s+JUDGE|DISTRICT\s+AND\s+SESSIONS\s+COURT)\b/i },
  ];

  for (const cp of courtPatterns) {
    const found = findInPagesClean(frontPages, cp.regex);
    if (found) {
      return {
        value: cp.name,
        confidence: 98,
        pageNumber: found.page,
        evidenceQuote: found.sentence,
        status: 'Verified',
      };
    }
  }

  // Check front text for generic court heading
  for (const p of frontPages) {
    const genericMatch = p.text.match(/(?:IN\s+THE\s+COURT\s+OF|BEFORE\s+THE\s+HON'BLE)\s+([A-Z\s,]{6,70})/i);
    if (genericMatch && genericMatch.index !== undefined) {
      const sentence = extractCleanSentence(p.text, genericMatch.index, genericMatch[0].length);
      return {
        value: genericMatch[1].trim(),
        confidence: 70,
        pageNumber: p.pageNumber,
        evidenceQuote: sentence,
        status: 'Needs Review',
        reviewReason: 'Court name extracted using generic title block; verification against registry roster advised.',
      };
    }
  }

  return {
    value: 'Not detected in document header',
    confidence: 0,
    pageNumber: null,
    evidenceQuote: null,
    status: 'Needs Review',
    reviewReason: 'No formal Indian Court header recognized on initial pages.',
  };
}

/**
 * Extracts Case Type and Number
 */
function extractCaseDetails(pages: PageContent[]): { caseType: ExtractedField; caseNumber: ExtractedField; year: ExtractedField } {
  const frontPages = pages.slice(0, 2);

  const casePatterns = [
    { type: 'Criminal Appeal', regex: /CRIMINAL\s+APPEAL\s+NO(?:\.|S)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
    { type: 'Civil Appeal', regex: /CIVIL\s+APPEAL\s+NO(?:\.|S)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
    { type: 'Special Leave Petition (Crl.)', regex: /SPECIAL\s+LEAVE\s+PETITION\s*\((?:CRL\.?|CRIMINAL)\)\s*(?:NO(?:\.|S)?)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
    { type: 'Special Leave Petition (Civil)', regex: /SPECIAL\s+LEAVE\s+PETITION\s*\((?:CIVIL|C)\)\s*(?:NO(?:\.|S)?)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
    { type: 'Writ Petition (Civil)', regex: /WRIT\s+PETITION\s*\((?:CIVIL|C)\)\s*(?:NO(?:\.|S)?)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})|W\.?P\.?\s*\(C\)\s*NO\.?\s*([0-9\s/-]+)\/([0-9]{4})/i },
    { type: 'Writ Petition (Criminal)', regex: /WRIT\s+PETITION\s*\((?:CRL\.?|CRIMINAL)\)\s*(?:NO(?:\.|S)?)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
    { type: 'Bail Application', regex: /BAIL\s+APPLN\.?\s*(?:NO\.?)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
    { type: 'Arbitration Petition', regex: /(?:ARB\.?\s*P\.?|ARBITRATION\s+PETITION|O\.M\.P\.\s*\(COMM\))\s*(?:NO\.?)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
  ];

  for (const cp of casePatterns) {
    const found = findInPagesClean(frontPages, cp.regex);
    if (found) {
      const num = (found.match[1] || found.match[3] || '').trim().replace(/\s+/g, '');
      const yr = (found.match[2] || found.match[4] || '').trim();
      const fullCaseNo = `${cp.type} No. ${num} of ${yr}`;

      return {
        caseType: {
          value: cp.type,
          confidence: 96,
          pageNumber: found.page,
          evidenceQuote: found.sentence,
          status: 'Verified',
        },
        caseNumber: {
          value: fullCaseNo,
          confidence: 96,
          pageNumber: found.page,
          evidenceQuote: found.sentence,
          status: 'Verified',
        },
        year: {
          value: yr,
          confidence: 96,
          pageNumber: found.page,
          evidenceQuote: found.sentence,
          status: 'Verified',
        },
      };
    }
  }

  // Broad generic pattern
  for (const p of frontPages) {
    const genericMatch = p.text.match(/(?:Case|Petition|Appeal|Reference|O\.M\.P\.)\s+No(?:\.|:)?\s*([A-Za-z0-9\s/().-]+(?:of|\/)\s*[0-9]{4})/i);
    if (genericMatch && genericMatch.index !== undefined) {
      const sentence = extractCleanSentence(p.text, genericMatch.index, genericMatch[0].length);
      const yr = genericMatch[1].match(/[0-9]{4}/)?.[0] || 'Unknown';
      return {
        caseType: {
          value: 'Indian Court Proceeding',
          confidence: 75,
          pageNumber: p.pageNumber,
          evidenceQuote: sentence,
          status: 'Needs Review',
          reviewReason: 'Case type classification extracted from non-standard title string.',
        },
        caseNumber: {
          value: genericMatch[1].trim(),
          confidence: 85,
          pageNumber: p.pageNumber,
          evidenceQuote: sentence,
          status: 'Verified',
        },
        year: {
          value: yr,
          confidence: 85,
          pageNumber: p.pageNumber,
          evidenceQuote: sentence,
          status: 'Verified',
        },
      };
    }
  }

  return {
    caseType: {
      value: 'Not detected in document header',
      confidence: 0,
      pageNumber: null,
      evidenceQuote: null,
      status: 'Needs Review',
      reviewReason: 'Missing standard Case Type declaration on initial pages.',
    },
    caseNumber: {
      value: 'Not detected in document header',
      confidence: 0,
      pageNumber: null,
      evidenceQuote: null,
      status: 'Needs Review',
      reviewReason: 'No case registration number detected on title page.',
    },
    year: {
      value: 'Unknown',
      confidence: 0,
      pageNumber: null,
      evidenceQuote: null,
      status: 'Needs Review',
    },
  };
}

/**
 * Cleans party name string, removing legal role suffixes, dots and noise
 */
function cleanPartyString(str: string): string {
  return str
    .replace(/\s*(?:\.{3,}|_{3,})\s*(?:Appellant|Petitioner|Plaintiff|Applicant|Respondent|Defendant|Opposite\s+Party)(?:s|\(s\))?/gi, '')
    .replace(/^(?:IN\s+THE\s+MATTER\s+OF\s*:?|BETWEEN\s*:?)/gi, '')
    .replace(/[\n\r]+/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/^[\s,.-]+|[\s,.-]+$/g, '')
    .trim();
}

/**
 * Extracts Litigating Parties (Petitioner / Appellant vs Respondent) from the cause title.
 * Correctly extracts exact verbatim evidence lines from Page 1 and marks them Verified.
 */
function extractParties(pages: PageContent[]): { petitioner: ExtractedField; respondent: ExtractedField } {
  const page1 = pages[0];
  if (!page1 || !page1.text) {
    return {
      petitioner: {
        value: 'Not detected in document',
        confidence: 0,
        pageNumber: null,
        evidenceQuote: null,
        status: 'Needs Review',
        reviewReason: 'Document lacks readable title page.',
      },
      respondent: {
        value: 'Not detected in document',
        confidence: 0,
        pageNumber: null,
        evidenceQuote: null,
        status: 'Needs Review',
        reviewReason: 'Document lacks readable title page.',
      },
    };
  }

  const text = page1.text;

  // Pattern 1: Multi-line cause title with Appellant/Petitioner ... VERSUS ... Respondent
  // E.g. "Rajesh Kumar Sharma & Ors. ... Appellant(s) VERSUS State of NCT of Delhi ... Respondent(s)"
  const causeTitleRegex = /([A-Za-z0-9\s.,'&()-]{3,100})\s+(?:\.{3,}|_{3,}|\s+)\s*(?:Appellant|Petitioner|Plaintiff|Applicant)(?:s|\(s\))?\s+(?:VERSUS|Vs\.?|V\/s|v\.)\s+([A-Za-z0-9\s.,'&()-]{3,100})\s+(?:\.{3,}|_{3,}|\s+)\s*(?:Respondent|Defendant|Opposite\s+Party)(?:s|\(s\))?/i;
  const match1 = text.match(causeTitleRegex);

  if (match1 && match1.index !== undefined) {
    const rawPet = cleanPartyString(match1[1]);
    const rawResp = cleanPartyString(match1[2]);

    // Use the actual exact cause title passage from page 1 as the quote
    const exactSnippet = extractCleanSentence(text, match1.index, match1[0].length);

    if (rawPet.length > 2 && rawResp.length > 2) {
      return {
        petitioner: {
          value: rawPet,
          confidence: 96,
          pageNumber: 1,
          evidenceQuote: exactSnippet,
          status: 'Verified',
        },
        respondent: {
          value: rawResp,
          confidence: 96,
          pageNumber: 1,
          evidenceQuote: exactSnippet,
          status: 'Verified',
        },
      };
    }
  }

  // Pattern 2: Standard VERSUS / VS delimiter on Cause Title
  // E.g. "Vikramaditya @ Vicky V/s State of Uttar Pradesh" or "A.B.C. VERSUS X.Y.Z."
  const versusRegex = /([A-Za-z0-9\s.,'&()@-]{3,90})\s+(?:VERSUS|Vs\.?|V\/s|v\.)\s+([A-Za-z0-9\s.,'&()@-]{3,90})/i;
  const match2 = text.match(versusRegex);

  if (match2 && match2.index !== undefined) {
    const rawPet = cleanPartyString(match2[1]);
    const rawResp = cleanPartyString(match2[2]);

    // Ensure it didn't capture a procedural phrase
    const isExcluded = /CORAM|JUDGMENT|HON'BLE|APPEAL|PETITION|ORDER/i.test(rawPet);

    if (!isExcluded && rawPet.length > 2 && rawResp.length > 2) {
      const exactSnippet = extractCleanSentence(text, match2.index, match2[0].length);
      return {
        petitioner: {
          value: rawPet,
          confidence: 92,
          pageNumber: 1,
          evidenceQuote: exactSnippet,
          status: 'Verified',
        },
        respondent: {
          value: rawResp,
          confidence: 92,
          pageNumber: 1,
          evidenceQuote: exactSnippet,
          status: 'Verified',
        },
      };
    }
  }

  return {
    petitioner: {
      value: 'Not detected in cause title',
      confidence: 0,
      pageNumber: null,
      evidenceQuote: null,
      status: 'Needs Review',
      reviewReason: 'Unable to locate litigating appellant/petitioner name on title page.',
    },
    respondent: {
      value: 'Not detected in cause title',
      confidence: 0,
      pageNumber: null,
      evidenceQuote: null,
      status: 'Needs Review',
      reviewReason: 'Unable to locate litigating respondent name on title page.',
    },
  };
}

/**
 * Extracts Presiding Bench / Coram / Judges.
 * Searches both header pages (CORAM / BEFORE) and concluding pages (Signature block)
 * so that genuine Supreme Court & High Court judges are accurately identified and marked Verified.
 */
function extractBench(pages: PageContent[]): ExtractedField {
  const frontPages = pages.slice(0, 2);
  const judgesSet = new Set<string>();
  let bestEvidencePage = 1;
  let bestEvidenceQuote = '';

  // 1. Check Header Pages for CORAM / BEFORE / BENCH
  for (const p of frontPages) {
    const coramMatch = p.text.match(/(?:CORAM|BEFORE|BENCH)\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);
    if (coramMatch && coramMatch.index !== undefined) {
      const coramLine = coramMatch[1];
      // Extract judge names after HON'BLE
      const names = coramLine.matchAll(/HON'BLE\s+(?:MR\.|MS\.|SMT\.|DR\.)?\s*JUSTICE\s+([A-Za-z\s.,]+?)(?:,|AND|&|\n|$)/gi);
      for (const m of names) {
        const cleaned = m[1].replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleaned.length > 3 && !/AND|CORAM|BEFORE/i.test(cleaned)) {
          judgesSet.add(`Hon'ble Justice ${cleaned}`);
        }
      }
      if (judgesSet.size === 0) {
        const cleanedLine = coramLine.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
        judgesSet.add(cleanedLine);
      }
      bestEvidencePage = p.pageNumber;
      bestEvidenceQuote = extractCleanSentence(p.text, coramMatch.index, coramMatch[0].length);
      break;
    }
  }

  // 2. Check Header Pages for standalone HON'BLE JUSTICE lines
  if (judgesSet.size === 0) {
    for (const p of frontPages) {
      const matches = p.text.matchAll(/HON'BLE\s+(?:MR\.|MS\.|SMT\.|DR\.)?\s*JUSTICE\s+([A-Za-z\s.,]+?)(?:\n|,|AND|&|$)/gi);
      for (const m of matches) {
        const cleaned = m[1].replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleaned.length > 3 && !/AND|CORAM|BEFORE/i.test(cleaned)) {
          judgesSet.add(`Hon'ble Justice ${cleaned}`);
          if (!bestEvidenceQuote && m.index !== undefined) {
            bestEvidencePage = p.pageNumber;
            bestEvidenceQuote = extractCleanSentence(p.text, m.index, m[0].length);
          }
        }
      }
      if (judgesSet.size > 0) break;
    }
  }

  // 3. Check author line on page 1-2 (e.g., "[SANJAY KISHAN KAUL, J.]" or "SANJAY KISHAN KAUL, J.")
  if (judgesSet.size === 0) {
    for (const p of frontPages) {
      const authorMatch = p.text.match(/\[?\s*([A-Za-z\s.,]+?),\s*(?:CJI|J\.)\s*\]?/);
      if (authorMatch && authorMatch.index !== undefined) {
        const name = authorMatch[1].replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
        if (name.length > 3 && !/JUDGMENT|ORDER|COURT/i.test(name)) {
          judgesSet.add(`Hon'ble Justice ${name}`);
          bestEvidencePage = p.pageNumber;
          bestEvidenceQuote = extractCleanSentence(p.text, authorMatch.index, authorMatch[0].length);
          break;
        }
      }
    }
  }

  // 4. Check concluding pages for signature blocks (Standard Indian Supreme Court ending)
  // E.g. "................................................J. \n (SANJAY KISHAN KAUL)"
  const lastPages = pages.slice(-2);
  for (const p of lastPages) {
    const sigMatches = p.text.matchAll(/(?:\.{3,}|_{3,}|\s+)\s*(?:CJI|J\.)\s*\n?\s*\(\s*([A-Za-z\s.,]+?)\s*\)/g);
    for (const m of sigMatches) {
      const name = m[1].replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (name.length > 3 && !/NEW\s+DELHI|OCTOBER|NOVEMBER|DECEMBER|JANUARY/i.test(name)) {
        judgesSet.add(`Hon'ble Justice ${name}`);
        if (!bestEvidenceQuote && m.index !== undefined) {
          bestEvidencePage = p.pageNumber;
          bestEvidenceQuote = extractCleanSentence(p.text, m.index, m[0].length);
        }
      }
    }
  }

  if (judgesSet.size > 0) {
    const benchStr = Array.from(judgesSet).join(', ');
    const finalQuote = bestEvidenceQuote || `Presiding Coram identified on Page ${bestEvidencePage}`;
    const isValid = validateEvidenceQuote(
      pages.find(p => p.pageNumber === bestEvidencePage)?.text || '', 
      finalQuote
    );

    return {
      value: benchStr,
      confidence: 95,
      pageNumber: bestEvidencePage,
      evidenceQuote: finalQuote,
      status: isValid ? 'Verified' : 'Needs Review',
      reviewReason: isValid ? undefined : 'Bench identified, but verbatim quote requires roster review.',
    };
  }

  return {
    value: 'Presiding Coram not explicitly stated',
    confidence: 0,
    pageNumber: null,
    evidenceQuote: null,
    status: 'Needs Review',
    reviewReason: 'Judge designations omitted from title block and concluding signature lines.',
  };
}

/**
 * Scans pages for statutory provisions cited.
 * Validates that quotes are exact substrings of the corresponding page text.
 */
function extractActsAndSections(pages: PageContent[]): CitedSection[] {
  const cited: CitedSection[] = [];
  const seenKeys = new Set<string>();

  // 1. Curated statutory knowledge base
  for (const item of STATUTORY_KNOWLEDGE_BASE) {
    for (const p of pages) {
      const match = p.text.match(item.regex);
      if (match && match.index !== undefined) {
        const key = `${item.act}-${item.section}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          const cleanQuote = extractCleanSentence(p.text, match.index, match[0].length);
          const isValid = validateEvidenceQuote(p.text, cleanQuote);

          cited.push({
            act: item.act,
            section: item.section,
            description: item.description,
            pageNumber: p.pageNumber,
            quote: cleanQuote,
            confidence: 96,
            status: isValid ? 'Verified' : 'Needs Review',
          });
        }
      }
    }
  }

  // 2. Generic section detection (e.g. Section 11 of Arbitration Act, Order 39 of CPC)
  for (const p of pages) {
    const secMatches = p.text.matchAll(/(?:Section|Sec\.?|Article|Art\.?)\s*([0-9]+[A-Z]?)\s*(?:of\s+the\s+)?([A-Za-z\s]{4,40}Act(?:,\s*[0-9]{4})?)/gi);
    for (const match of secMatches) {
      if (match.index !== undefined && cited.length < 8) {
        const secNum = match[1];
        const actTitle = match[2].trim();
        const key = `${actTitle}-Sec${secNum}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          const cleanQuote = extractCleanSentence(p.text, match.index, match[0].length);
          const isValid = validateEvidenceQuote(p.text, cleanQuote);

          cited.push({
            act: actTitle,
            section: `Section ${secNum}`,
            description: `Statutory section cited in the body of the court judgment.`,
            pageNumber: p.pageNumber,
            quote: cleanQuote,
            confidence: 88,
            status: isValid ? 'Verified' : 'Needs Review',
          });
        }
      }
    }
  }

  return cited;
}

/**
 * Robust extraction of the Final Operative Disposition / Outcome.
 * Solves:
 * 1. Checks concluding pages first (last 2-3 pages) to avoid earlier historical references.
 * 2. Extracts complete, clean sentences without dotted gaps, judge names, or cut-offs.
 * 3. Distinguishes Final Judgments from Interim/Procedural Orders.
 * 4. Verifies exact substring match against page text.
 */
function extractFinalOutcome(pages: PageContent[]): ExtractedOutcome {
  if (pages.length === 0) {
    return {
      disposition: 'Needs Review',
      verdictText: 'Document contains no readable pages.',
      pageNumber: 1,
      evidenceQuote: '',
      confidence: 0,
      status: 'Needs Review',
      orderType: 'Indeterminate',
      reviewReason: 'No pages available for outcome analysis.',
    };
  }

  // Focus on the concluding pages (last 2 pages) where operative orders reside in Indian judgments
  const concludingPages = pages.length > 2 ? pages.slice(-2) : pages;

  interface OutcomeRule {
    disposition: ExtractedOutcome['disposition'];
    regex: RegExp;
    confidence: number;
    orderType: OrderClassification;
  }

  const operativeRules: OutcomeRule[] = [
    // Appeal Allowed
    {
      disposition: 'Appeal Allowed',
      regex: /(?:In\s+the\s+result|Consequently|Accordingly|For\s+the\s+reasons\s+(?:aforesaid|stated|above)|In\s+view\s+of\s+the\s+above)[^.]{0,80}?(?:the\s+)?appeal\s+(?:is|stands)\s+(?:hereby\s+)?allowed\b|(?:the\s+)?appeal\s+(?:is|stands)\s+(?:hereby\s+)?allowed\b|conviction\s+is\s+(?:hereby\s+)?(?:quashed\s+and\s+)?set\s+aside\b/i,
      confidence: 96,
      orderType: 'Final Judgment',
    },
    // Appeal Dismissed
    {
      disposition: 'Appeal Dismissed',
      regex: /(?:In\s+the\s+result|Consequently|Accordingly|For\s+the\s+reasons\s+(?:aforesaid|stated|above)|In\s+view\s+of\s+the\s+above)[^.]{0,80}?(?:the\s+)?appeal\s+(?:is|stands)\s+(?:hereby\s+)?dismissed\b|(?:the\s+)?appeal\s+(?:is|stands)\s+(?:hereby\s+)?dismissed\b|conviction\s+is\s+(?:hereby\s+)?upheld\b/i,
      confidence: 96,
      orderType: 'Final Judgment',
    },
    // Bail Granted
    {
      disposition: 'Bail Granted',
      regex: /(?:applicant|appellant|accused)\s+(?:is|shall\s+be)\s+released\s+on\s+bail\b|(?:the\s+)?application\s+for\s+bail\s+is\s+(?:hereby\s+)?allowed\b|bail\s+is\s+granted\b/i,
      confidence: 96,
      orderType: 'Final Judgment',
    },
    // Bail Rejected
    {
      disposition: 'Bail Rejected',
      regex: /(?:application\s+for\s+bail|plea\s+for\s+bail|bail\s+application)\s+(?:is|stands)\s+(?:hereby\s+)?(?:rejected|dismissed)\b/i,
      confidence: 96,
      orderType: 'Final Judgment',
    },
    // Petition Allowed
    {
      disposition: 'Petition Allowed',
      regex: /(?:the\s+)?(?:writ\s+)?petition\s+(?:is|stands)\s+(?:hereby\s+)?allowed\b|rule\s+is\s+made\s+absolute\b/i,
      confidence: 94,
      orderType: 'Final Judgment',
    },
    // Petition Dismissed
    {
      disposition: 'Petition Dismissed',
      regex: /(?:the\s+)?(?:writ\s+)?petition\s+(?:is|stands)\s+(?:hereby\s+)?dismissed\b|(?:Special\s+Leave\s+Petition|SLP)\s+is\s+dismissed\b/i,
      confidence: 95,
      orderType: 'Final Judgment',
    },
    // Acquitted
    {
      disposition: 'Acquitted',
      regex: /(?:appellant|accused)\s+(?:is|are)\s+acquitted\s+of\s+all\s+charges\b|(?:appellant|accused)\s+stands\s+acquitted\b/i,
      confidence: 96,
      orderType: 'Final Judgment',
    },
    // Remanded
    {
      disposition: 'Remanded',
      regex: /matter\s+is\s+remanded\s+back\b|(?:matter|case)\s+is\s+remitted\s+to\s+the\s+(?:High\s+Court|trial\s+court)\b/i,
      confidence: 94,
      orderType: 'Final Judgment',
    },
    // Order Modified
    {
      disposition: 'Order Modified',
      regex: /impugned\s+order\s+is\s+modified\b|partly\s+allowed\b/i,
      confidence: 92,
      orderType: 'Final Judgment',
    },
    // Disposed of / Withdrawn / Infructuous
    {
      disposition: 'Disposed of',
      regex: /(?:petition|appeal)\s+(?:stands|is)\s+disposed\s+of\b|dismissed\s+as\s+withdrawn\b|disposed\s+of\s+as\s+infructuous\b/i,
      confidence: 92,
      orderType: 'Final Judgment',
    },
    // Interim / Procedural Order
    {
      disposition: 'Interim Order / Stay Granted',
      regex: /(?:interim\s+stay|interim\s+protection|no\s+coercive\s+steps|list\s+on\s+[0-9]{2}|arguments\s+heard\s+in\s+part|issue\s+notice)\b/i,
      confidence: 88,
      orderType: 'Interim / Procedural Order',
    },
  ];

  // 1. Scan concluding pages in reverse (last page first)
  for (let i = concludingPages.length - 1; i >= 0; i--) {
    const p = concludingPages[i];
    for (const rule of operativeRules) {
      const match = p.text.match(rule.regex);
      if (match && match.index !== undefined) {
        const sentence = extractCleanSentence(p.text, match.index, match[0].length);
        const isSubstring = validateEvidenceQuote(p.text, sentence);

        if (isSubstring) {
          const isInterim = rule.orderType === 'Interim / Procedural Order';
          return {
            disposition: rule.disposition,
            verdictText: sentence,
            pageNumber: p.pageNumber,
            evidenceQuote: sentence,
            confidence: rule.confidence,
            status: isInterim ? 'Needs Review' : 'Verified',
            orderType: rule.orderType,
            reviewReason: isInterim 
              ? 'Document identified as an Interim / Procedural Order rather than a final disposal.' 
              : undefined,
          };
        }
      }
    }
  }

  // 2. If not found in last 2 pages, check whole document carefully
  for (let i = pages.length - 1; i >= 0; i--) {
    const p = pages[i];
    for (const rule of operativeRules) {
      const match = p.text.match(rule.regex);
      if (match && match.index !== undefined) {
        const sentence = extractCleanSentence(p.text, match.index, match[0].length);
        if (validateEvidenceQuote(p.text, sentence)) {
          return {
            disposition: rule.disposition,
            verdictText: sentence,
            pageNumber: p.pageNumber,
            evidenceQuote: sentence,
            confidence: 75,
            status: 'Needs Review',
            orderType: rule.orderType,
            reviewReason: 'Operative ruling located outside customary concluding paragraphs. Verification required to ensure it is not discussing a lower court decision.',
          };
        }
      }
    }
  }

  // 3. Ambiguous / Unstated
  const lastPage = pages[pages.length - 1];
  const fallbackQuote = lastPage ? lastPage.text.slice(-180).trim() : 'No text available';

  return {
    disposition: 'Needs Review',
    verdictText: 'Operative disposition could not be unambiguously verified from document text.',
    pageNumber: lastPage?.pageNumber || 1,
    evidenceQuote: fallbackQuote,
    confidence: 30,
    status: 'Needs Review',
    orderType: 'Indeterminate',
    reviewReason: 'Operative order lacks explicit final disposal keywords (Allowed/Dismissed/Disposed). Requires manual legal inspection.',
  };
}

/**
 * Executive case brief summary
 */
function generateCaseSummary(
  court: string,
  caseType: string,
  petitioner: string,
  respondent: string,
  outcome: ExtractedOutcome,
  acts: CitedSection[]
): string {
  const sectionsList = acts.length > 0 
    ? acts.map(a => `${a.section} (${a.act})`).join(', ') 
    : 'General statutory provisions';
  return `This matter before the ${court} involves a ${caseType} between ${petitioner} and ${respondent}. Key statutory provisions deliberated include ${sectionsList}. The Court rendered the operative ruling: "${outcome.disposition}" (${outcome.orderType}).`;
}

/**
 * Classifies the priority of a case based on:
 * - Cited statutory sections (IPC 302, 376, etc. → High)
 * - Case type keywords
 * - Raw text indicators (deadlines, urgency, etc.)
 * Returns a PriorityClassification with a transparent reason string.
 */
function classifyPriority(
  rawText: string,
  caseType: string,
  actsAndSections: CitedSection[]
): PriorityClassification {
  const sectionKeys = actsAndSections.map(s => `${s.section} ${s.act}`.toLowerCase());
  const textLower = rawText.toLowerCase();
  const caseTypeLower = caseType.toLowerCase();

  // Helper: check if any listed pattern appears in text
  const textHas = (...terms: string[]) => terms.some(t => textLower.includes(t));
  const caseIs = (...terms: string[]) => terms.some(t => caseTypeLower.includes(t));
  const sectionHas = (...terms: string[]) => terms.some(t => sectionKeys.some(k => k.includes(t)));

  // ─── HIGH PRIORITY ────────────────────────────────────────────────────────
  // Murder / Homicide
  if (
    sectionHas('section 302', 'section 304') ||
    textHas('murder', 'homicide', 'culpable homicide', 'killed', 'killing') ||
    caseIs('murder')
  ) {
    const secs = actsAndSections
      .filter(s => /302|304/.test(s.section))
      .map(s => `${s.section} (${s.act})`);
    return {
      priority: 'High',
      category: 'Murder / Homicide',
      reason: 'Case involves charges of murder or culpable homicide under IPC. Such matters carry capital or life-imprisonment stakes and are classified as High Priority.',
      basedOnSections: secs.length ? secs : ['IPC 302 / 304 (inferred from text)'],
    };
  }

  // Rape / Serious Sexual Offence
  if (
    sectionHas('section 376', 'section 354', 'section 509', 'pocso') ||
    textHas('rape', 'sexual assault', 'sexual offence', 'pocso', 'molestation')
  ) {
    const secs = actsAndSections
      .filter(s => /376|354|509/i.test(s.section) || /pocso/i.test(s.act))
      .map(s => `${s.section} (${s.act})`);
    return {
      priority: 'High',
      category: 'Rape / Serious Sexual Offence',
      reason: 'Case involves sexual assault or a serious sexual offence under IPC / POCSO. These matters are classified as High Priority due to severity and victim protection concerns.',
      basedOnSections: secs.length ? secs : ['IPC 376 / POCSO (inferred from text)'],
    };
  }

  // Serious Violent Crime (attempt to murder, dacoity, kidnapping, terrorism)
  if (
    sectionHas('section 307', 'section 395', 'section 364', 'section 392', 'uapa', 'ndps') ||
    textHas('attempt to murder', 'dacoity', 'robbery', 'kidnapping', 'terrorism', 'ndps', 'narcotics', 'uapa')
  ) {
    const secs = actsAndSections
      .filter(s => /307|395|364|392/i.test(s.section) || /uapa|ndps/i.test(s.act))
      .map(s => `${s.section} (${s.act})`);
    return {
      priority: 'High',
      category: 'Serious Violent / Organised Crime',
      reason: 'Document cites provisions relating to serious violent crime, dacoity, kidnapping, or narcotics — matters with significant public-safety implications.',
      basedOnSections: secs.length ? secs : ['Serious IPC / Special-Law provisions (inferred from text)'],
    };
  }

  // Other criminal matters with immediate liberty implications (bail, custody)
  const isCriminalBail = caseIs('criminal appeal', 'bail application', 'special leave petition (crl)') ||
    textHas('custody', 'detention', 'bail application', 'anticipatory bail', 'habeas corpus');

  if (isCriminalBail && sectionHas('section 302', 'section 376', 'section 307', 'section 395', 'section 364')) {
    return {
      priority: 'High',
      category: 'Criminal Liberty Matter (Serious Offence)',
      reason: 'Criminal case involving bail or liberty on a serious charge. High Priority due to personal liberty and public-safety considerations.',
      basedOnSections: actsAndSections.filter(s => /302|376|307|395|364/i.test(s.section)).map(s => `${s.section} (${s.act})`),
    };
  }

  // Imminent deadline / urgent enforcement detected in text
  if (textHas('within 24 hours', 'within 48 hours', 'forthwith', 'immediately release', 'urgent', 'emergency')) {
    return {
      priority: 'High',
      category: 'Urgent / Imminent Deadline',
      reason: 'Document contains explicit urgency language (e.g., "within 24/48 hours", "forthwith", "urgent"). Classified as High Priority.',
      basedOnSections: [],
    };
  }

  // ─── MEDIUM PRIORITY ──────────────────────────────────────────────────────
  // General criminal matters without life-threatening charges
  if (
    caseIs('criminal appeal', 'bail application', 'special leave petition (crl)', 'writ petition (criminal)') ||
    sectionHas('section 498a', 'section 420', 'section 120b', 'section 406') ||
    textHas('cheating', 'criminal conspiracy', 'fraud', 'dowry harassment', 'cruelty', 'abetment')
  ) {
    const secs = actsAndSections
      .filter(s => /498a|420|120b|406/i.test(s.section))
      .map(s => `${s.section} (${s.act})`);
    return {
      priority: 'Medium',
      category: 'Criminal Matter (Non-violent)',
      reason: 'Case involves criminal charges of a non-violent or economic nature (e.g., cheating, dowry harassment, criminal breach of trust).',
      basedOnSections: secs,
    };
  }

  // Constitutional / Fundamental Rights writ matters
  if (
    sectionHas('article 226', 'article 32', 'article 21') ||
    textHas('fundamental right', 'writ of mandamus', 'writ of certiorari', 'writ of prohibition', 'public interest')
  ) {
    const secs = actsAndSections
      .filter(s => /article 226|article 32|article 21/i.test(s.section))
      .map(s => `${s.section} (${s.act})`);
    return {
      priority: 'Medium',
      category: 'Constitutional / Writ Matter',
      reason: 'Matter involves enforcement of constitutional or fundamental rights under Article 21, 32, or 226. Classified Medium unless additional urgency is detected.',
      basedOnSections: secs,
    };
  }

  // Significant commercial / arbitration dispute
  if (
    sectionHas('section 34', 'section 9', 'section 37') && textHas('arbitrat') ||
    textHas('commercial dispute', 'arbitration award', 'specific performance', 'injunction') ||
    caseIs('arbitration petition')
  ) {
    const secs = actsAndSections
      .filter(s => /arbitration/i.test(s.act))
      .map(s => `${s.section} (${s.act})`);
    return {
      priority: 'Medium',
      category: 'Commercial / Arbitration Dispute',
      reason: 'Matter relates to a significant commercial dispute or challenge to an arbitration award.',
      basedOnSections: secs,
    };
  }

  // ─── LOW PRIORITY ─────────────────────────────────────────────────────────
  // Cheque dishonour (NI Act 138) — routine, high volume
  if (
    sectionHas('section 138', 'section 141', 'section 139') ||
    textHas('cheque dishonour', 'dishonour of cheque', 'negotiable instruments')
  ) {
    const secs = actsAndSections
      .filter(s => /138|141|139/i.test(s.section) && /negotiable instruments/i.test(s.act))
      .map(s => `${s.section} (${s.act})`);
    return {
      priority: 'Low',
      category: 'Cheque Dishonour (NI Act)',
      reason: 'Case concerns dishonour of cheque under NI Act — a routine, high-volume civil-criminal matter without urgent liberty implications.',
      basedOnSections: secs,
    };
  }

  // Routine civil / family dispute
  if (
    caseIs('civil appeal', 'writ petition (civil)') &&
    textHas('property', 'succession', 'inheritance', 'partition', 'divorce', 'maintenance', 'custody', 'matrimonial')
  ) {
    return {
      priority: 'Low',
      category: 'Routine Civil / Family Dispute',
      reason: 'Matter appears to be a routine civil or family dispute (property, succession, matrimonial) without indicators of urgency or criminal liability.',
      basedOnSections: [],
    };
  }

  // Minor theft / routine property offence
  if (
    sectionHas('section 379', 'section 380') ||
    textHas('petty theft', 'minor theft')
  ) {
    const secs = actsAndSections
      .filter(s => /379|380/i.test(s.section))
      .map(s => `${s.section} (${s.act})`);
    return {
      priority: 'Low',
      category: 'Minor Theft / Property Offence',
      reason: 'Case involves minor theft or property offence without aggravating factors. Classified as Low Priority.',
      basedOnSections: secs,
    };
  }

  // ─── UNDETERMINED ─────────────────────────────────────────────────────────
  return {
    priority: 'Undetermined',
    category: 'Unclassified',
    reason: 'Insufficient statutory or contextual information was detected in the document to assign an automated priority. Manual review by a legal professional is required.',
    basedOnSections: [],
  };
}

/**
 * Main analysis function that parses document pages into a structured CourtJudgment.
 */
export function analyzeJudgmentText(
  fileName: string,
  fileSize: number,
  pages: PageContent[],
  rawText: string,
  hasExtractableText: boolean = true,
  ocrNotice?: string
): CourtJudgment {
  // If no extractable text or scanned PDF, do not fabricate fields!
  if (!hasExtractableText) {
    const emptyField = (reason: string): ExtractedField => ({
      value: 'Not extractable (OCR Required)',
      confidence: 0,
      pageNumber: null,
      evidenceQuote: null,
      status: 'Needs Review',
      reviewReason: reason,
    });

    return {
      id: `cv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fileName,
      fileSize,
      analyzedAt: new Date().toISOString(),
      pageCount: pages.length,
      rawText: '',
      pages,
      hasExtractableText: false,
      ocrNotice: ocrNotice || 'Scanned or image-only PDF. Digital text layer missing.',
      extractedData: {
        courtName: emptyField('Scanned document lacks digital text.'),
        caseType: emptyField('Scanned document lacks digital text.'),
        caseNumber: emptyField('Scanned document lacks digital text.'),
        year: emptyField('Scanned document lacks digital text.'),
        bench: emptyField('Scanned document lacks digital text.'),
        petitioner: emptyField('Scanned document lacks digital text.'),
        respondent: emptyField('Scanned document lacks digital text.'),
        actsAndSections: [],
        finalOutcome: {
          disposition: 'Needs Review',
          verdictText: 'Text unreadable without OCR.',
          pageNumber: 1,
          evidenceQuote: '',
          confidence: 0,
          status: 'Needs Review',
          orderType: 'Indeterminate',
          reviewReason: 'Cannot determine outcome from image-only document.',
        },
        summary: 'Document could not be analyzed because it lacks a digital text layer. OCR processing is required.',
        keyIssues: ['OCR Required'],
        operativeOrderText: '',
        orderType: 'Indeterminate',
      },
      overallStatus: 'Needs Review',
      confidenceScore: 0,
      authoritativeSourceChecked: false,
      priorityClassification: {
        priority: 'Undetermined',
        category: 'Unclassified',
        reason: 'Document is a scanned / image-only PDF. Text extraction is not possible without OCR, so automated priority classification cannot be performed.',
        basedOnSections: [],
      },
      notes: 'Scanned or image-only PDF detected.',
    };
  }

  // Extract facts with clean sentence bounds and verification
  const courtName = extractCourtName(pages);
  const { caseType, caseNumber, year } = extractCaseDetails(pages);
  const { petitioner, respondent } = extractParties(pages);
  const bench = extractBench(pages);
  const actsAndSections = extractActsAndSections(pages);
  const finalOutcome = extractFinalOutcome(pages);
  const priorityClassification = classifyPriority(rawText, caseType.value, actsAndSections);

  // Overall status rule:
  // All essential fields MUST be Verified for the document to be Verified.
  const essentialFields = [courtName, caseNumber, petitioner, respondent];
  const allEssentialsVerified = essentialFields.every(f => f.status === 'Verified') && finalOutcome.status === 'Verified';
  const overallStatus: VerificationStatus = allEssentialsVerified ? 'Verified' : 'Needs Review';

  // Honest confidence score
  const allFields = [courtName, caseType, caseNumber, bench, petitioner, respondent];
  const avgFields = allFields.reduce((acc, f) => acc + f.confidence, 0) / allFields.length;
  const confidenceScore = Math.round((avgFields * 0.6) + (finalOutcome.confidence * 0.4));

  const lastPage = pages[pages.length - 1];
  const operativeOrderText = finalOutcome.verdictText || (lastPage ? lastPage.text.slice(-300).trim() : '');

  const summary = generateCaseSummary(
    courtName.value,
    caseType.value,
    petitioner.value,
    respondent.value,
    finalOutcome,
    actsAndSections
  );

  return {
    id: `cv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fileName,
    fileSize,
    analyzedAt: new Date().toISOString(),
    pageCount: pages.length,
    rawText,
    pages,
    hasExtractableText: true,
    extractedData: {
      courtName,
      caseType,
      caseNumber,
      year,
      bench,
      petitioner,
      respondent,
      actsAndSections,
      finalOutcome,
      summary,
      keyIssues: [
        `Evaluation of statutory provisions (${actsAndSections[0]?.section || 'invoked Acts'})`,
        `Scrutiny of evidence and findings of lower forum`,
        `Determination of final operative disposition (${finalOutcome.disposition})`,
      ],
      operativeOrderText,
      orderType: finalOutcome.orderType,
    },
    overallStatus,
    confidenceScore,
    authoritativeSourceChecked: false,
    priorityClassification,
    notes: 'Parsed via CaseVeda AI Evidence-Linked Extraction Engine.',
  };
}
