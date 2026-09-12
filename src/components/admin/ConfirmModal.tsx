'use client'

import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, XCircle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: ReactNode
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  type: 'promote' | 'fail'
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const isPromote = type === 'promote'

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-[101] w-full max-w-md bg-[#001530] rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header Accent */}
        <div className={`h-1.5 w-full ${isPromote ? 'bg-cyan-500 shadow-[0_0_10px_rgba(0,168,232,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`} />
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {isPromote ? (
              <CheckCircle className="text-cyan-400 w-6 h-6" />
            ) : (
              <XCircle className="text-red-400 w-6 h-6" />
            )}
            <h3 className={`text-lg font-black uppercase tracking-widest ${isPromote ? 'text-cyan-400' : 'text-red-400'}`}>
              {title}
            </h3>
          </div>

          <div className="text-zinc-300 text-sm leading-relaxed mb-8">
            {message}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-white hover:bg-white/5 transition-colors border border-transparent"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                isPromote 
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-[#001530] shadow-[0_0_15px_rgba(0,168,232,0.4)]'
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
        
        {/* Close button top right */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>,
    document.body
  )
}
