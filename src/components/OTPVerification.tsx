'use client'

import { useState, useRef, useEffect } from 'react'
import { verifyOtp, resendOtp } from '@/app/actions/auth'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OTPVerificationProps {
  email: string
  onCancel: () => void
  redirectPath: string
}

export default function OTPVerification({ email, onCancel, redirectPath }: OTPVerificationProps) {
  const OTP_LENGTH = 8
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(60)
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pastedData) return

    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
    
    if (pastedData.length < OTP_LENGTH) {
      inputRefs.current[pastedData.length]?.focus()
    } else {
      inputRefs.current[OTP_LENGTH - 1]?.focus()
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    const token = otp.join('')
    if (token.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`)
      return
    }

    setLoading(true)
    setError(null)

    const result = await verifyOtp(email, token)
    
    if (result?.error) {
      if (result.error.toLowerCase().includes('expired')) {
        setError('This verification code has expired. Please request a new one.')
      } else if (result.error.toLowerCase().includes('invalid') || result.error.toLowerCase().includes('token')) {
        setError('Invalid verification code. Please try again.')
      } else {
        setError(result.error)
      }
      setLoading(false)
    } else {
      // Success! Redirect to dashboard or return url
      router.push(redirectPath || '/dashboard')
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return
    
    setResending(true)
    setError(null)
    setResendSuccess(false)
    
    const result = await resendOtp(email)
    
    setResending(false)
    if (result?.error) {
      if (result.error.toLowerCase().includes('rate')) {
        setError('Too many requests. Please wait a moment before trying again.')
      } else {
        setError(result.error)
      }
    } else {
      setResendCooldown(60)
      setResendSuccess(true)
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full flex flex-col items-center"
    >
      <div className="w-16 h-16 bg-blue-900/50 rounded-2xl flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-6">
        <Mail className="text-cyan-400" size={32} />
      </div>
      
      <h2 className="text-center text-3xl font-black text-white tracking-tighter mb-2">
        VERIFY YOUR EMAIL
      </h2>
      
      <p className="text-center text-sm font-medium text-zinc-400 tracking-wide mb-8 max-w-xs">
        We've sent an {OTP_LENGTH}-digit verification code to:<br/>
        <span className="text-cyan-400 font-bold block mt-1">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex justify-center gap-1.5 sm:gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={loading}
              className="w-10 h-12 sm:w-11 sm:h-14 text-center text-xl sm:text-2xl font-black text-white bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all disabled:opacity-50"
            />
          ))}
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 bg-red-900/30 border border-red-500/50 rounded-lg p-3 text-sm text-center font-medium shadow-[0_0_15px_rgba(239,68,68,0.2)] mb-6"
          >
            {error}
          </motion.div>
        )}

        {resendSuccess && !error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 bg-green-900/30 border border-green-500/50 rounded-lg p-3 text-sm text-center font-medium shadow-[0_0_15px_rgba(34,197,94,0.2)] mb-6"
          >
            A new code has been sent to your email.
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading || otp.join('').length < OTP_LENGTH}
          className="group relative flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 px-4 text-sm font-black tracking-widest uppercase text-white hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#023e8a] disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              VERIFY EMAIL
              <ArrowRight className="ml-2" size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center flex flex-col items-center gap-4">
        <div className="text-sm text-zinc-500 flex items-center justify-center">
          <span>Didn't receive the code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            className="ml-2 font-bold text-cyan-400 hover:text-cyan-300 hover:underline underline-offset-4 transition-all disabled:opacity-50 disabled:hover:no-underline disabled:cursor-not-allowed inline-flex items-center"
          >
            {resending ? <Loader2 className="animate-spin" size={14} /> : 'RESEND CODE'}
            {resendCooldown > 0 && ` (${resendCooldown}s)`}
          </button>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="text-sm font-bold text-zinc-400 hover:text-white transition-all underline underline-offset-4 decoration-white/20 hover:decoration-white"
        >
          CHANGE EMAIL
        </button>
      </div>
    </motion.div>
  )
}
