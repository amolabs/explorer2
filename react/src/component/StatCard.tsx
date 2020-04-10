import React, {createRef, MutableRefObject, PropsWithChildren, PropsWithRef, RefObject} from 'react'
import {Grid} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints"
import {GridSize} from "@material-ui/core/Grid/Grid"

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
    width: '100%',
    border: '0',
    display: 'flex',
    position: 'relative',
    fontSize: '.875rem',
    minWidth: '0',
    wordWrap: 'break-word',
    background: theme.palette.background.paper,
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.14)',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: '6px',
    flexDirection: 'column'
  },
  header: {
    textAlign: 'right',
    background: 'transparent',
    boxShadow: 'none',
    color: theme.palette.text.primary,
    margin: '0 15px',
    padding: '0',
    position: 'relative'
  },
  title: {
    color: theme.palette.text.secondary,
    margin: '0',
    marginTop: '0',
    paddingTop: '10px',
    marginBottom: '0'
  },
  stat: {
    color: theme.palette.text.primary,
    minHeight: 'auto',
    fontWeight: 300,
    textDecoration: 'none'
  },
  pos: {
    marginBottom: 12,
  },
  icon: {
    float: 'left',
    padding: '15px',
    marginTop: '-20px',
    marginRight: '15px',
    borderRadius: '3px',
    backgroundColor: '#999',
    boxShadow: '0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 152, 0,.4)',
    background: 'linear-gradient(60deg, #ffa726, #fb8c00)'
  },
}))

type Props = {
  icon: React.ReactNode
  title: React.ReactNode
  suffix?: string
  color?: string
  size?: 'small' | 'medium' | 'large'
  setRef?: (instance?: HTMLDivElement) => void
}

const cardSize: { [k: string]: Partial<Record<Breakpoint, boolean | GridSize>> } = {
  'small': {
    lg: 3,
    md: 6,
    sm: 12,
    xs: 12
  },
  'medium': {
    lg: 6,
    md: 12,
    sm: 12,
    xs: 12
  },
  'large': {
    lg: 12,
    md: 12,
    sm: 12,
    xs: 12,
  }
}

const StatCard = (props: PropsWithChildren<Props>) => {
  const classes = useStyles()
  const size = props.size || 'small'
  const color = props.color || '#42a5f5'
  const iconTheme: React.CSSProperties = {
    boxShadow: `0 4px 20px 0 rgba(0, 0, 0, .14), 0 7px 10px -5px ${color}`,
    background: `${color}`,
    color: "white"
  }

  return (
    <Grid
      item
      style={{
        padding: '0 5px !important'
      }}
      {...cardSize[size]}
      ref={(node) => {
        if (node) {
          props.setRef && props.setRef(node)
        }
      }}
    >
      <div className={classes.root}>
        <div className={classes.header}>
          {
            props.size !== 'large' && (
              <div className={classes.icon} style={iconTheme}>
                {props.icon}
              </div>
            )
          }
          <p className={classes.title} style={{
            fontSize: size === 'small' ? '14px' : '26px'
          }}>
            {props.title}
          </p>
          <h1 className={classes.stat}>
            {props.children}
            {props.suffix && <small>&nbsp;{props.suffix}</small>}
          </h1>
        </div>
      </div>
    </Grid>
  )
}

export default StatCard
