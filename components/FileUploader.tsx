"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { convertFileToUrl } from "@/lib/utils";
import { FileUploaderProps } from "@/types";

const FileUploader = ({ onChange }: FileUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);

      // Generate preview for the first file
      if (acceptedFiles.length > 0) {
        const fileUrl = convertFileToUrl(acceptedFiles[0]);
        setPreviewUrl(fileUrl);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Cleanup the object URL when the component unmounts or files change
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      {previewUrl ? (
        <Image
          src={previewUrl}
          width={1000}
          height={1000}
          alt="uploaded-image"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="upload"
          />
          <div className="file-upload_label">
            <p className="text-14-regular ">
              <span className="text-green-500">Click to upload </span>
              or drag and drop
            </p>
            <p className="text-12-regular">
              SVG, PNG, JPG, or GIF (max. 800x400px)
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;
