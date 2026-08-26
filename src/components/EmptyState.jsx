import { Search, Users } from 'lucide-react';

export default function EmptyState({ type = 'noResults' }) {
  if (type === 'noResults') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search size={28} className="text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-700 mb-1">No users found</h3>
        <p className="text-sm text-gray-400 max-w-xs">
          Try adjusting your search query or clearing the company filter to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <Users size={28} className="text-blue-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">No users yet</h3>
      <p className="text-sm text-gray-400">Create your first user to get started.</p>
    </div>
  );
}
