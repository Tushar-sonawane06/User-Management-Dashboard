import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import {
  nameRules,
  emailRules,
  phoneRules,
  websiteRules,
  companyRules,
} from '../utils/validators';

function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-500" role="alert">{error.message}</p>;
}

function FormField({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      {children}
      <FieldError error={error} />
    </div>
  );
}

const inputCls = (error) =>
  `w-full px-3 py-2.5 text-sm border rounded-lg text-slate-800 placeholder-gray-400
   focus:outline-none focus:ring-2 transition-shadow duration-150
   ${error
     ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
     : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`;

export default function UserForm({ user, onSubmit, onCancel, loading }) {
  const isEdit = Boolean(user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      website: user?.website || '',
      companyName: user?.company?.name || '',
    },
  });

  // Sync when user prop changes (e.g., opening edit for a different user)
  useEffect(() => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      website: user?.website || '',
      companyName: user?.company?.name || '',
    });
  }, [user, reset]);

  // ESC key
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape' && !loading) onCancel(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [loading, onCancel]);

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onCancel(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      <div className="modal-content relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 pt-5 pb-4 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h2 id="form-title" className="text-base font-semibold text-slate-800">
              {isEdit ? 'Edit User' : 'Add New User'}
            </h2>
            <button
              onClick={onCancel}
              disabled={loading}
              aria-label="Close form"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-4">
          <FormField label="Full Name *" id="name" error={errors.name}>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className={inputCls(errors.name)}
              {...register('name', nameRules)}
            />
          </FormField>

          <FormField label="Email Address *" id="email" error={errors.email}>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              className={inputCls(errors.email)}
              {...register('email', emailRules)}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Phone *" id="phone" error={errors.phone}>
              <input
                id="phone"
                type="tel"
                placeholder="+1 555 000 0000"
                className={inputCls(errors.phone)}
                {...register('phone', phoneRules)}
              />
            </FormField>

            <FormField label="Website *" id="website" error={errors.website}>
              <input
                id="website"
                type="text"
                placeholder="example.com"
                className={inputCls(errors.website)}
                {...register('website', websiteRules)}
              />
            </FormField>
          </div>

          <FormField label="Company Name *" id="companyName" error={errors.companyName}>
            <input
              id="companyName"
              type="text"
              placeholder="Acme Corp"
              className={inputCls(errors.companyName)}
              {...register('companyName', companyRules)}
            />
          </FormField>

          {/* Footer actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-gray-100
                         hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
                         text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Saving…
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
