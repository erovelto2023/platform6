'use client';

import React, { useState, useCallback, useRef } from 'react';
import { usePDFTranslations as useTranslations } from '@/app/(dashboard)/tools/pdf-suite/_lib/use-translations';
import { FileUploader } from './FileUploader';
import { ProcessingProgress, ProcessingStatus } from './ProcessingProgress';
import { DownloadButton } from './DownloadButton';
import { Button } from '@/app/(dashboard)/tools/pdf-suite/_components/ui/PdfButton';
import { Card } from '@/app/(dashboard)/tools/pdf-suite/_components/ui/PdfCard';
import { executeNode } from '@/app/(dashboard)/tools/pdf-suite/_lib/workflow/executor';
import type { Tool } from '@/app/(dashboard)/tools/pdf-suite/_types/tool';
import type { UploadedFile, ProcessOutput } from '@/app/(dashboard)/tools/pdf-suite/_types/pdf';
import type { WorkflowNode } from '@/app/(dashboard)/tools/pdf-suite/_types/workflow';

/**
 * Generate a unique ID for files
 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface GenericPDFToolProps {
    tool: Tool;
    className?: string;
}

/**
 * GenericPDFTool Component
 * 
 * Provides a generic UI for any PDF tool using the executeNode function.
 * Supports file upload, processing, and download.
 */
export function GenericPDFTool({ tool, className = '' }: GenericPDFToolProps) {
    const t = useTranslations('common');
    const tTools = useTranslations('tools');

    // State
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [status, setStatus] = useState<ProcessingStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [result, setResult] = useState<Blob | Blob[] | null>(null);
    const [resultFilename, setResultFilename] = useState<string>('processed.pdf');
    const [error, setError] = useState<string | null>(null);

    // Ref for cancellation
    const cancelledRef = useRef(false);

    /**
     * Handle files selected from uploader
     */
    const handleFilesSelected = useCallback((newFiles: File[]) => {
        const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
            id: generateId(),
            file,
            status: 'pending' as const,
        }));

        // Check max files limit if applicable, though uploader handles it mostly
        const totalFiles = files.length + uploadedFiles.length;
        if (tool.maxFiles !== -1 && totalFiles > tool.maxFiles) {
            setError(`Maximum ${tool.maxFiles} files allowed.`);
            return;
        }

        setFiles(prev => [...prev, ...uploadedFiles]);
        setError(null);
        setResult(null);
    }, [files.length, tool.maxFiles]);

    /**
     * Handle file upload error
     */
    const handleUploadError = useCallback((errorMessage: string) => {
        setError(errorMessage);
    }, []);

    /**
     * Remove a file from the list
     */
    const handleRemoveFile = useCallback((id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        setResult(null);
    }, []);

    /**
     * Clear all files
     */
    const handleClearAll = useCallback(() => {
        setFiles([]);
        setResult(null);
        setError(null);
        setStatus('idle');
        setProgress(0);
    }, []);

    /**
     * Handle process operation
     */
    const handleProcess = useCallback(async () => {
        if (files.length === 0) {
            setError('Please add at least one file.');
            return;
        }

        cancelledRef.current = false;
        setStatus('processing');
        setProgress(0);
        setError(null);
        setResult(null);

        // Create a temporary workflow node
        // TODO: support tool settings via UI form
        const node: WorkflowNode = {
            id: 'temp-node',
            type: 'processor',
            data: {
                toolId: tool.id,
                label: tool.id,
                settings: {}, // Default settings for now
            },
            position: { x: 0, y: 0 },
        };

        try {
            const output: ProcessOutput = await executeNode(
                node,
                files.map(f => f.file),
                (prog) => {
                    if (!cancelledRef.current) {
                        setProgress(prog);
                        // setProgressMessage(`Processing... ${prog}%`);
                    }
                }
            );

            if (cancelledRef.current) {
                setStatus('idle');
                return;
            }

            if (output.success && output.result) {
                setResult(output.result);
                if (output.filename) {
                    setResultFilename(output.filename);
                }
                setStatus('complete');
            } else {
                setError(output.error?.message || 'Failed to process files.');
                setStatus('error');
            }
        } catch (err) {
            if (!cancelledRef.current) {
                console.error("Processing error:", err);
                setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
                setStatus('error');
            }
        }
    }, [files, tool.id]);

    /**
     * Handle cancel operation
     */
    const handleCancel = useCallback(() => {
        cancelledRef.current = true;
        setStatus('idle');
        setProgress(0);
    }, []);

    /**
     * Format file size
     */
    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const isProcessing = status === 'processing' || status === 'uploading';
    const canProcess = files.length > 0 && !isProcessing;

    return (
        <div className={`space-y-6 ${className}`.trim()}>
            {/* File Upload Area */}
            <FileUploader
                accept={tool.acceptedFormats}
                multiple={tool.maxFiles !== 1}
                maxFiles={tool.maxFiles === -1 ? 100 : tool.maxFiles}
                onFilesSelected={handleFilesSelected}
                onError={handleUploadError}
                disabled={isProcessing}
                label={`Upload ${tool.acceptedFormats.join(', ').toUpperCase()} Files`}
                description={`Drag and drop files here, or click to browse.`}
            />

            {/* Error Message */}
            {error && (
                <div
                    className="p-4 rounded-[var(--radius-md)] bg-red-50 border border-red-200 text-red-700"
                    role="alert"
                >
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* File List */}
            {files.length > 0 && (
                <Card variant="outlined" size="lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-[hsl(var(--color-foreground))]">
                            Files ({files.length})
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                            disabled={isProcessing}
                        >
                            Clear All
                        </Button>
                    </div>

                    <ul className="space-y-2" role="list" aria-label="Files to process">
                        {files.map((file, index) => (
                            <li
                                key={file.id}
                                className={`
                  flex items-center gap-3 p-3 rounded-[var(--radius-md)] border
                  border-[hsl(var(--color-border))]
                `}
                            >
                                {/* File Number */}
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] text-xs font-medium flex items-center justify-center">
                                    {index + 1}
                                </span>

                                {/* File Icon */}
                                <div className="flex-shrink-0">
                                    <svg className="w-8 h-8 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                        <path d="M14 2v6h6" fill="#e2e8f0" />
                                    </svg>
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[hsl(var(--color-foreground))] truncate">
                                        {file.file.name}
                                    </p>
                                    <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                                        {formatSize(file.file.size)}
                                    </p>
                                </div>

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(file.id)}
                                    disabled={isProcessing}
                                    className="flex-shrink-0 p-1 rounded hover:bg-red-100 text-[hsl(var(--color-muted-foreground))] hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                    aria-label={`Remove ${file.file.name}`}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            {/* Processing Progress */}
            {isProcessing && (
                <ProcessingProgress
                    progress={progress}
                    status={status}
                    message={progressMessage}
                    onCancel={handleCancel}
                    showPercentage
                />
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleProcess}
                    disabled={!canProcess}
                    loading={isProcessing}
                >
                    {isProcessing
                        ? 'Processing...'
                        : `Process Files`
                    }
                </Button>

                {result && (
                    <DownloadButton
                        file={result as Blob} // TODO: Handle blob arrays if needed
                        filename={resultFilename}
                        variant="secondary"
                        size="lg"
                        showFileSize
                    />
                )}
            </div>

            {/* Success Message */}
            {status === 'complete' && result && (
                <div
                    className="p-4 rounded-[var(--radius-md)] bg-green-50 border border-green-200 text-green-700"
                    role="status"
                >
                    <p className="text-sm font-medium">
                        Files processed successfully! Click the download button to save your file.
                    </p>
                </div>
            )}
        </div>
    );
}
