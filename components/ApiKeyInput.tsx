import React, { memo } from 'react';
import { KeyIcon } from './icons';

interface ApiKeyInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <KeyIcon className="w-5 h-5 text-slate-400" />
        </div>
        <input
            id="api-key-input"
            type="password"
            value={value}
            onChange={onChange}
            placeholder="Nhập API Key của bạn tại đây"
            className="w-full p-3.5 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white font-medium text-slate-700"
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">
        API Key của bạn được lưu trữ an toàn trên trình duyệt và chỉ được sử dụng cho yêu cầu này.
      </p>
    </div>
  );
};

export default memo(ApiKeyInput);