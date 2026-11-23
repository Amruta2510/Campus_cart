import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonLabel?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search products for student life...',
  className = '',
  buttonLabel = 'Search',
}: SearchBarProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className={`flex items-center bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-1.5 shadow-xs focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#DBEAFE] transition-all ${className}`}
      role="search"
    >
      <Search className="w-5 h-5 text-[#64748B] ml-2.5 shrink-0" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full px-3 py-2 text-sm sm:text-base text-[#1E293B] placeholder-[#64748B] bg-transparent focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onSubmit?.('');
          }}
          aria-label="Clear search"
          className="p-1.5 text-[#64748B] hover:text-[#1E293B] rounded-md mr-1"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {onSubmit && (
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150"
        >
          {buttonLabel}
        </button>
      )}
    </form>
  );
}
