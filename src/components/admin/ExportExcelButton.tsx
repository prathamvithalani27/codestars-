'use client'

import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import * as XLSX from 'xlsx'

export function ExportExcelButton({ data }: { data: any[] }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    try {
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Participants")
      XLSX.writeFile(workbook, "CodeUnCode_2026_Participants.xlsx")
    } catch (e) {
      console.error(e)
      alert("Failed to export Excel.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors border border-green-500/50 shadow-lg"
    >
      {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      EXPORT EXCEL
    </button>
  )
}
