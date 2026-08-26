import { Mail, Phone, Globe, Building2, Pencil, Trash2, Eye } from 'lucide-react';
import { formatPhone } from '../utils/formatPhone';

function Avatar({ name }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  // Deterministic color from name
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-indigo-100 text-indigo-700',
    'bg-violet-100 text-violet-700',
    'bg-sky-100 text-sky-700',
    'bg-teal-100 text-teal-700',
    'bg-emerald-100 text-emerald-700',
  ];
  const idx = name.charCodeAt(0) % colors.length;

  return (
    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${colors[idx]}`}>
      {initials}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
      <span className="text-gray-500 sr-only">{label}</span>
      <span className="text-slate-700 truncate">{value}</span>
    </div>
  );
}

export default function UserCard({ user, onView, onEdit, onDelete }) {
  return (
    <article
      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm
                 hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar name={user.name} />
        <div className="min-w-0 flex-1">
          <button
            onClick={() => onView(user)}
            className="text-left font-semibold text-slate-800 hover:text-blue-600 transition-colors text-sm leading-snug truncate block w-full"
          >
            {user.name}
          </button>
          <p className="text-xs text-gray-400 mt-0.5">{user.username ? `@${user.username}` : user.email}</p>
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-2 flex-1">
        <InfoRow icon={Mail}     label="Email"   value={user.email} />
        <InfoRow icon={Phone}    label="Phone"   value={formatPhone(user.phone)} />
        <InfoRow icon={Globe}    label="Website" value={user.website} />
        <InfoRow icon={Building2} label="Company" value={user.company?.name} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {/* "View details" styled as a ghost button to match icon actions visually */}
        <button
          onClick={() => onView(user)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600
                     border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-600
                     hover:bg-blue-50 transition-colors"
        >
          <Eye size={13} />
          View details
        </button>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(user)}
            aria-label={`Edit ${user.name}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(user)}
            aria-label={`Delete ${user.name}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
