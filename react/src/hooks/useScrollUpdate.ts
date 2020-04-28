import {useCallback, useEffect, useState} from "react"
import {AxiosError} from "axios"
import {useFixedHeight} from "../reducer"

type useScrollUpdateReturn<T> = [
  T[], UseScrollLoading, (params: { scrollTop: number }) => void
]

export default function useScrollUpdate<T>(
  fetcher: (size: number, fixedHeight: number, chainId: string) => Promise<T[] | null>,
  ref: HTMLDivElement | undefined,
  fetchSize: number = 20
): useScrollUpdateReturn<T> {
  const [list, setList] = useState<T[]>([])
  const [loading, setLoading] = useState<UseScrollLoading>('READY')
  const {fixedHeight, chainId} = useFixedHeight()

  const fetch = useCallback(() => {
    if (loading === 'READY') {
      setLoading('FETCH')
      fetcher(list.length, fixedHeight, chainId)
        .then((data) => {
          if (data === null) {
            return
          }

          setList([...list, ...data])
          if (data.length < fetchSize) {
            setLoading('DONE')
            return
          }

          setTimeout(() => {
            setLoading('READY')
          }, 300)
        })
        .catch((e: AxiosError) => {
          if (e.isAxiosError) {
            if (e.message.indexOf(('timeout')) !== -1) {
              setLoading('DONE')
              return
            }

            if (e.response?.status === 404) {
              setLoading('DONE')
              return
            }
          }

          setLoading('READY')
        })
    }
  }, [list, loading, fetcher, fetchSize, fixedHeight, chainId])

  const onScroll = (params: { scrollTop: number }) => {
    const height = 200 + document.documentElement.clientHeight + params.scrollTop + (ref?.clientHeight || 0)
    if ((height >= document.body.scrollHeight)) {
      fetch()
    }
  }

  useEffect(() => {
    if (fixedHeight !== -1 && list.length === 0 && loading === 'READY') {
      fetch()
    }
  }, [fetch, list, loading, fixedHeight])

  return [list, loading, onScroll]
}
