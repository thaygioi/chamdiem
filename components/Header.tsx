import React, { memo } from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center w-full max-w-3xl">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
        Trợ lý Chấm điểm AI
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
        Chấm điểm tự động cho mọi môn học mà không cần đáp án. Chỉ cần chụp ảnh bài kiểm tra của bạn và để AI làm phần còn lại.
      </p>
    </header>
  );
};

export default memo(Header);