import { CourtJudgment } from '../types';

export const SAMPLE_JUDGMENTS: CourtJudgment[] = [
  {
    id: 'sample-sc-criminal-appeal-2023',
    fileName: 'SupremeCourt_CrlApp_784_2023_RajeshKumar.pdf',
    fileSize: 482100,
    analyzedAt: '2026-10-09T14:32:00.000Z',
    pageCount: 14,
    hasExtractableText: true,
    isDemo: true,
    rawText: `IN THE SUPREME COURT OF INDIA\nCRIMINAL APPELLATE JURISDICTION\nCRIMINAL APPEAL NO. 784 OF 2023...`,
    pages: [
      {
        pageNumber: 1,
        text: `IN THE SUPREME COURT OF INDIA
CRIMINAL APPELLATE JURISDICTION
CRIMINAL APPEAL NO. 784 OF 2023
(Arising out of SLP (Crl.) No. 2419 of 2022)

Rajesh Kumar Sharma & Ors. ... Appellant(s)
VERSUS
State of NCT of Delhi ... Respondent(s)

CORAM:
HON'BLE MR. JUSTICE SANJAY KISHAN KAUL
HON'BLE MR. JUSTICE ABHAY S. OKA

JUDGMENT
SANJAY KISHAN KAUL, J.`
      },
      {
        pageNumber: 2,
        text: `1. Leave granted. The present appeal arises out of the impugned judgment and order passed by the High Court of Delhi upholding the conviction of the appellants under Section 302 read with Section 34 of the Indian Penal Code, 1860 (IPC).

2. The prosecution case, in brief, is that on 14th August 2017, an FIR was registered under Section 154 of the Code of Criminal Procedure, 1973 (CrPC) at Police Station Karol Bagh alleging that the appellants assaulted the deceased following a property dispute.`
      },
      {
        pageNumber: 4,
        text: `5. We have heard Mr. R. Basant, learned Senior Counsel appearing for the appellants, and Mr. Vikramjit Banerjee, learned Additional Solicitor General appearing for the respondent State.

6. The primary contention urged on behalf of the appellants is that the entire case of the prosecution rests upon circumstantial evidence, and the chain of circumstances is incomplete. Neither the recovery under Section 27 of the Evidence Act nor the testimony of PW-3 inspires confidence.`
      },
      {
        pageNumber: 7,
        text: `12. In a case resting on circumstantial evidence, each link in the evidentiary chain must be firmly established beyond reasonable doubt. Reference may be made to the landmark principles laid down by this Court in Sharad Birdhichand Sarda v. State of Maharashtra.

13. In the present case, the trial court and the High Court failed to appreciate that the medical evidence does not corroborate the ocular narrative. Furthermore, the statements recorded under Section 313 of the Code of Criminal Procedure, 1973 were not evaluated in accordance with law.`
      },
      {
        pageNumber: 13,
        text: `24. Having scrutinized the oral testimonies and forensic exhibits, we are of the considered opinion that the prosecution has singularly failed to establish the guilt of the appellants beyond reasonable doubt. The benefit of doubt must inevitably accrue in favour of the accused.`
      },
      {
        pageNumber: 14,
        text: `25. In the result, the appeal is allowed. The impugned judgment and order of conviction passed by the High Court of Delhi under Section 302 read with Section 34 of the Indian Penal Code, 1860 is hereby quashed and set aside.

26. The appellants are acquitted of all charges. The bail bonds stand discharged and the appellants shall be released forthwith if not required in connection with any other case.

................................................J.
(SANJAY KISHAN KAUL)

................................................J.
(ABHAY S. OKA)
NEW DELHI;
OCTOBER 09, 2023.`
      }
    ],
    extractedData: {
      courtName: {
        value: 'Supreme Court of India',
        confidence: 98,
        pageNumber: 1,
        evidenceQuote: 'IN THE SUPREME COURT OF INDIA',
        status: 'Verified',
      },
      caseType: {
        value: 'Criminal Appeal',
        confidence: 96,
        pageNumber: 1,
        evidenceQuote: 'CRIMINAL APPEAL NO. 784 OF 2023',
        status: 'Verified',
      },
      caseNumber: {
        value: 'Criminal Appeal No. 784 of 2023',
        confidence: 96,
        pageNumber: 1,
        evidenceQuote: 'CRIMINAL APPEAL NO. 784 OF 2023',
        status: 'Verified',
      },
      year: {
        value: '2023',
        confidence: 98,
        pageNumber: 1,
        evidenceQuote: 'CRIMINAL APPEAL NO. 784 OF 2023',
        status: 'Verified',
      },
      bench: {
        value: "Hon'ble Justice SANJAY KISHAN KAUL, Hon'ble Justice ABHAY S. OKA",
        confidence: 95,
        pageNumber: 1,
        evidenceQuote: "HON'BLE MR. JUSTICE SANJAY KISHAN KAUL\nHON'BLE MR. JUSTICE ABHAY S. OKA",
        status: 'Verified',
      },
      petitioner: {
        value: 'Rajesh Kumar Sharma & Ors.',
        confidence: 96,
        pageNumber: 1,
        evidenceQuote: 'Rajesh Kumar Sharma & Ors. ... Appellant(s)',
        status: 'Verified',
      },
      respondent: {
        value: 'State of NCT of Delhi',
        confidence: 96,
        pageNumber: 1,
        evidenceQuote: 'State of NCT of Delhi ... Respondent(s)',
        status: 'Verified',
      },
      actsAndSections: [
        {
          act: 'Indian Penal Code, 1860',
          section: 'Section 302',
          description: 'Punishment for murder (Capital punishment or life imprisonment and fine).',
          pageNumber: 2,
          quote: 'upholding the conviction of the appellants under Section 302 read with Section 34 of the Indian Penal Code, 1860 (IPC).',
          confidence: 98,
          status: 'Verified',
        },
        {
          act: 'Indian Penal Code, 1860',
          section: 'Section 34',
          description: 'Acts done by several persons in furtherance of common intention.',
          pageNumber: 2,
          quote: 'upholding the conviction of the appellants under Section 302 read with Section 34 of the Indian Penal Code, 1860 (IPC).',
          confidence: 96,
          status: 'Verified',
        },
        {
          act: 'Code of Criminal Procedure, 1973',
          section: 'Section 154',
          description: 'Information in cognizable cases (First Information Report - FIR).',
          pageNumber: 2,
          quote: 'an FIR was registered under Section 154 of the Code of Criminal Procedure, 1973 (CrPC) at Police Station Karol Bagh',
          confidence: 95,
          status: 'Verified',
        },
        {
          act: 'Code of Criminal Procedure, 1973',
          section: 'Section 313',
          description: 'Power to examine the accused personally in trial.',
          pageNumber: 7,
          quote: 'statements recorded under Section 313 of the Code of Criminal Procedure, 1973 were not evaluated in accordance with law.',
          confidence: 92,
          status: 'Verified',
        },
      ],
      finalOutcome: {
        disposition: 'Appeal Allowed',
        verdictText: 'In the result, the appeal is allowed. The impugned judgment and order of conviction passed by the High Court of Delhi under Section 302 read with Section 34 of the Indian Penal Code, 1860 is hereby quashed and set aside.',
        pageNumber: 14,
        evidenceQuote: 'In the result, the appeal is allowed. The impugned judgment and order of conviction passed by the High Court of Delhi under Section 302 read with Section 34 of the Indian Penal Code, 1860 is hereby quashed and set aside.',
        confidence: 98,
        status: 'Verified',
        orderType: 'Final Judgment',
      },
      summary: 'Supreme Court Criminal Appeal concerning conviction under IPC Section 302/34. The Supreme Court held that the prosecution failed to establish the unbroken chain of circumstantial evidence beyond reasonable doubt, allowed the appeal, and acquitted all appellants.',
      keyIssues: [
        'Sufficiency of circumstantial evidence in IPC 302 prosecution',
        'Validity of Section 27 recovery and non-examination of independent witnesses',
        'Failure to properly evaluate accused explanations under CrPC 313',
      ],
      operativeOrderText: 'Appeal is allowed. Conviction quashed and set aside. Appellants acquitted.',
      orderType: 'Final Judgment',
    },
    overallStatus: 'Verified',
    confidenceScore: 96,
    authoritativeSourceChecked: false,
    notes: 'Demonstration Benchmark Landmark Judgment (Supreme Court of India).',
  },
  {
    id: 'sample-delhi-hc-arbitration-2024',
    fileName: 'DelhiHC_ArbPet_412_2024_MetroInfra.pdf',
    fileSize: 312500,
    analyzedAt: '2026-10-10T11:15:00.000Z',
    pageCount: 18,
    hasExtractableText: true,
    isDemo: true,
    rawText: `IN THE HIGH COURT OF DELHI AT NEW DELHI\nO.M.P. (COMM) 412/2024...`,
    pages: [
      {
        pageNumber: 1,
        text: `IN THE HIGH COURT OF DELHI AT NEW DELHI
(COMMERCIAL DIVISION)
O.M.P. (COMM) 412/2024 & I.A. 8920/2024

Metro Infra Engineering Ltd. ... Petitioner
VERSUS
Union of India, Ministry of Railways ... Respondent

CORAM:
HON'BLE MR. JUSTICE PRATEEK JALAN

JUDGMENT
PRATEEK JALAN, J.`
      },
      {
        pageNumber: 3,
        text: `1. The present petition under Section 34 of the Arbitration and Conciliation Act, 1996 has been filed seeking setting aside of the unanimous Arbitral Award dated 12.01.2024 passed by the Arbitral Tribunal.

2. The dispute arises from an EPC Contract for construction of railway over-bridges. The petitioner claims damages for prolongation and escalation under Clause 64 of the General Conditions of Contract.`
      },
      {
        pageNumber: 8,
        text: `9. It is well settled by the Hon'ble Supreme Court in Ssangyong Engineering & Construction Co. Ltd. v. NHAI that the scope of judicial interference under Section 34 of the Arbitration and Conciliation Act, 1996 is extremely circumscribed. The Court does not sit in appeal over the factual determinations of the Arbitrator.`
      },
      {
        pageNumber: 18,
        text: `28. For the reasons stated above, this Court finds no patent illegality or violation of fundamental policy of Indian law in the impugned Arbitral Award.

29. Consequently, the petition is dismissed with no order as to costs. All pending applications stand disposed of.

PRATEEK JALAN, J.
OCTOBER 10, 2024.`
      }
    ],
    extractedData: {
      courtName: {
        value: 'High Court of Delhi',
        confidence: 97,
        pageNumber: 1,
        evidenceQuote: 'IN THE HIGH COURT OF DELHI AT NEW DELHI',
        status: 'Verified',
      },
      caseType: {
        value: 'Arbitration Petition',
        confidence: 94,
        pageNumber: 1,
        evidenceQuote: 'O.M.P. (COMM) 412/2024',
        status: 'Verified',
      },
      caseNumber: {
        value: 'O.M.P. (COMM) 412/2024',
        confidence: 95,
        pageNumber: 1,
        evidenceQuote: 'O.M.P. (COMM) 412/2024',
        status: 'Verified',
      },
      year: {
        value: '2024',
        confidence: 96,
        pageNumber: 1,
        evidenceQuote: 'O.M.P. (COMM) 412/2024',
        status: 'Verified',
      },
      bench: {
        value: "Hon'ble Justice PRATEEK JALAN",
        confidence: 95,
        pageNumber: 1,
        evidenceQuote: "HON'BLE MR. JUSTICE PRATEEK JALAN",
        status: 'Verified',
      },
      petitioner: {
        value: 'Metro Infra Engineering Ltd.',
        confidence: 95,
        pageNumber: 1,
        evidenceQuote: 'Metro Infra Engineering Ltd. ... Petitioner',
        status: 'Verified',
      },
      respondent: {
        value: 'Union of India, Ministry of Railways',
        confidence: 95,
        pageNumber: 1,
        evidenceQuote: 'Union of India, Ministry of Railways ... Respondent',
        status: 'Verified',
      },
      actsAndSections: [
        {
          act: 'Arbitration and Conciliation Act, 1996',
          section: 'Section 34',
          description: 'Application for setting aside arbitral award on grounds of patent illegality or public policy.',
          pageNumber: 3,
          quote: 'The present petition under Section 34 of the Arbitration and Conciliation Act, 1996 has been filed seeking setting aside of the unanimous Arbitral Award',
          confidence: 98,
          status: 'Verified',
        },
      ],
      finalOutcome: {
        disposition: 'Petition Dismissed',
        verdictText: 'Consequently, the petition is dismissed with no order as to costs. All pending applications stand disposed of.',
        pageNumber: 18,
        evidenceQuote: 'Consequently, the petition is dismissed with no order as to costs. All pending applications stand disposed of.',
        confidence: 96,
        status: 'Verified',
        orderType: 'Final Judgment',
      },
      summary: 'Delhi High Court commercial challenge under Section 34 of the Arbitration Act. The Court held that the arbitral award did not suffer from patent illegality or perversity, refusing to reassess factual findings and dismissed the petition.',
      keyIssues: [
        'Limits of Section 34 intervention under Arbitration and Conciliation Act, 1996',
        'Contractual interpretation of escalation clauses and prolongation costs',
        'Standard of patent illegality post-2015 amendments',
      ],
      operativeOrderText: 'Petition under Section 34 dismissed. Award upheld.',
      orderType: 'Final Judgment',
    },
    overallStatus: 'Verified',
    confidenceScore: 95,
    authoritativeSourceChecked: false,
    notes: 'Commercial division arbitration petition ruling.',
  },
  {
    id: 'sample-tampered-mismatch-doc',
    fileName: 'Tampered_Subject_SupremeCourt_CrlApp_784.pdf',
    fileSize: 483900,
    analyzedAt: '2026-10-11T09:20:00.000Z',
    pageCount: 14,
    hasExtractableText: true,
    isDemo: true,
    rawText: `IN THE SUPREME COURT OF INDIA\nCRIMINAL APPEAL NO. 784 OF 2023...`,
    pages: [
      {
        pageNumber: 1,
        text: `IN THE SUPREME COURT OF INDIA
CRIMINAL APPELLATE JURISDICTION
CRIMINAL APPEAL NO. 784 OF 2023

Rajesh Kumar Sharma & Ors. ... Appellant(s)
VERSUS
State of NCT of Delhi ... Respondent(s)

CORAM:
HON'BLE MR. JUSTICE SANJAY KISHAN KAUL
HON'BLE MR. JUSTICE ABHAY S. OKA`
      },
      {
        pageNumber: 14,
        text: `25. In the result, the appeal is dismissed. The impugned judgment and order of conviction passed by the High Court of Delhi under Section 302 of the Indian Penal Code, 1860 is hereby upheld and confirmed.

26. The appellants shall surrender forthwith to undergo the remainder of their sentence.`
      }
    ],
    extractedData: {
      courtName: {
        value: 'Supreme Court of India',
        confidence: 98,
        pageNumber: 1,
        evidenceQuote: 'IN THE SUPREME COURT OF INDIA',
        status: 'Verified',
      },
      caseType: {
        value: 'Criminal Appeal',
        confidence: 96,
        pageNumber: 1,
        evidenceQuote: 'CRIMINAL APPEAL NO. 784 OF 2023',
        status: 'Verified',
      },
      caseNumber: {
        value: 'Criminal Appeal No. 784 of 2023',
        confidence: 96,
        pageNumber: 1,
        evidenceQuote: 'CRIMINAL APPEAL NO. 784 OF 2023',
        status: 'Verified',
      },
      year: {
        value: '2023',
        confidence: 98,
        pageNumber: 1,
        evidenceQuote: 'CRIMINAL APPEAL NO. 784 OF 2023',
        status: 'Verified',
      },
      bench: {
        value: "Hon'ble Justice SANJAY KISHAN KAUL, Hon'ble Justice ABHAY S. OKA",
        confidence: 94,
        pageNumber: 1,
        evidenceQuote: "HON'BLE MR. JUSTICE SANJAY KISHAN KAUL",
        status: 'Verified',
      },
      petitioner: {
        value: 'Rajesh Kumar Sharma & Ors.',
        confidence: 95,
        pageNumber: 1,
        evidenceQuote: 'Rajesh Kumar Sharma & Ors. ... Appellant(s)',
        status: 'Verified',
      },
      respondent: {
        value: 'State of NCT of Delhi',
        confidence: 95,
        pageNumber: 1,
        evidenceQuote: 'State of NCT of Delhi ... Respondent(s)',
        status: 'Verified',
      },
      actsAndSections: [
        {
          act: 'Indian Penal Code, 1860',
          section: 'Section 302',
          description: 'Punishment for murder (Capital punishment or life imprisonment and fine).',
          pageNumber: 14,
          quote: 'conviction passed by the High Court of Delhi under Section 302 of the Indian Penal Code, 1860 is hereby upheld and confirmed.',
          confidence: 96,
          status: 'Verified',
        },
      ],
      finalOutcome: {
        disposition: 'Appeal Dismissed',
        verdictText: 'In the result, the appeal is dismissed. The impugned judgment and order of conviction passed by the High Court of Delhi under Section 302 of the Indian Penal Code, 1860 is hereby upheld and confirmed.',
        pageNumber: 14,
        evidenceQuote: 'In the result, the appeal is dismissed. The impugned judgment and order of conviction passed by the High Court of Delhi under Section 302 of the Indian Penal Code, 1860 is hereby upheld and confirmed.',
        confidence: 95,
        status: 'Verified',
        orderType: 'Final Judgment',
      },
      summary: 'DEMO MISMATCH DOCUMENT: Operative outcome intentionally modified from "Appeal Allowed" to "Appeal Dismissed" to test discrepancy detection.',
      keyIssues: ['Document comparison testing', 'Tampering detection demonstration'],
      operativeOrderText: 'Appeal is dismissed. Conviction upheld.',
      orderType: 'Final Judgment',
    },
    overallStatus: 'Verified',
    confidenceScore: 92,
    authoritativeSourceChecked: false,
    notes: 'Demo test document for verifying Mismatch Detection in comparison mode.',
  },
  {
    id: 'sample-bombay-hc-ni-act-2023',
    fileName: 'BombayHC_CrlApp_109_2023_ApexFinvest.pdf',
    fileSize: 254800,
    analyzedAt: '2026-10-08T16:45:00.000Z',
    pageCount: 11,
    hasExtractableText: true,
    isDemo: true,
    rawText: `IN THE HIGH COURT OF JUDICATURE AT BOMBAY\nAPPELLATE SIDE\nCRIMINAL APPEAL NO. 109 OF 2023...`,
    pages: [
      {
        pageNumber: 1,
        text: `IN THE HIGH COURT OF JUDICATURE AT BOMBAY
APPELLATE SIDE
CRIMINAL APPEAL NO. 109 OF 2023

Apex Finvest & Capital Services Pvt. Ltd. ... Appellant
VERSUS
Sunita Ramesh Patil & Anr. ... Respondents

CORAM:
HON'BLE SMT. JUSTICE BHARATI DANGRE`
      },
      {
        pageNumber: 2,
        text: `1. This appeal challenges the judgment and order of acquittal dated 18.01.2023 passed by the learned Metropolitan Magistrate, 33rd Court, Ballard Pier, Mumbai in C.C. No. 4502/SS/2018 under Section 138 of the Negotiable Instruments Act, 1881.

2. The complainant alleged that the respondent issued a cheque for Rs. 25,00,000/- which was returned dishonoured with the remark "Funds Insufficient".`
      },
      {
        pageNumber: 11,
        text: `19. The accused successfully rebutted the statutory presumption under Section 139 of the Negotiable Instruments Act, 1881 on a preponderance of probabilities by demonstrating that the cheque was issued as an advance security and not in discharge of any legally enforceable debt.

20. No perversity is shown in the order of acquittal. Consequently, the appeal is dismissed.

BHARATI DANGRE, J.
MUMBAI;
OCTOBER 08, 2023.`
      }
    ],
    extractedData: {
      courtName: {
        value: 'High Court of Judicature at Bombay',
        confidence: 97,
        pageNumber: 1,
        evidenceQuote: 'IN THE HIGH COURT OF JUDICATURE AT BOMBAY',
        status: 'Verified',
      },
      caseType: {
        value: 'Criminal Appeal',
        confidence: 95,
        pageNumber: 1,
        evidenceQuote: 'CRIMINAL APPEAL NO. 109 OF 2023',
        status: 'Verified',
      },
      caseNumber: {
        value: 'Criminal Appeal No. 109 of 2023',
        confidence: 95,
        pageNumber: 1,
        evidenceQuote: 'CRIMINAL APPEAL NO. 109 OF 2023',
        status: 'Verified',
      },
      year: {
        value: '2023',
        confidence: 97,
        pageNumber: 1,
        evidenceQuote: 'CRIMINAL APPEAL NO. 109 OF 2023',
        status: 'Verified',
      },
      bench: {
        value: "Hon'ble Justice BHARATI DANGRE",
        confidence: 94,
        pageNumber: 1,
        evidenceQuote: "HON'BLE SMT. JUSTICE BHARATI DANGRE",
        status: 'Verified',
      },
      petitioner: {
        value: 'Apex Finvest & Capital Services Pvt. Ltd.',
        confidence: 94,
        pageNumber: 1,
        evidenceQuote: 'Apex Finvest & Capital Services Pvt. Ltd. ... Appellant',
        status: 'Verified',
      },
      respondent: {
        value: 'Sunita Ramesh Patil & Anr.',
        confidence: 94,
        pageNumber: 1,
        evidenceQuote: 'Sunita Ramesh Patil & Anr. ... Respondents',
        status: 'Verified',
      },
      actsAndSections: [
        {
          act: 'Negotiable Instruments Act, 1881',
          section: 'Section 138',
          description: 'Dishonour of cheque for insufficiency of funds in the bank account.',
          pageNumber: 2,
          quote: 'under Section 138 of the Negotiable Instruments Act, 1881. The complainant alleged that the respondent issued a cheque for Rs. 25,00,000/- which was returned dishonoured',
          confidence: 98,
          status: 'Verified',
        },
        {
          act: 'Negotiable Instruments Act, 1881',
          section: 'Section 139',
          description: 'Presumption in favour of holder regarding legally enforceable debt.',
          pageNumber: 11,
          quote: 'rebutted the statutory presumption under Section 139 of the Negotiable Instruments Act, 1881 on a preponderance of probabilities',
          confidence: 96,
          status: 'Verified',
        },
      ],
      finalOutcome: {
        disposition: 'Appeal Dismissed',
        verdictText: 'No perversity is shown in the order of acquittal. Consequently, the appeal is dismissed.',
        pageNumber: 11,
        evidenceQuote: 'No perversity is shown in the order of acquittal. Consequently, the appeal is dismissed.',
        confidence: 97,
        status: 'Verified',
        orderType: 'Final Judgment',
      },
      summary: 'Bombay High Court criminal appeal challenging acquittal in a Section 138 NI Act cheque dishonour complaint. The High Court upheld the Magistrate ruling that the accused successfully rebutted the Section 139 presumption, confirming the acquittal.',
      keyIssues: [
        'Rebuttal of statutory presumption under Section 139 NI Act',
        'Cheque handed over as loan security vs. legally enforceable debt',
        'Standard of interference in appellate review of acquittal judgments',
      ],
      operativeOrderText: 'Acquittal upheld. Criminal Appeal dismissed.',
      orderType: 'Final Judgment',
    },
    overallStatus: 'Verified',
    confidenceScore: 95,
    authoritativeSourceChecked: false,
    notes: 'Negotiable Instruments Act cheque dishonour appeal benchmark.',
  },
  {
    id: 'sample-uncertain-bail-petition',
    fileName: 'Interim_Order_BailAppl_92_2024.pdf',
    fileSize: 184000,
    analyzedAt: '2026-10-11T08:00:00.000Z',
    pageCount: 4,
    hasExtractableText: true,
    isDemo: true,
    rawText: `IN THE COURT OF ADDITIONAL SESSIONS JUDGE\nIN THE MATTER OF BAIL APPLICATION NO. 92 OF 2024...`,
    pages: [
      {
        pageNumber: 1,
        text: `IN THE COURT OF ADDITIONAL SESSIONS JUDGE
IN THE MATTER OF BAIL APPLICATION NO. 92 OF 2024
IN CRIME NO. 410/2023 OF KOTWALI POLICE STATION

Vikramaditya @ Vicky
V/s
State of Uttar Pradesh`
      },
      {
        pageNumber: 4,
        text: `Arguments heard in part. Medical reports of the victim called for. List on 25.10.2024 for further consideration on interim protection. No coercive steps till next date.`
      }
    ],
    extractedData: {
      courtName: {
        value: 'Court of Sessions / District Court',
        confidence: 80,
        pageNumber: 1,
        evidenceQuote: 'IN THE COURT OF ADDITIONAL SESSIONS JUDGE',
        status: 'Verified',
      },
      caseType: {
        value: 'Bail Application',
        confidence: 88,
        pageNumber: 1,
        evidenceQuote: 'BAIL APPLICATION NO. 92 OF 2024',
        status: 'Verified',
      },
      caseNumber: {
        value: 'Bail Appln. No. 92 of 2024',
        confidence: 88,
        pageNumber: 1,
        evidenceQuote: 'BAIL APPLICATION NO. 92 OF 2024',
        status: 'Verified',
      },
      year: {
        value: '2024',
        confidence: 90,
        pageNumber: 1,
        evidenceQuote: '2024',
        status: 'Verified',
      },
      bench: {
        value: 'Presiding Coram not explicitly stated',
        confidence: 0,
        pageNumber: null,
        evidenceQuote: null,
        status: 'Needs Review',
        reviewReason: 'Judge designations omitted from title block and concluding signature lines.',
      },
      petitioner: {
        value: 'Vikramaditya @ Vicky',
        confidence: 90,
        pageNumber: 1,
        evidenceQuote: 'Vikramaditya @ Vicky V/s State of Uttar Pradesh',
        status: 'Verified',
      },
      respondent: {
        value: 'State of Uttar Pradesh',
        confidence: 90,
        pageNumber: 1,
        evidenceQuote: 'Vikramaditya @ Vicky V/s State of Uttar Pradesh',
        status: 'Verified',
      },
      actsAndSections: [],
      finalOutcome: {
        disposition: 'Interim Order / Stay Granted',
        verdictText: 'Arguments heard in part. Medical reports of the victim called for. List on 25.10.2024 for further consideration on interim protection. No coercive steps till next date.',
        pageNumber: 4,
        evidenceQuote: 'Arguments heard in part. Medical reports of the victim called for. List on 25.10.2024 for further consideration on interim protection. No coercive steps till next date.',
        confidence: 85,
        status: 'Needs Review',
        orderType: 'Interim / Procedural Order',
        reviewReason: 'Document identified as an Interim / Procedural Order rather than a final disposal.',
      },
      summary: 'Interim proceeding before Sessions Court. Final bail decision deferred pending medical reports.',
      keyIssues: ['Interim protection from arrest', 'Pending trial court records'],
      operativeOrderText: 'Interim protection granted until next date; listed for further hearing.',
      orderType: 'Interim / Procedural Order',
    },
    overallStatus: 'Needs Review',
    confidenceScore: 62,
    authoritativeSourceChecked: false,
    notes: 'Demo document intentionally demonstrating "Needs Review" status due to interim procedural disposition.',
  }
];
