import React, { memo } from 'react';
import type { GradingResult } from '../types';
import { CheckCircleIcon, XCircleIcon, QuoteIcon } from './icons';

interface ResultsDisplayProps {
  result: GradingResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
    const getScoreColorClasses = (percentage: number) => {
        if (percentage >= 80) return { text: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
        if (percentage >= 50) return { text: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
        return { text: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
    }
    
    const scoreColor = getScoreColorClasses(result.gradePercentage);

  return (
    <div className="w-full text-left flex flex-col gap-6">
      {/* Phần 1: Bảng điểm */}
      <div className={`text-center p-6 rounded-2xl ${scoreColor.bg} border ${scoreColor.border}`}>
        <p className={`text-sm font-medium ${scoreColor.text}`}>Điểm số cuối cùng</p>
        <p className={`text-7xl font-extrabold ${scoreColor.text} [text-shadow:_0_2px_10px_rgb(0_0_0_/_10%)]`}>
          {result.score}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white/70 rounded-lg border border-slate-200/80">
                <p className="text-xs font-medium text-slate-500">Tỷ lệ đúng</p>
                <p className="text-lg font-bold text-slate-700">{result.gradePercentage.toFixed(1)}%</p>
            </div>
             <div className="p-3 bg-white/70 rounded-lg border border-slate-200/80">
                 <p className="text-xs font-medium text-slate-500">Câu đúng</p>
                 <p className="text-lg font-bold text-slate-700">{result.correctAnswers}/{result.totalQuestions}</p>
            </div>
        </div>
      </div>
      
      {/* Phần 2: Nhận xét */}
      <div className="p-5 rounded-2xl border border-slate-200/80 bg-white/70">
        <h3 className="text-lg font-bold mb-3 flex items-center text-slate-800">
            <QuoteIcon className="w-5 h-5 mr-2.5 text-slate-400" />
            Nhận xét từ AI
        </h3>
        <blockquote className="text-md text-slate-700 italic border-l-4 border-slate-300 pl-4 py-1">{result.feedback}</blockquote>
      </div>

      {/* Phần 3: Chi tiết */}
      <div className="p-5 rounded-2xl border border-slate-200/80 bg-white/70">
        <h3 className="text-lg font-bold mb-4 text-slate-800">Chi tiết từng câu</h3>
        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 -mr-2">
            {result.results.map((item) => (
              <div key={item.questionNumber} className={`p-3.5 rounded-lg border ${item.isCorrect ? 'border-slate-200 bg-white' : 'border-red-200 bg-red-50/50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-slate-800">Câu {item.questionNumber}</p>
                  {item.isCorrect ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                      <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                </div>
                <dl className="mt-2 text-sm space-y-1.5">
                  <div className="grid grid-cols-[70px_1fr] gap-2 items-start">
                      <dt className="font-semibold text-slate-500">Bài làm:</dt>
                      <dd className="text-slate-800 break-words font-medium">{item.studentAnswer}</dd>
                  </div>
                   {!item.isCorrect && (
                     <div className="grid grid-cols-[70px_1fr] gap-2 items-start">
                        <dt className="font-semibold text-green-700">Đáp án:</dt>
                        <dd className="font-semibold text-green-700 break-words">{item.correctAnswer}</dd>
                     </div>
                   )}
                </dl>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default memo(ResultsDisplay);