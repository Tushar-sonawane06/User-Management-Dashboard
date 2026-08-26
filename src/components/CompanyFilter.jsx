import { Building2, ChevronDown } from 'lucide-react';

export default function CompanyFilter({ companies, value, onChange }) {
  return (
    <div className="relative flex-shrink-0">
      <Building2
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <select
        id="company-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by company"
        className="appearance-none pl-8 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg
                   text-slate-700 cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   transition-shadow duration-150"
      >
        <option value="">All Companies</option>
        {companies.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}
