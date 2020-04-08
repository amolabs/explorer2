import React, {useCallback, useEffect, useState} from 'react'
import {AutoSizer, List, WindowScroller} from "react-virtualized"
import {makeStyles} from "@material-ui/styles"
import {BlockState} from "../reducer/blocks"
import {useSelector} from "react-redux"
import {RootState} from "../reducer"
import Axios from "axios"
import {BlockchainState} from "../reducer/blockchain"
import {Grow, Snackbar} from "@material-ui/core"
import {ListRowProps} from "react-virtualized/dist/es/List"

const useInfinityScrollStyle = makeStyles(() => ({
  wrapper: {
    flex: '1 1 auto'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #e0e0e0',
    padding: '0 25px',
    alignItems: 'center'
  }
}))

type Loading = 'ready' | 'fetch' | 'done'

function useScrollUpdate<T>(fetcher: () => Promise<T[]>, threshold: number = 200): [
  T[],
  (list: T[]) => void,
  boolean,
  (params: { scrollTop: number }) => void
] {
  const [list, setList] = useState<T[]>([])
  const [loading, setLoading] = useState<Loading>('ready')

  const onScroll = (params: { scrollTop: number }) => {
    const height = document.documentElement.clientHeight + params.scrollTop + threshold
    if ((height >= document.body.scrollHeight) && loading === 'ready') {
      setLoading('fetch')
      fetcher()
        .then((data) => {
          console.log(data)
          setList([...list, ...data])
          setTimeout(() => {
            setLoading('ready')
          }, 500)
        })
    }
  }

  return [list, setList, loading === 'fetch', onScroll]
}

const Blocks = () => {
  const [ref, setRef] = useState()

  const classes = useInfinityScrollStyle()

  const {height: blockHeight, chain_id} = useSelector<RootState, BlockchainState>(state => state.blockchain.blockState)

  const [loadedHeight, setLoadedHeight] = useState(0)
  const [blocks, setBlocks, open, onScroll] = useScrollUpdate<BlockState>(async () => {
    const {data} = await Axios.get(`http://explorer.amolabs.io/api/chain/${chain_id}/blocks?from=${blockHeight - 20}&num=20&order=desc`)
    return data
  })

  useEffect(() => {
    Axios
      .get(`http://explorer.amolabs.io/api/chain/${chain_id}/blocks?from=${blockHeight}&num=20&order=desc`)
      .then(({data}) => {
        setBlocks(data)
      })
  }, [blockHeight])

  const renderRow = useCallback((props: ListRowProps) => {
    return (
      <div className={classes.row} key={props.key} style={props.style}>
        {blocks[props.index].hash}
      </div>
    )
  }, [blocks])

  return (
    <>
      <WindowScroller
        ref={setRef}
        scrollElement={window}
        onScroll={onScroll}
      >
        {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
          <div className={classes.wrapper}>
            <AutoSizer
              disableHeight
            >
              {({width}) => (
                <div ref={registerChild}>
                  <List
                    autoHeight
                    height={height}
                    rowCount={blocks.length}
                    overscanColumnCount={2}
                    rowHeight={100}
                    rowRenderer={renderRow}
                    onScroll={onChildScroll}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                    width={width}
                  />
                </div>
              )}
            </AutoSizer>
          </div>
        )}
      </WindowScroller>
      <Snackbar
        message="Loading blocks..."
        open={open}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        TransitionComponent={Grow}
      />
    </>
  )
}

export default Blocks
