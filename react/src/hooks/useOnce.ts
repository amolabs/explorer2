import {useEffect, useState} from 'react'
import {RootState, useUpdateState} from "../reducer"
import {useSelector} from "react-redux"

const useOnce = (fn: (chainId: string) => void) => {
  const {chainId, updated} = useUpdateState()
  const path = useSelector<RootState, string>(state => state.router.location.pathname)
  const [once, setOnce] = useState(false)

  useEffect(() => {
    const [, pathChainId] = path.split('/')
    if (pathChainId === chainId && updated && !once) {
      setOnce(true)
      fn(chainId)
    }

  }, [chainId, updated, path, fn, once])

}

export default useOnce
