export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
        aria-label="Loading"
        role="status"
      />
    </div>
  );
}
