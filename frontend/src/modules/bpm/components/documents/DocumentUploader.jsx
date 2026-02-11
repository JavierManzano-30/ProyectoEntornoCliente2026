/**
 * Componente para cargar documentos
 */

import React, { useState } from 'react';
import { Upload, X, File } from 'lucide-react';
import './DocumentUploader.css';

const DocumentUploader = ({
  onFilesSelected,
  multiple = true,
  maxFiles = 5,
  maxFileSize = 10485760, // 10MB
  acceptedTypes = ['.pdf', '.doc', '.docx', '.xlsx', '.jpg', '.png']
}) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file) => {
    if (file.size > maxFileSize) {
      return `El archivo ${file.name} supera el tamaño máximo permitido (10MB)`;
    }

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `El tipo de archivo .${fileExtension} no está permitido`;
    }

    return '';
  };

  const handleFiles = (newFiles) => {
    setError('');
    const fileList = Array.from(newFiles);

    // Validar número de archivos
    if (files.length + fileList.length > maxFiles) {
      setError(`Máximo ${maxFiles} archivos permitidos`);
      return;
    }

    // Validar cada archivo
    const validationErrors = [];
    const validFiles = [];

    fileList.forEach(file => {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onFilesSelected && onFilesSelected(updatedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected && onFilesSelected(updatedFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const dt = e.dataTransfer;
    handleFiles(dt.files);
  };

  return (
    <div className="document-uploader">
      <div
        className={`upload-zone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-icon">
          <Upload size={40} />
        </div>
        <p className="upload-text">Arrastra archivos aquí o haz clic para seleccionar</p>
        <p className="upload-hint">Máximo {maxFiles} archivos, 10MB cada uno</p>
        <input
          type="file"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="file-input"
          accept={acceptedTypes.join(',')}
        />
      </div>

      {error && (
        <div className="upload-error">
          <p>{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="file-list">
          <h4>Archivos seleccionados ({files.length})</h4>
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <File size={18} />
              <div className="file-info">
                <p className="file-name">{file.name}</p>
                <p className="file-size">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeFile(index)}
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
