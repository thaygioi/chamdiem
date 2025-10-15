import React from 'react';

interface LoaderProps {
  isDark?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isDark = false }) => {
  const borderColor = isDark ? 'border-slate-500' : 'border-white';
  return (
    <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${borderColor}`}></div>
  );
};

export default Loader;