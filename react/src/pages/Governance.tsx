import React, {createRef, useCallback, useEffect, useState} from 'react'
import StatCard from "../component/StatCard"
import ExplorerAPI from "../ExplorerAPI"
import {useChainId} from "../reducer"
import {makeStyles} from "@material-ui/core/styles"
import Chart from "chart.js"
import {Link} from "react-router-dom"
import useEnsureNetwork from "../hooks/useEnsureNetwork"
import {ArrowForward} from "@material-ui/icons"
import {IconButton} from "@material-ui/core"
import {useDispatch} from "react-redux"
import {push} from "connected-react-router"

type DraftCardProps = {
  draft: Draft
}

const useDraftCardStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  },
  info: {
    '& p': {
      fontSize: '.8rem',
      textAlign: 'left'
    },
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 2,
    '& h6': {
      textAlign: 'left',
      margin: 0
    }
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}))

type DoughnutProps = {
  data: number[],
  labels: string[],
  backgroundColor: string[]
}

const Doughnut = ({data, labels, backgroundColor}: DoughnutProps) => {
  const canvasRef = createRef<HTMLCanvasElement>()

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          datasets: [
            {
              data,
              backgroundColor
            }
          ],
          labels
        }
      })
    }
  }, [data, backgroundColor, labels, canvasRef])

  return (
    <canvas ref={canvasRef}/>
  )
}

const DraftCard = ({draft}: DraftCardProps) => {
  const classes = useDraftCardStyle()
  const chainId = useChainId()
  const dispatch = useDispatch()

  const onIconClick = () => {
    dispatch(push(`/${chainId}/inspect/draft/${draft.draft_id}`))
  }

  const title = (
    <div
      className={classes.title}
    >
      #{draft.draft_id}
      <IconButton color="primary" onClick={onIconClick}>
        <ArrowForward/>
      </IconButton>
    </div>
  )

  return (
    <StatCard
      size="medium"
      title={title}
    >
      <div
        className={classes.root}
      >
        <div className={classes.info}>
          <h6>
            Proposer
          </h6>
          <p>
            <Link to={`/${chainId}/inspect/account/${draft.proposer}`}>{draft.proposer}</Link>
          </p>
          <h6>
            Description
          </h6>
          <p>
            {draft.desc}
          </p>
          <h6>
            Status
          </h6>
          <p>
            {draft.status}
          </p>
        </div>
        <div>
          <Doughnut
            data={[1, 2, 3]}
            labels={["Yes", "No", "?"]}
            backgroundColor={["#48aff0", "#ff7373", "#ad99ff"]}
          />
        </div>
      </div>
    </StatCard>
  )
}

const DraftList = () => {
  const [drafts, setDrafts] = useState<Draft[]>([])

  const fetchDrafts = useCallback((chainId: string) => {
    ExplorerAPI
      .fetchDrafts(chainId, 0)
      .then(({data}) => {
        setDrafts(data)
      })
  }, [])
  useEnsureNetwork(fetchDrafts)

  return (
    <>
      {drafts.map((v) => {
        return (
          <DraftCard
            key={v.draft_id}
            draft={v}
          />
        )
      })}
    </>
  )
}

// const CurrentActiveDraft = () => {
//   // const [draft, setDraft] = useState<Draft>({})
//   // const chainId = useChainId()
//   //
//   // useEffect(() => {
//   //   ExplorerAPI
//   //     .fetchDraft(chainId, 1)
//   //     .then(({data}) => {
//   //       setDraft(data)
//   //     })
//   // }, [])
//   //
//   // return (
//   //   <>
//   //     <DraftCard draft={draft}/>
//   //   </>
//   // )
// }

const Governance = () => {

  return (
    <>
      <DraftList/>
    </>
  )
}

export default Governance
