import React, { memo } from 'react';

interface SubjectSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SUBJECTS = [
  "Kiến thức chung",
  "Toán học",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Lịch sử",
  "Địa lý",
  "Văn học",
  "Tiếng Anh",
];

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col relative">
      <select
        value={value}
        onChange={onChange}
        className="custom-select w-full p-3.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white font-medium text-slate-700"
      >
        {SUBJECTS.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-500 mt-2">
        Chọn đúng môn học sẽ giúp AI chấm điểm chính xác hơn.
      </p>
    </div>
  );
};

export default memo(SubjectSelector);