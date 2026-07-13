import React, { useState, useRef, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';

interface FileUploadAreaProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
}

export function FileUploadArea({ onFileSelect, accept = "application/pdf" }: FileUploadAreaProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'uploaded'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus('uploading');
      
      if (selectedFile.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
      
      // Mock upload progress
      setTimeout(() => {
        setStatus('uploaded');
        onFileSelect(selectedFile);
      }, 1500);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFile(null);
    setStatus('idle');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept={accept}
        onChange={handleFileChange}
      />
      
      {status === 'idle' && (
        <div 
          className="w-full border-2 border-dashed border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center p-4 cursor-pointer text-sm text-gray-600 transition-colors" 
          onClick={() => fileInputRef.current?.click()}
        >
          Arraste e solte os arquivos ou <span className="text-guapi-orange font-bold ml-1">Clique aqui</span>
        </div>
      )}

      {status === 'uploading' && (
        <div className="w-full bg-[#525252] text-white rounded-lg p-3 flex items-center justify-between shadow-sm">
           <div className="flex flex-col overflow-hidden mr-4">
              <span className="font-medium text-sm truncate">{file?.name}</span>
              <span className="text-[11px] text-gray-300">{(file?.size! / 1024).toFixed(0)} KB</span>
           </div>
           <div className="flex items-center flex-shrink-0">
             <div className="flex flex-col items-end mr-3">
                <span className="font-bold text-sm leading-tight">Enviando</span>
                <button type="button" className="text-[10px] text-gray-300 hover:text-white leading-tight mt-0.5" onClick={clearFile}>clique para cancelar</button>
             </div>
             <Loader2 className="w-6 h-6 animate-spin text-gray-300 shrink-0" />
           </div>
        </div>
      )}

      {status === 'uploaded' && !previewUrl && (
        <div className="w-full bg-[#34A853] text-white rounded-lg p-3 flex items-center justify-between shadow-sm">
           <div className="flex flex-col overflow-hidden mr-4">
              <span className="font-medium text-sm truncate">{file?.name}</span>
              <span className="text-[11px] text-green-100">{(file?.size! / 1024).toFixed(0)} KB</span>
           </div>
           <div className="flex items-center flex-shrink-0">
             <div className="flex flex-col items-end mr-3">
                <span className="font-bold text-sm leading-tight">Envio finalizado</span>
                <button type="button" className="text-[10px] text-green-100 hover:text-white leading-tight mt-0.5" onClick={clearFile}>clique para desfazer</button>
             </div>
             <button type="button" onClick={clearFile} className="bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-colors shrink-0 flex items-center justify-center">
               <X className="w-3.5 h-3.5" />
             </button>
           </div>
        </div>
      )}

      {status === 'uploaded' && previewUrl && (
        <div 
          className="w-full h-40 rounded-lg overflow-hidden relative shadow-sm"
          style={{ backgroundImage: `url(${previewUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
           <div className="absolute inset-0 bg-gradient-to-b from-[#34A853]/90 via-[#34A853]/40 to-transparent"></div>
           <div className="relative z-10 p-3 flex items-start justify-between text-white w-full h-full">
             <div className="flex flex-col overflow-hidden mr-4">
                <span className="font-medium text-sm truncate drop-shadow-md">{file?.name}</span>
                <span className="text-[11px] text-green-100 drop-shadow-md">{(file?.size! / 1024).toFixed(0)} KB</span>
             </div>
             <div className="flex items-center flex-shrink-0">
               <div className="flex flex-col items-end mr-3">
                  <span className="font-bold text-sm leading-tight text-white drop-shadow-md">Envio finalizado</span>
                  <button type="button" className="text-[10px] text-green-100 hover:text-white leading-tight mt-0.5 drop-shadow-md" onClick={clearFile}>clique para desfazer</button>
               </div>
               <button type="button" onClick={clearFile} className="bg-black/40 hover:bg-black/60 rounded-full p-1.5 transition-colors shrink-0 flex items-center justify-center backdrop-blur-sm">
                 <X className="w-3.5 h-3.5" />
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
