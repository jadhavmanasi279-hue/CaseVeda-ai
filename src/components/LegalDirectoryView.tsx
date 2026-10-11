import React, { useState } from 'react';
import { BookOpen, Search, Scale, FileText, ChevronRight } from 'lucide-react';

interface LegalEntry {
  act: string;
  section: string;
  category: 'Criminal' | 'Constitutional' | 'Commercial & Civil' | 'Procedural';
  title: string;
  summary: string;
  precedentPoints: string[];
}

const STATUTORY_DIRECTORY: LegalEntry[] = [
  {
    act: 'Indian Penal Code, 1860',
    section: 'Section 302',
    category: 'Criminal',
    title: 'Punishment for Murder',
    summary: 'Prescribes capital punishment or imprisonment for life and fine for causing intentional death without general exceptions.',
    precedentPoints: [
      'Chain of circumstantial evidence must be unbroken (Sharad Birdhichand Sarda case)',
      'Ocular testimony must be corroborated by medical evidence in fatal trauma cases',
      'Requires strict proof of mens rea and direct actus reus under Section 300 IPC',
    ],
  },
  {
    act: 'Indian Penal Code, 1860',
    section: 'Section 34',
    category: 'Criminal',
    title: 'Acts Done by Several Persons in Furtherance of Common Intention',
    summary: 'Enforces joint and constructive liability when a criminal act is done by multiple individuals with a pre-arranged plan or shared intent.',
    precedentPoints: [
      'Distinction between common intention (Sec 34) and similar intention',
      'Active participation and prior meeting of minds must be established',
    ],
  },
  {
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 439',
    category: 'Procedural',
    title: 'Special Powers of High Court or Sessions Court Regarding Bail',
    summary: 'Confers wide discretionary jurisdiction on the High Court or Sessions Court to direct release on bail for accused persons in custody.',
    precedentPoints: [
      'Bail is the rule, jail is the exception (State of Rajasthan v. Balchand)',
      'Consideration of gravity of offence, flight risk, and tampering with witnesses',
      'Conditions imposed must be reasonable and not onerous (P. Chidambaram case)',
    ],
  },
  {
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 482',
    category: 'Procedural',
    title: 'Saving of Inherent Powers of High Court',
    summary: 'High Court inherent power to make orders necessary to give effect to any order under CrPC, prevent abuse of process of any court, or secure ends of justice.',
    precedentPoints: [
      'Quashing of frivolous FIRs and criminal proceedings where allegations disclose no offence',
      'Guidelines laid down in State of Haryana v. Bhajan Lal',
    ],
  },
  {
    act: 'Constitution of India, 1950',
    section: 'Article 226',
    category: 'Constitutional',
    title: 'Power of High Courts to Issue Certain Writs',
    summary: 'Empowers High Courts to issue writs of habeas corpus, mandamus, prohibition, quo warranto, and certiorari for enforcement of fundamental rights and for any other purpose.',
    precedentPoints: [
      'Wider scope than Article 32 as it extends to any legal right',
      'Self-imposed restraint where effective alternate statutory remedy exists',
    ],
  },
  {
    act: 'Constitution of India, 1950',
    section: 'Article 21',
    category: 'Constitutional',
    title: 'Protection of Life and Personal Liberty',
    summary: 'No person shall be deprived of life or personal liberty except according to procedure established by law.',
    precedentPoints: [
      'Encompasses right to speedy trial, privacy (Puttaswamy), and dignified livelihood',
      'Procedure established by law must be just, fair, and reasonable (Maneka Gandhi)',
    ],
  },
  {
    act: 'Negotiable Instruments Act, 1881',
    section: 'Section 138',
    category: 'Commercial & Civil',
    title: 'Dishonour of Cheque for Insufficiency of Funds',
    summary: 'Creates quasi-criminal liability for dishonoured cheques issued for discharge of legally enforceable debts or liabilities.',
    precedentPoints: [
      'Statutory presumption under Section 139 in favour of complainant/holder',
      'Accused can rebut presumption on preponderance of probabilities (Rangappa v. Mohan)',
      'Mandatory statutory notice within 30 days of dishonour memo',
    ],
  },
  {
    act: 'Arbitration and Conciliation Act, 1996',
    section: 'Section 34',
    category: 'Commercial & Civil',
    title: 'Application for Setting Aside Arbitral Award',
    summary: 'Strictly circumscribed grounds for judicial review of domestic and international commercial arbitral awards.',
    precedentPoints: [
      'Grounds limited to patent illegality, conflict with fundamental policy of Indian law, and fraud',
      'Court does not act as appellate court to re-examine facts or merits (Ssangyong Engineering)',
    ],
  },
];

export const LegalDirectoryView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');

  const filtered = STATUTORY_DIRECTORY.filter((item) => {
    const q = query.toLowerCase();
    const matchQ = !q || item.section.toLowerCase().includes(q) || item.act.toLowerCase().includes(q) || item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q);
    const matchC = selectedCat === 'ALL' || item.category === selectedCat;
    return matchQ && matchC;
  });

  return (
    <div className="space-y-6">
      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search statute or section (e.g. 302, bail)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'Criminal', 'Procedural', 'Constitutional', 'Commercial & Civil'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCat === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:border-teal-400 transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-navy-950">
                {item.section}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {item.category}
              </span>
            </div>

            <div className="text-xs font-bold text-teal-700">
              {item.act}
            </div>

            <h4 className="text-xs font-bold text-slate-800">
              {item.title}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed">
              {item.summary}
            </p>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Key Judicial Precedents & Principles
              </span>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                {item.precedentPoints.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start space-x-1.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
