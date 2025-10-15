
import React from 'react';

interface AnswerKeyInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AnswerKeyInput: React.FC<AnswerKeyInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col">
      <textarea
        value={value}
        onChange={onChange}
        rows={8}
        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        placeholder={
`Nhập đáp án tại đây, mỗi câu một dòng.
Ví dụ:
1. A
2. Paris
3. 4
4. Đúng
...`
        }
      />
      <p className="text-xs text-slate-500 mt-2">
        Đảm bảo số thứ tự câu hỏi và đáp án rõ ràng để AI nhận diện chính xác nhất.
      </p>
    </div>
  );
};

export default AnswerKeyInput;
