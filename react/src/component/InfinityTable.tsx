import React from 'react'
import {
  AutoSizer,
  Column as TableColumn,
  Index,
  Table,
  TableCellRenderer,
  TableHeaderProps,
  WindowScroller
} from "react-virtualized"
import {makeStyles} from "@material-ui/styles"
import {TableCell, useMediaQuery} from "@material-ui/core"
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
    boxSizing: 'border-box'
  },
  table: {
    '& .ReactVirtualized__Table__row, & .ReactVirtualized__Table__headerRow': {
      display: 'flex'
    },
  }
}))

type Column = {
  key: string
  label: string
  width: number
  flexGrow?: number
  format?: (v: any) => React.ReactNode
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

  const cellRenderer: TableCellRenderer = ({cellData, columnIndex}) => {
    return (
      <TableCell
        component="div"
        variant="body"
        className={clsx(classes.tableCell, classes.flexContainer)}
        style={{height: `70px`}}
      >
        {cellData}
      </TableCell>
    )
  }

  const collapsedCellRender: TableCellRenderer = ({rowData}) => {
    console.log(rowData)

    return (
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
    )
  }

  const headerRenderer = ({label, columnIndex}: TableHeaderProps & { columnIndex: number }) => {
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
    <WindowScroller
      scrollElement={window}
      onScroll={props.onScroll}
    >
      {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
        <div className={classes.wrapper}>
          <AutoSizer
            disableHeight
          >
            {({width}) => (
              <div ref={registerChild}>
                <Table
                  autoHeight
                  height={height}
                  rowCount={props.data.length}
                  rowHeight={breakMD ? 150 : 70}
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
            )}
          </AutoSizer>
        </div>
      )}
    </WindowScroller>
  )
}

export default InfinityTable
