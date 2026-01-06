import { useState, useEffect, useCallback } from 'react'
import { getDictDataByCode } from '@/pages/Dictionary/services'
import type { DictData } from '@/pages/Dictionary/types'

export interface DictOption {
  label: string
  value: string
  order?: number
}

interface UseDictOptionsResult {
  options: DictOption[]
  loading: boolean
  error: Error | null
  refresh: () => void
}

/**
 * 根据字典类型编码获取 options 的 Hook
 * @param code 字典类型编码
 * @returns { options, loading, error, refresh }
 *
 * @example
 * const { options, loading } = useDictOptions("priority");
 *
 * <Select options={options} loading={loading} />
 */
export function useDictOptions(code: string): UseDictOptionsResult {
  const [options, setOptions] = useState<DictOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchOptions = useCallback(async () => {
    if (!code) {
      setOptions([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getDictDataByCode(code)
      const sortedData = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      const opts: DictOption[] = sortedData.map((item: DictData) => ({
        label: item.label,
        value: item.value,
        order: item.order
      }))
      setOptions(opts)
    } catch (err) {
      setError(err as Error)
      setOptions([])
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  return {
    options,
    loading,
    error,
    refresh: fetchOptions
  }
}

export default useDictOptions
