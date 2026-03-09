import React, { useState, useRef } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  arrowBackOutline,
  calendarOutline,
  documentTextOutline,
  createOutline,
  cloudUploadOutline,
  imagesOutline,
  closeCircleOutline,
  checkmarkCircleOutline,
  trashOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './UploadReport.css';
import { useReports } from './ReportsContext';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string; 
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const UploadReport: React.FC = () => {
  const history = useHistory();
  const { addReport } = useReports();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reportDate, setReportDate] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullDetails, setFullDetails] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportTypes = ['Daily', 'Weekly', 'Monthly', 'Midterm', 'Final', 'Incident'];
  const [selectedType, setSelectedType] = useState('Daily');

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const converted = await Promise.all(
      imageFiles.map(async file => {
        const id = Math.random().toString(36).slice(2);
        const preview = await fileToBase64(file);
        return { id, name: file.name, size: file.size, type: file.type, preview };
      })
    );
    setUploadedFiles(prev => [...prev, ...converted]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const isFormValid = reportDate && reportTitle.trim() && description.trim();

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);

    await new Promise(res => setTimeout(res, 1200));

    const dateObj = new Date(reportDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });

    addReport({
      title: reportTitle.trim(),
      date: formattedDate,
      status: 'Submitted',
      type: selectedType,
      description: description.trim(),
      fullDetails: fullDetails.trim() || description.trim(),
      attachments: uploadedFiles.map(f => f.name),
      attachmentPreviews: uploadedFiles.map(f => f.preview ?? ''),
    });

    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => history.push('/reports'), 1800);
  };

  if (submitted) {
    return (
      <IonPage>
        <IonContent fullscreen className="ur-content">
          <div className="ur-success-screen">
            <div className="ur-success-ring" />
            <div className="ur-success-icon">
              <IonIcon icon={checkmarkCircleOutline} />
            </div>
            <h2 className="ur-success-title">Report Submitted!</h2>
            <p className="ur-success-sub">Your report has been uploaded successfully.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ur-content">

        {/* Hero */}
        <div className="ur-hero">
          <div className="ur-hero-bg" />
          <div className="ur-hero-inner">
            <button className="ur-back-btn" onClick={() => history.push('/reports')}>
              <IonIcon icon={arrowBackOutline} />
            </button>
            <div>
              <h1 className="ur-hero-title">Upload Report</h1>
              <p className="ur-hero-sub">Submit your OJT documentation</p>
            </div>
          </div>
        </div>

        <div className="ur-container">

          {/* Report Type */}
          <div className="ur-section">
            <div className="ur-section-label">
              <IonIcon icon={documentTextOutline} />
              Report Type
            </div>
            <div className="ur-type-row">
              {reportTypes.map(type => (
                <button
                  key={type}
                  className={`ur-type-chip ${selectedType === type ? 'ur-type-active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="ur-section">
            <div className="ur-section-label">
              <IonIcon icon={calendarOutline} />
              Report Date
            </div>
            <div className="ur-input-wrap">
              <IonIcon icon={calendarOutline} className="ur-input-icon" />
              <input
                type="date"
                className="ur-input ur-input-date"
                value={reportDate}
                onChange={e => setReportDate(e.target.value)}
              />
            </div>
          </div>

          {/* Title */}
          <div className="ur-section">
            <div className="ur-section-label">
              <IonIcon icon={createOutline} />
              Report Title
            </div>
            <div className="ur-input-wrap">
              <IonIcon icon={createOutline} className="ur-input-icon" />
              <input
                type="text"
                className="ur-input"
                placeholder="e.g. Weekly Report – Week 5"
                value={reportTitle}
                onChange={e => setReportTitle(e.target.value)}
                maxLength={80}
              />
              {reportTitle && (
                <button className="ur-clear-btn" onClick={() => setReportTitle('')}>
                  <IonIcon icon={closeCircleOutline} />
                </button>
              )}
            </div>
            <span className="ur-char-count">{reportTitle.length}/80</span>
          </div>

          {/* Description */}
          <div className="ur-section">
            <div className="ur-section-label">
              <IonIcon icon={documentTextOutline} />
              Description
            </div>
            <textarea
              className="ur-textarea"
              placeholder="Describe your activities, learnings, and observations for this report period…"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              maxLength={600}
            />
            <span className="ur-char-count">{description.length}/600</span>
          </div>

          {/* Full Details */}
          <div className="ur-section">
            <div className="ur-section-label">
              <IonIcon icon={createOutline} />
              Full Details
              <span className="ur-label-hint">Optional — provide an in-depth account</span>
            </div>
            <textarea
              className="ur-textarea"
              placeholder="Elaborate on your tasks, challenges encountered, skills gained, tools used, and any notable outcomes during this report period…"
              value={fullDetails}
              onChange={e => setFullDetails(e.target.value)}
              rows={8}
              maxLength={2000}
            />
            <span className="ur-char-count">{fullDetails.length}/2000</span>
          </div>

          {/* File Upload */}
          <div className="ur-section">
            <div className="ur-section-label">
              <IonIcon icon={imagesOutline} />
              Attachments
              <span className="ur-label-hint">Images only (JPG, PNG, GIF…)</span>
            </div>

            <div
              className={`ur-dropzone ${isDragging ? 'ur-dropzone--active' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="ur-dropzone-icon">
                <IonIcon icon={cloudUploadOutline} />
              </div>
              <p className="ur-dropzone-title">
                {isDragging ? 'Drop images here' : 'Tap or drag to upload'}
              </p>
              <p className="ur-dropzone-sub">Supports JPG, PNG, GIF, WEBP and other image formats</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="ur-file-input"
                onClick={e => e.stopPropagation()}
                onChange={e => handleFiles(e.target.files)}
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="ur-file-list">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="ur-file-item">
                    <img src={file.preview} alt={file.name} className="ur-file-thumb" />
                    <div className="ur-file-info">
                      <span className="ur-file-name">{file.name}</span>
                      <span className="ur-file-size">{formatBytes(file.size)}</span>
                    </div>
                    <button className="ur-file-remove" onClick={() => removeFile(file.id)}>
                      <IonIcon icon={trashOutline} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            className={`ur-submit-btn ${isFormValid ? 'ur-submit-ready' : ''} ${isSubmitting ? 'ur-submit-loading' : ''}`}
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="ur-spinner" />
                Submitting…
              </>
            ) : (
              <>
                <IonIcon icon={cloudUploadOutline} />
                Submit Report
              </>
            )}
          </button>

          <div className="ur-bottom-space" />
        </div>

      </IonContent>
    </IonPage>
  );
};

export default UploadReport;