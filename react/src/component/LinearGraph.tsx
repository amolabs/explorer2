import React from "react"
import {Grid, LinearProgress, makeStyles} from "@material-ui/core"

const useLinearGraphStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
  },
  progress: {
    flexGrow: 1
  },
  title: {
    textAlign: 'left',
    fontSize: '.9rem'
  },
  value: {
    fontSize: '1rem'
  }
}))

type Props = {
  title: string,
  value: string,
  percent: number
  color?: string
}

const LinearGraph = (props: Props) => {
  const classes = useLinearGraphStyle()

  return (
    <Grid
      container
      className={classes.root}
      spacing={1}
    >
      <Grid
        item
        className={classes.progress}
        lg={9}
        md={9}
        xs={6}
      >
        <div className={classes.title}>
          {props.title}
        </div>
        <LinearProgress
          variant="determinate"
          value={props.percent}
        />
      </Grid>
      <Grid
        item
        className={classes.value}
        lg={3}
        md={3}
        xs={6}
      >
        {props.value}
      </Grid>
    </Grid>
  )
}

export default LinearGraph
