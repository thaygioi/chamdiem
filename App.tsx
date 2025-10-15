import React, { useState, useCallback, lazy, Suspense } from 'react';
import type { GradingResult } from './types';
import { gradeQuiz, fileToGenerativePart } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SubjectSelector from './components/SubjectSelector';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import { SparklesIcon } from './components/icons';
import Footer from './components/Footer';

const CameraCapture = lazy(() => import('./components/CameraCapture'));

const StepTitle: React.FC<{ number: number; title: string; }> = ({ number, title }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
            {number}
        </div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
);


const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>('Kiến thức chung');
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const handleImageSelected = useCallback((file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setGradingResult(null);
    setError(null);
  }, []);

  const handleCapture = (file: File) => {
    handleImageSelected(file);
    setIsCameraOpen(false);
  };

  const handleGradeQuiz = async () => {
    if (!imageFile) {
      setError('Vui lòng tải lên hoặc chụp ảnh bài kiểm tra.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGradingResult(null);

    try {
      const imagePart = await fileToGenerativePart(imageFile);
      const result = await gradeQuiz(imagePart, subject);
      setGradingResult(result);
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi chấm điểm. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen container mx-auto p-4 md:p-8 flex flex-col items-center">
      {isCameraOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"><Loader /></div>}>
          <CameraCapture onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />
        </Suspense>
      )}
      <Header />
      <main className="w-full max-w-3xl flex flex-col gap-8 mt-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200/80">
          <div className="mb-8">
            <StepTitle number={1} title="Chọn môn học" />
            <SubjectSelector
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div>
            <StepTitle number={2} title="Tải lên hoặc Chụp ảnh" />
            <ImageUploader onImageUpload={handleImageSelected} onCameraClick={() => setIsCameraOpen(true)} imageUrl={imageUrl} />
          </div>
          
          <button
            onClick={handleGradeQuiz}
            disabled={isLoading || !imageFile}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-xl hover:opacity-95 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none disabled:opacity-70 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-lg"
          >
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <SparklesIcon className="w-6 h-6 mr-2" />
                Chấm điểm bằng AI
              </>
            )}
          </button>
        </div>

        {(isLoading || error || gradingResult) && (
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200/80 animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Kết Quả Chấm Điểm</h2>
              <div className="h-full min-h-[400px] flex flex-col justify-center items-center p-4">
                {isLoading && (
                  <div className="text-center">
                    <Loader isDark={true} />
                    <p className="mt-4 text-slate-600 font-medium">AI đang phân tích và chấm điểm, vui lòng chờ...</p>
                    <p className="mt-2 text-sm text-slate-500">Quá trình này có thể mất vài giây.</p>
                  </div>
                )}
                {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                {gradingResult && <ResultsDisplay result={gradingResult} />}
              </div>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;