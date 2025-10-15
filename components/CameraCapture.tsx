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
    // Stop any existing stream before starting a new one
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Lỗi truy cập camera:", err);
      setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập trong cài đặt trình duyệt của bạn.");
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        // Stop the stream after capture
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
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
    <div className="fixed inset-0 bg-black z-50 flex flex-col justify-center items-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {error && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <p className="text-white text-center bg-black/50 p-4 rounded-lg">{error}</p>
            </div>
        )}

        {/* Video Preview or Captured Image */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-300 ${capturedImage ? 'opacity-0' : 'opacity-100'}`}
        />
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Ảnh đã chụp"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
         <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* Controls Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
        {/* Top Control: Close Button */}
        <div className="flex justify-end">
            <button
                onClick={onClose}
                className="p-2.5 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Đóng camera"
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        
        {/* Bottom Controls */}
        <div className="pb-4">
          {!capturedImage ? (
            // Capture Button
            <div className="flex justify-center">
              <button
                onClick={handleCapture}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center ring-4 ring-white/30 hover:ring-white/50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
                aria-label="Chụp ảnh"
              >
                <div className="w-14 h-14 rounded-full bg-white active:bg-slate-200 border-2 border-black"></div>
              </button>
            </div>
          ) : (
            // Retake and Use Photo Buttons
            <div className="flex justify-around items-center">
              <button onClick={handleRetake} className="flex items-center gap-2 px-6 py-3 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition">
                <RefreshIcon className="w-6 h-6" /> Chụp lại
              </button>
              <button onClick={handleUsePhoto} className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-500 transition shadow-lg">
                <CheckIcon className="w-6 h-6" /> Sử dụng ảnh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
