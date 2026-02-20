'use client'

import { useState, useEffect } from "react";

interface FileItem {
  name: string;
  size: number;
  createdAt: string;
  url: string;
}

export default function Home() {
  const [status, setStatus] = useState("Ready to upload documents");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [summary, setSummary] = useState<string>("");

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (data.success) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setStatus(`✓ Uploaded: ${data.originalName}`);
        await loadFiles();
      } else {
        setStatus(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`✗ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  }

  async function handleDeleteFile(fileName: string) {
    if (!confirm(`Delete ${fileName}?`)) return;

    try {
      const res = await fetch(`/api/delete?fileName=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setStatus(`✓ Deleted: ${fileName}`);
        await loadFiles();
        if (selectedFile?.name === fileName) {
          setSelectedFile(null);
          setFileContent("");
          setSummary("");
        }
      } else {
        setStatus(`✗ Delete failed: ${data.error}`);
      }
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async function handleViewFile(file: FileItem) {
    setSelectedFile(file);
    setStatus(`Loading ${file.name}...`);
    setSummary("");

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name }),
      });

      const data = await res.json();

      if (data.success) {
        setFileContent(data.text);
        setStatus(`✓ Loaded: ${file.name}`);
      } else {
        setStatus(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async function handleSummarize() {
    if (!fileContent) {
      setStatus("Please select a file first");
      return;
    }

    setStatus("Generating summary...");
    setSummary("");

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fileContent }),
      });

      const data = await res.json();

      if (data.success) {
        setSummary(data.summary);
        setStatus("✓ Summary generated");
      } else {
        setStatus(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Document Summary App
          </h1>
          <p className="text-gray-600">{status}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - File Upload & List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Documents</h2>
              
              {/* Upload Button */}
              <label className={`block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded cursor-pointer transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? 'Uploading...' : '+ Upload Document'}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.pdf,.doc,.docx"
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {/* File List */}
              <div className="mt-4 space-y-2">
                {files.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No documents yet
                  </p>
                ) : (
                  files.map((file) => (
                    <div
                      key={file.name}
                      className={`p-3 border rounded hover:bg-gray-50 cursor-pointer transition ${
                        selectedFile?.name === file.name ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                      }`}
                      onClick={() => handleViewFile(file)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name.split('-').slice(1).join('-')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file.name);
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Middle Panel - Document Viewer */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Document Content</h2>
              {fileContent ? (
                <div className="border rounded p-4 bg-gray-50 h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {fileContent}
                  </pre>
                </div>
              ) : (
                <div className="border rounded p-4 bg-gray-50 h-96 flex items-center justify-center">
                  <p className="text-gray-400">Select a document to view</p>
                </div>
              )}
              
              <button
                onClick={handleSummarize}
                disabled={!fileContent}
                className={`mt-4 w-full py-3 px-4 rounded font-semibold transition ${
                  fileContent
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Generate AI Summary
              </button>
            </div>
          </div>

          {/* Right Panel - AI Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">AI Summary</h2>
              {summary ? (
                <div className="border rounded p-4 bg-blue-50 h-96 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{summary}</p>
                </div>
              ) : (
                <div className="border rounded p-4 bg-gray-50 h-96 flex items-center justify-center">
                  <p className="text-gray-400">Summary will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
