import React, { useState, useRef } from 'react';
import { Project, APKInfo } from '../types';
import { 
  UploadCloud, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  FileUp,
  Cpu,
  Info
} from 'lucide-react';

interface ApkUploadViewProps {
  activeProject: Project;
  onUpdateProjectApk: (projectId: string, apkInfo: APKInfo) => void;
}

export default function ApkUploadView({ activeProject, onUpdateProjectApk }: ApkUploadViewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingStateText, setUploadingStateText] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const simulateUploadProcess = (fileName: string, fileSize: string) => {
    setError('');
    setUploadProgress(0);
    setUploadingStateText('Parsing binary manifest and compiling resource references...');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);

      if (progress === 40) {
        setUploadingStateText('Decompressing AndroidManifest.xml and verifying signature block...');
      } else if (progress === 80) {
        setUploadingStateText('Index-mapping GUI layout XML nodes & widgets hierarchy...');
      } else if (progress >= 100) {
        clearInterval(interval);
        
        // Finalize simulated info
        const parsedName = fileName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15);
        const randomPackage = `com.research.${parsedName || 'apk'}.android`;
        
        const apkData: APKInfo = {
          packageName: activeProject.id === 'p2' ? 'com.fitkeep.tracker' : randomPackage,
          version: activeProject.id === 'p2' ? '1.0.8' : '3.0.1-beta',
          size: fileSize || '12.4 MB',
          minSdk: activeProject.id === 'p2' ? 'API 26 (Oreo)' : 'API 23 (Marshmallow)',
          targetSdk: activeProject.id === 'p2' ? 'API 34 (Upside Down Cake)' : 'API 33 (Tiramisu)',
          uploadDate: new Date().toISOString().split('T')[0],
          fileName: fileName
        };

        onUpdateProjectApk(activeProject.id, apkData);
        setUploadProgress(null);
      }
    }, 400);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.name.endsWith('.apk')) {
        setError('Invalid file type. Please upload a standard Android build binary (.apk).');
        return;
      }
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      simulateUploadProcess(file.name, sizeInMB);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.name.endsWith('.apk')) {
        setError('Invalid file type. Please upload a standard Android build binary (.apk).');
        return;
      }
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      simulateUploadProcess(file.name, sizeInMB);
    }
  };

  const triggerFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div id="apk-upload-view" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">APK Static Upload & Validation</h2>
        <p className="text-xs text-slate-400">
          Upload target application binaries to extract UI widget layout files automatically
        </p>
      </div>

      {/* Target Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center text-xs text-slate-600 shadow-sm">
        <div>
          Current upload target project: <strong className="text-slate-800">{activeProject.name}</strong>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">
          Target SDK: {activeProject.androidVersion}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="lg:col-span-2 space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileBrowser}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition ${
              isDragging 
                ? 'border-blue-500 bg-blue-50/40' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".apk"
            />

            {uploadProgress !== null ? (
              <div className="w-full max-w-sm space-y-4">
                <div className="flex justify-center">
                  <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Processing APK Manifest...</p>
                  <p className="text-[11px] text-slate-400 mt-1">{uploadingStateText}</p>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-[10px] font-mono font-bold text-blue-600">{uploadProgress}% complete</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Drag & Drop APK here, or click to browse</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Supports standard compiled Android APK files up to 250MB</p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition"
                >
                  <FileUp className="h-4 w-4" /> Select Build File
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Uploaded File Info Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">APK Specifications</h3>
            
            {activeProject.apkInfo ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileCode className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate" title={activeProject.apkInfo.fileName}>
                      {activeProject.apkInfo.fileName}
                    </p>
                    <p className="text-[10px] text-slate-400">Manifest Parsed Successfully</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-50 pt-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Package Name</span>
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 truncate max-w-[150px]">
                      {activeProject.apkInfo.packageName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">App Version</span>
                    <span className="font-medium text-slate-800">{activeProject.apkInfo.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size On Disk</span>
                    <span className="font-medium text-slate-800">{activeProject.apkInfo.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min SDK Requirement</span>
                    <span className="font-medium text-slate-800">{activeProject.apkInfo.minSdk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Framework</span>
                    <span className="font-medium text-slate-800">{activeProject.apkInfo.targetSdk}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 p-2 rounded-lg mt-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Verified signature alignment matches SDK requirement definitions.</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <p className="text-xs">No APK uploaded yet.</p>
                <p className="text-[10px] text-slate-400/80">Upload an Android .apk binary to inspect static structures.</p>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-50 pt-3 mt-4 flex items-center gap-1.5">
            <Info className="h-4 w-4 shrink-0" />
            <span>Static decompilation uses the modern Android asset packaging tool resource mapper (AAPT2).</span>
          </div>
        </div>
      </div>
    </div>
  );
}
