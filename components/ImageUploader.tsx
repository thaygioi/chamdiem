import React, { useCallback, useState, memo } from 'react';
import { UploadIcon, CameraIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onCameraClick: () => void;
  imageUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onCameraClick, imageUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  return (
    <div>
      <div className="relative">
        <label
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full h-56 sm:h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-100 scale-105 shadow-lg' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Xem trước bài kiểm tra" className="object-contain h-full w-full rounded-lg p-2" />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <UploadIcon className="w-12 h-12 mb-4 text-slate-400" />
              <p className="mb-2 text-md text-slate-600">
                <span className="font-semibold text-blue-600">Nhấn để tải lên</span> hoặc kéo và thả
              </p>
              <p className="text-xs text-slate-500">PNG, JPG, WEBP (tối đa 5MB)</p>
            </div>
          )}
          <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>

       <button
        onClick={onCameraClick}
        type="button"
        className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-5 text-sm font-medium text-slate-700 focus:outline-none bg-white rounded-lg border border-slate-300 hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-200 transition-colors"
      >
        <CameraIcon className="w-5 h-5" />
        Hoặc chụp ảnh từ Camera
      </button>
    </div>
  );
};

export default memo(ImageUploader);