import React from 'react'
import StatCard from "./StatCard"
import {CollapsedTableColumn} from "./CollapseTable"
import {makeStyles, Theme} from "@material-ui/core/styles"

const useStyle = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '10px',
    fontSize: '14px',
    wordBreak: 'break-all'
  },
  header: {
    width: '240px'
  },
  body: {
    flex: '1 1 auto'
  }
}))

type InformationCardProps<T extends StringMap> = {
  title: React.ReactNode,
  columns: CollapsedTableColumn[],
  data: T
}

const InformationCard = function <T extends StringMap>(props: InformationCardProps<T>) {
  const classes = useStyle()

  const {
    title,
    columns,
    data
  } = props

  return (
    <StatCard
      title={title}
      size="large"
      alignLeft
    >
      {
        columns.map((c, i) => {
          const value = c.format ? c.format(data[c.key]) : data[c.key]

          return (
            <div className={classes.wrapper}>
              <div className={classes.header}>
                {c.header}
              </div>
              <div className={classes.body}>
                {value}
              </div>
            </div>
          )
        })
      }
    </StatCard>
  )
}

export default InformationCard
