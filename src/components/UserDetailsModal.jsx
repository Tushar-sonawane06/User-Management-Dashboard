import { useEffect, useRef } from 'react';
import {
  X, Mail, Phone, Globe, Building2, MapPin,
  Pencil, FileText, AlertCircle,
} from 'lucide-react';
import { useUserPosts } from '../hooks/useUserPosts';
import LoadingSpinner from './LoadingSpinner';

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
        <Icon size={14} className="text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-slate-700 break-words">{value}</p>
      </div>
    </div>
  );
}

function PostItem({ post }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <h4 className="text-sm font-medium text-slate-700 capitalize mb-1 line-clamp-2">{post.title}</h4>
      <p className="text-xs text-gray-400 line-clamp-3">{post.body}</p>
    </div>
  );
}

export default function UserDetailsModal({ user, onClose, onEdit }) {
  const { posts, loading: postsLoading, error: postsError } = useUserPosts(user?.id);
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onClose]);

  if (!user) return null;

  const address = [
    user.address?.street,
    user.address?.suite,
    user.address?.city,
    user.address?.zipcode,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      {/* Separate clickable backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="modal-content relative bg-white rounded-2xl shadow-2xl w-full max-w-xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 flex-shrink-0">
              {user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
            </div>
            <div>
              <h2 id="detail-title" className="text-lg font-semibold text-slate-800 leading-tight">
                {user.name}
              </h2>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(user)}
              aria-label="Edit user"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600
                         bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Pencil size={12} />
              Edit
            </button>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close details"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Contact & Info */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailRow icon={Mail} label="Email" value={user.email} />
              <DetailRow icon={Phone} label="Phone" value={user.phone} />
              <DetailRow icon={Globe} label="Website" value={user.website} />
              <DetailRow icon={MapPin} label="Address" value={address} />
            </div>
          </section>

          {/* Company */}
          {user.company && (
            <section className="border-t border-gray-100 pt-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Company
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow icon={Building2} label="Name" value={user.company.name} />
                {user.company.catchPhrase && (
                  <DetailRow icon={FileText} label="Catch Phrase" value={user.company.catchPhrase} />
                )}
              </div>
            </section>
          )}

          {/* Posts */}
          <section className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Posts
              </h3>
              {!postsLoading && (
                <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                  {posts.length}
                </span>
              )}
            </div>

            {postsLoading && (
              <LoadingSpinner className="py-8" />
            )}

            {postsError && (
              <div className="flex items-center gap-2 text-sm text-red-500 py-4">
                <AlertCircle size={15} />
                {postsError}
              </div>
            )}

            {!postsLoading && !postsError && posts.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">This user has no posts yet.</p>
            )}

            {!postsLoading && !postsError && posts.length > 0 && (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {posts.map((post) => (
                  <PostItem key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
