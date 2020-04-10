import React, {useCallback, useMemo, useState} from 'react'
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Column as TableColumn,
  Index,
  Table,
  TableCellRenderer,
  TableHeaderProps,
  WindowScroller
} from "react-virtualized"
import {makeStyles} from "@material-ui/styles"
import {Grid, TableCell, useMediaQuery} from "@material-ui/core"
import clsx from "clsx"

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
  },
  tableCell: {
    flex: '1 1 auto',
  },
  collapsedCell: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between'
  },
  collapsedCellWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  collapsedCellHeader: {
    fontWeight: 600
  },
  collapsedCellBody: {
    maxWidth: '50vw',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    justifyContent: 'center'
  },
  table: {
    '& .ReactVirtualized__Table__row, & .ReactVirtualized__Table__headerRow': {
      display: 'flex'
    }
  }
}))

type Column = {
  key: string
  label: string
  width: number
  flexGrow?: number
  columnData?: {
    format?: (v: any) => React.ReactNode
  }
}

interface Props<T> {
  onScroll: (params: { scrollLeft: number, scrollTop: number }) => void
  columns: Column[]
  rowKey: string
  data: T[]
}

function InfinityTable<T>(props: Props<T>) {
  const classes = useInfinityScrollStyle()

  const breakMD = useMediaQuery('(max-width: 960px)')
  const [recentWidth, setRecentWidth] = useState<number | undefined>(undefined)
  const cache = useMemo(() => {
    return new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 60
    })
  }, [])

  const cellRenderer: TableCellRenderer = ({cellData, columnIndex, columnData, parent}) => {
    const format = columnData ? columnData['format'] : undefined

    return (
      <CellMeasurer
        cache={cache}
        parent={parent}
      >
        <TableCell
          component="div"
          variant="body"
          className={clsx(classes.tableCell, classes.flexContainer)}
          style={{height: `60px`}}
        >
          {format ? format(cellData) : cellData}
        </TableCell>
      </CellMeasurer>
    )
  }

  const collapsedCellRender: TableCellRenderer = ({rowData, parent}) => {
    return (
      <CellMeasurer
        cache={cache}
        parent={parent}
      >
        <TableCell
          component="div"
          variant="body"
          className={clsx(classes.tableCell, classes.flexContainer)}
          style={{height: `150px`}}
        >
          <div className={classes.collapsedCell}>
            {props.columns.map((c, i) => (
              <div key={i} className={classes.collapsedCellWrapper}>
                <div className={classes.collapsedCellHeader}>
                  {c.label}
                </div>
                <div className={classes.collapsedCellBody}>
                  {rowData[c.key]}
                </div>
              </div>
            ))}
          </div>
        </TableCell>
      </CellMeasurer>
    )
  }

  const headerRenderer = ({label}: TableHeaderProps & { columnIndex: number }) => {
    return (
      <TableCell
        component="div"
        variant="head"
        className={clsx(classes.tableCell, classes.flexContainer)}
        style={{height: `${breakMD ? 0 : 50}px`}}
      >
        <span>{label}</span>
      </TableCell>
    )
  }

  const rowGetter = ({index}: Index) => {
    return props.data[index]
  }

  return (
    <Grid
      item
      lg={12}
      md={12}
      sm={12}
      xs={12}
    >
      <WindowScroller
        scrollElement={window}
        onScroll={props.onScroll}
      >
        {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
          <div className={classes.wrapper}>
            <AutoSizer disableHeight>
              {({width}) => {
                if (width !== recentWidth) {
                  // FIXME Do not use setState in this scope
                  // This logic prevents wrong rendering after width of window changed
                  // https://codesandbox.io/s/qlqkx2mrz4?file=/window-scroller.js:725-959
                  setRecentWidth(width)
                  cache.clearAll()
                }

                return (
                  <div
                    ref={registerChild}
                  >
                    <Table
                      autoHeight
                      height={height}
                      rowCount={props.data.length}
                      rowHeight={breakMD ? 150 : 60}
                      headerHeight={breakMD ? 0 : 50}
                      onScroll={onChildScroll}
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      width={width}
                      rowGetter={rowGetter}
                      gridStyle={{
                        direction: 'inherit'
                      }}
                      className={classes.table}
                    >
                      {breakMD ? (
                        <TableColumn
                          width={100}
                          flexGrow={1}
                          key={'hash'}
                          dataKey={'hash'}
                          cellRenderer={collapsedCellRender}
                          className={classes.flexContainer}
                          headerRenderer={(headerProps) => headerRenderer({
                            ...headerProps,
                            columnIndex: 0
                          })}
                        />
                      ) : (
                        props.columns.map(({key, ...other}, index) => {
                          return (
                            <TableColumn
                              key={key}
                              dataKey={key}
                              cellRenderer={cellRenderer}
                              className={classes.flexContainer}
                              headerRenderer={(headerProps) => headerRenderer({
                                ...headerProps,
                                columnIndex: index
                              })}
                              {...other}
                            />
                          )
                        })
                      )}
                    </Table>
                  </div>
                )
              }}
            </AutoSizer>
          </div>
        )}
      </WindowScroller>
    </Grid>
  )
}

export default InfinityTable

type Loading = 'ready' | 'fetch' | 'done'

export function useScrollUpdate<T>(fetcher: (size: number) => Promise<T[]>, threshold: number = 200): [
  T[],
  (list: T[]) => void,
  Loading,
  (loading: Loading) => void,
  (params: { scrollTop: number }) => void
] {
  const [list, setList] = useState<T[]>([])
  const [loading, setLoading] = useState<Loading>('ready')

  const onScroll = useCallback((params: { scrollTop: number }) => {
    const height = document.documentElement.clientHeight + params.scrollTop + threshold
    if ((height >= document.body.scrollHeight) && loading === 'ready') {
      setLoading('fetch')
      fetcher(list.length)
        .then((data) => {
          setList([...list, ...data])
          setTimeout(() => {
            setLoading('ready')
          }, 400)
        })
    }
  }, [list, loading, threshold])

  return [list, setList, loading, setLoading, onScroll]
}
