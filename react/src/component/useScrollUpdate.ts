import {DependencyList, useCallback, useEffect, useState} from "react"
import {AxiosError} from "axios"

type useScrollUpdateReturn<T> = [
  T[], UseScrollLoading, (params: { scrollTop: number }) => void
]

export default function useScrollUpdate<T>(fetcher: (size: number) => Promise<T[] | null>, ref: HTMLDivElement | undefined, deps?: DependencyList): useScrollUpdateReturn<T> {
  const [list, setList] = useState<T[]>([])
  const [loading, setLoading] = useState<UseScrollLoading>('READY')

  const fetch = useCallback(() => {
    if (loading === 'READY') {
      setLoading('FETCH')
      fetcher(list.length)
        .then((data) => {
          if (data === null) {
            setLoading('DONE')
            return
          }

          setList([...list, ...data])
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
          }

          setLoading('READY')
        })
    }
  }, [list, loading, fetcher])

  const onScroll = (params: { scrollTop: number }) => {
    const height = 200 + document.documentElement.clientHeight + params.scrollTop + (ref?.clientHeight || 0)
    if ((height >= document.body.scrollHeight)) {
      fetch()
    }
  }

  useEffect(() => {
    if (list.length === 0 && loading === 'READY') {
      fetch()
    }
  }, [fetch, list, loading])

  return [list, loading, onScroll]
}
