import React from 'react'
import {
  Grid,
  Grow,
  Hidden,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useMediaQuery
} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"

const useStyle = makeStyles({
  mobileTableCell: {
    display: 'flex',
    minHeight: '36px',
    lineHeight: '36px',
    padding: '4px 16px',
    height: '100%',
    justifyContent: 'space-between',
    alignContent: 'center',
    borderBottom: 'none'
  },
  mobileTableCellHeader: {
    fontWeight: 600,
  },
  mobileTableCellBody: {
    maxWidth: '150px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block'
  },
  mobileTableRow: {
    '& td:last-child': {
      borderBottom: '1px solid rgba(224, 224, 224, 1)'
    },
    display: 'inline'
  }
})

export type CollapsedTableColumn = {
  key: string,
  header?: React.ReactNode,
  format?: (v: any) => React.ReactNode
}

type Props<T extends StringMap> = {
  dataSource: T[],
  columns: CollapsedTableColumn[]
  rowKey: keyof T
  maxHeight?: string
  pagination?: {
    count: number,
    page: number,
    rowsPerPage: number,
    onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void
  }
}

function CollapseTable<T extends StringMap>(props: Props<T>) {
  const classes = useStyle()
  const isMobile = useMediaQuery('(max-width: 600px)')

  const {
    dataSource,
    columns,
    rowKey,
    maxHeight,
    pagination,
  } = props

  const containerStyle = {
    maxHeight
  }

  const Pagination = pagination && (
    <TablePagination
      {...pagination!}
      rowsPerPageOptions={[pagination!.rowsPerPage]}
      onChangeRowsPerPage={() => {
      }}
      component="div"
    />
  )

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
    >
      <Paper>
        {Pagination}
        <TableContainer style={containerStyle}>
          <Table stickyHeader={true}>
            <Hidden only={['xs']}>
              <TableHead
                component={"thead"}
              >
                {
                  columns.map((c, i) => (
                    <TableCell key={i} align="center">
                      {c.header || c.key.toUpperCase()}
                    </TableCell>
                  ))
                }
              </TableHead>
            </Hidden>
            <TableBody>
              {
                dataSource.map((v, i) => (
                  <Grow
                    key={v[rowKey]}
                    in={true}
                    timeout={50 * (dataSource.length - i)}
                    style={{transformOrigin: 'top'}}
                  >
                    <TableRow className={isMobile ? classes.mobileTableRow : ''}>
                      {columns.map((c) => {
                        const value = c.format ? c.format(v[c.key]) : v[c.key]

                        return (
                          <TableCell key={c.key} align="center" className={isMobile ? classes.mobileTableCell : ''}>
                            <Hidden only={['xs']}>
                              {value}
                            </Hidden>
                            <Hidden only={['sm', 'md', 'lg', 'xl']}>
                              <div className={isMobile ? classes.mobileTableCellHeader : ''}>
                                {c.header || c.key.toUpperCase()}
                              </div>
                              <div className={isMobile ? classes.mobileTableCellBody : ''}>
                                {value}
                              </div>
                            </Hidden>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  </Grow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        {Pagination}
      </Paper>
    </Grid>
  )
}

export default CollapseTable
