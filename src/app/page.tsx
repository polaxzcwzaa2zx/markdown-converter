'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { useDropzone } from 'react-dropzone'
import { FaFileUpload, FaFilePdf, FaFileWord, FaFileAlt, FaTrash, FaCopy, FaDownload, FaLanguage } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreakBefore } from 'docx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// 初始化 i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        title: 'Markdown to PDF Converter',
        subtitle: 'Convert your Markdown files to PDF with ease',
        dropzone: 'Drag and drop your Markdown file here, or click to select',
        preview: 'Preview',
        export: 'Export',
        exportAs: 'Export as',
        copy: 'Copy',
        copied: 'Copied!',
        clear: 'Clear',
        clearConfirm: 'Are you sure you want to clear the content?',
        clearSuccess: 'Content cleared successfully',
        exportSuccess: 'File exported successfully',
        exportError: 'Error exporting file',
        uploadError: 'Error uploading file',
        invalidFile: 'Invalid file type. Please upload a Markdown file.',
        fileTooLarge: 'File is too large. Maximum size is 10MB.',
        noContent: 'No content to export',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Info',
        close: 'Close',
        cancel: 'Cancel',
        confirm: 'Confirm',
        delete: 'Delete',
        edit: 'Edit',
        save: 'Save',
      }
    },
    zh: {
      translation: {
        title: 'Markdown 转 PDF 转换器',
        subtitle: '轻松将 Markdown 文件转换为 PDF',
        dropzone: '拖放 Markdown 文件到这里，或点击选择',
        preview: '预览',
        export: '导出',
        exportAs: '导出为',
        copy: '复制',
        copied: '已复制！',
        clear: '清除',
        clearConfirm: '确定要清除内容吗？',
        clearSuccess: '内容已清除',
        exportSuccess: '文件导出成功',
        exportError: '导出文件时出错',
        uploadError: '上传文件时出错',
        invalidFile: '无效的文件类型。请上传 Markdown 文件。',
        fileTooLarge: '文件太大。最大大小为 10MB。',
        noContent: '没有可导出的内容',
        loading: '加载中...',
        error: '错误',
        success: '成功',
        warning: '警告',
        info: '信息',
        close: '关闭',
        cancel: '取消',
        confirm: '确认',
        delete: '删除',
        edit: '编辑',
        save: '保存',
      }
    }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default function Home() {
  const [markdown, setMarkdown] = useState('')
  const [html, setHtml] = useState('')
  const [lang, setLang] = useState<'en' | 'zh'>('en')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t('fileTooLarge'))
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setMarkdown(content)
        setError('')
        setSuccess('')
      }
      reader.readAsText(file)
    }
  }, [t])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/markdown': ['.md', '.markdown'],
    },
    multiple: false,
  })

  const convertToHtml = () => {
    try {
      const rawHtml = marked.parse(markdown) as string
      const sanitizedHtml = DOMPurify.sanitize(rawHtml)
      setHtml(sanitizedHtml)
      setError('')
      setSuccess(t('success'))
    } catch (err) {
      setError(t('error'))
      setSuccess('')
    }
  }

  const exportToPDF = async () => {
    try {
      setIsLoading(true)
      const html2pdf = (await import('html2pdf.js')).default
      const element = document.createElement('div')
      element.innerHTML = html
      element.style.padding = '20px'
      element.style.fontFamily = 'Arial, sans-serif'
      element.style.lineHeight = '1.6'
      element.style.color = '#333'
      element.style.maxWidth = '800px'
      element.style.margin = '0 auto'
      element.style.backgroundColor = '#fff'
      element.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)'
      element.style.borderRadius = '5px'
      element.style.border = '1px solid #ddd'

      const opt = {
        margin: 1,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      }

      await html2pdf().set(opt).from(element).save()
      setError('')
      setSuccess(t('exportSuccess'))
    } catch (err) {
      setError(t('exportError'))
      setSuccess('')
    } finally {
      setIsLoading(false)
    }
  }

  const exportToDocx = async () => {
    try {
      setIsLoading(true)
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: html.replace(/<[^>]*>/g, ''),
                  size: 24,
                }),
              ],
            }),
          ],
        }],
      })

      const buffer = await Packer.toBlob(doc)
      saveAs(buffer, 'document.docx')
      setError('')
      setSuccess(t('exportSuccess'))
    } catch (err) {
      setError(t('exportError'))
      setSuccess('')
    } finally {
      setIsLoading(false)
    }
  }

  const clearContent = () => {
    if (window.confirm(t('clearConfirm'))) {
      setMarkdown('')
      setHtml('')
      setError('')
      setSuccess('')
      toast.success(t('clearSuccess'))
    }
  }

  const copyContent = () => {
    navigator.clipboard.writeText(markdown)
    toast.success(t('copied'))
  }

  useEffect(() => {
    const userLang = navigator.language.startsWith('zh') ? 'zh' : 'en'
    setLang(userLang)
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              <FaFileUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">{t('dropzone')}</p>
            </div>

            {markdown && (
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={convertToHtml}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <FaFileAlt className="mr-2" />
                    {t('preview')}
                  </button>
                  <button
                    onClick={copyContent}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors flex items-center justify-center"
                  >
                    <FaCopy className="mr-2" />
                    {t('copy')}
                  </button>
                  <button
                    onClick={clearContent}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <FaTrash className="mr-2" />
                    {t('clear')}
                  </button>
                </div>

                {html && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">{t('exportAs')}</h3>
                    <div className="flex space-x-4">
                      <button
                        onClick={exportToPDF}
                        disabled={isLoading}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        <FaFilePdf className="mr-2" />
                        PDF
                      </button>
                      <button
                        onClick={exportToDocx}
                        disabled={isLoading}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        <FaFileWord className="mr-2" />
                        DOCX
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}
          </div>

          {html && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{t('preview')}</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
