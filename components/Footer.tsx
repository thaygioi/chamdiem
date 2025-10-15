import React, { memo } from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-6xl mt-16 text-center text-sm text-slate-500 border-t border-slate-200 pt-8">
      <div className="space-y-1">
        <p className="font-semibold text-slate-600">Trung tâm Tin học ứng dụng Bal Digitech</p>
        <p>Cung cấp: Tài khoản Canva, ứng dụng hỗ trợ giáo viên.</p>
        <p>Đào tạo: Trí tuệ nhân tạo, E-learning, ứng dụng AI trong giáo dục.</p>
        <p className="mt-3">
          <span className="font-semibold">Liên hệ đào tạo:</span> 0972.300.864 (Thầy Giới)
        </p>
      </div>
      <p className="mt-6 text-xs text-slate-400">
        Ứng dụng được phát triển bởi Thầy Giới.
      </p>
    </footer>
  );
};

export default memo(Footer);