import React, {useRef, useState} from 'react';
import { useToast } from '../context/ToasterBannerContext/hooks';
import { TOASTER_TYPES } from '../context/ToasterBannerContext/constants';
import {UploadIcon} from 'lucide-react';

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = ".pdf,.jpg,.jpeg,.png";
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

type ImgUploaderProps = {
    onFileSelect: (file: File | null) => void;
  };


  const ImgUploader: React.FC<ImgUploaderProps> = ({ onFileSelect }) => {
    const imgInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const { showToast } = useToast();
  
    const validateFileType = (file: File): boolean => {
      return ALLOWED_MIME_TYPES.includes(file.type);
    };
  
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setIsLoading(true);
        try {
          const selectedFile = e.target.files[0];
  
          // Validate file type
          if (!validateFileType(selectedFile)) {
            showToast(
              'Invalid file type. Please upload PDF, JPG, or PNG files only.',
              TOASTER_TYPES.ERROR,
              3000
            );
            if (imgInputRef.current) {
              imgInputRef.current.value = '';
            }
            return;
          }
  
          // Validate file size (5MB)
          if (selectedFile.size > FILE_SIZE_LIMIT) {
            showToast(
              'File size must be less than 5MB',
              TOASTER_TYPES.ERROR,
              3000
            );
            if (imgInputRef.current) {
              imgInputRef.current.value = '';
            }
            return;
          }
  
          setFile(selectedFile);
          onFileSelect(selectedFile);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    const removeFile = (e: React.MouseEvent) => {
      e.stopPropagation();
      setFile(null);
      onFileSelect(null);
      if (imgInputRef.current) {
        imgInputRef.current.value = '';
      }
    };
  
    return (
      <div
        onClick={() => imgInputRef.current?.click()}
        className='h-[99%] w-[99%] border-2 border-dashed rounded-3xl flex items-center justify-center hover:cursor-pointer relative'
      >
        <input
          type='file'
          ref={imgInputRef}
          hidden
          required
          accept={ALLOWED_FILE_TYPES}
          onChange={handleFileChange}
        />
        <div className='flex flex-col items-center gap-4'>
          {!file && (
            <>
              {!isLoading ? (
                <div className='min-h-[150px] text-[##CCCCCC] flex flex-col gap-2 justify-center items-center'>
                  <UploadIcon className='text-grey-main text-5xl'/>
                  <p>File Upload</p>
                  <p className='text-sm md:text-lg'>maximum file 5 mb (pdf, jpg, png)</p>
                </div>
              ) : (
                <h3>
                  {React.Children.toArray(
                    new Array(3)
                      .fill('_')
                      .map(() => (
                        <span className='pulse-dot text-grey-main text-5xl'>.</span>
                      ))
                  )}
                </h3>
              )}
            </>
          )}
          {file && (
            <div className='flex flex-col items-center gap-2'>
              {file.type.startsWith('image/') ? (
                <>
                  <img
                    width={144}
                    height={144}
                    src={URL.createObjectURL(file)}
                    alt='uploaded'
                    className='h-36 w-36 object-cover rounded-md'
                  />
                  <button
                    onClick={removeFile}
                    className='text-red-500 text-sm hover:text-red-600'
                  >
                    Remove file
                  </button>
                </>
              ) : (
                <>
                  <div className='h-36 w-36 flex items-center justify-center bg-gray-100 rounded-md'>
                    <p className='text-sm text-gray-600'>{file.name}</p>
                  </div>
                  <button
                    onClick={removeFile}
                    className='text-red-500 text-sm hover:text-red-600'
                  >
                    Remove file
                  </button>
                </>
              )}
              <p className='text-sm text-gray-400'>{(file.size / 1024 / 1024).toFixed(2)}MB</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default ImgUploader;