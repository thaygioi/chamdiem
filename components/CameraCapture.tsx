import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon, CheckIcon, RefreshIcon, XIcon } from './icons';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Lỗi truy cập camera:", err);
      setError("Không thể truy cập camera. Vui lòng cấp quyền và thử lại.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [startCamera, stream]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };
  
  const handleUsePhoto = () => {
    if (capturedImage && canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-4 rounded-lg shadow-2xl w-full max-w-3xl aspect-video relative flex flex-col justify-center items-center">
        <button onClick={onClose} className="absolute top-2 right-2 text-white bg-slate-700/50 hover:bg-slate-600/50 rounded-full p-2 z-10">
          <XIcon className="w-6 h-6" />
        </button>

        {error && <p className="text-red-400">{error}</p>}
        
        {!capturedImage ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain rounded-md" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <button onClick={handleCapture} className="p-4 bg-white rounded-full shadow-lg hover:bg-slate-200 transition">
                <CameraIcon className="w-8 h-8 text-slate-700" />
              </button>
            </div>
          </>
        ) : (
          <>
            <img src={capturedImage} alt="Captured" className="w-full h-full object-contain rounded-md" />
            <div className="absolute bottom-4 flex gap-4">
              <button onClick={handleRetake} className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-full shadow-lg hover:bg-slate-500 transition font-semibold">
                <RefreshIcon className="w-6 h-6" /> Chụp lại
              </button>
              <button onClick={handleUsePhoto} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition font-semibold">
                <CheckIcon className="w-6 h-6" /> Sử dụng ảnh này
              </button>
            </div>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraCapture;