import React, {useCallback, useMemo, useState} from 'react'
import InformationCard from "../../component/InformationCard"
import ExplorerAPI from "../../ExplorerAPI"
import {useParams} from 'react-router-dom'
import {AxiosError} from "axios"
import {useDispatch} from "react-redux"
import {replace} from "connected-react-router"
import useEnsureNetwork from "../../hooks/useEnsureNetwork"
import {displayAddress} from "../../util"
import {CollapsedTableColumn} from "../../component/CollapseTable"

const configNameMapping: { [k: string]: string } = {
  max_validators: 'Max Validators',
  weight_validator: 'Weight Validator',
  weight_delegator: 'Weight Delegator',
  min_staking_unit: 'Min Staking Unit',
  blk_reward: 'Block Reward',
  tx_reward: 'Transaction Reward',
  penalty_ratio_m: 'Penalty Ratio Malicious',
  penalty_ratio_l: 'Penalty Ratio Lazy',
  laziness_counter_window: 'Laziness Counter Window',
  laziness_threshold: 'Laziness Threshold',
  block_binding_window: 'Block Binding Window',
  lockup_period: 'Lockup Period',
  draft_open_count: 'Draft Open Count',
  draft_close_count: 'Draft Close Count',
  draft_apply_count: 'Draft Apply Count',
  draft_deposit: 'Draft Deposit',
  draft_quorum_rate: 'Draft Quorum Rate',
  draft_pass_rate: 'Draft Pass Rate',
  draft_refund_rate: 'Draft Refund Rate',
  upgrade_protocol_height: 'Upgrade Protocol Height',
  upgrade_protocol_version: 'Upgrade Protocol Version'
}

const columns = [
  {
    key: 'draft_id',
    header: 'Draft Id'
  },
  {
    key: 'proposer',
    header: 'Proposer',
    format: displayAddress
  },
  {
    key: 'status',
    header: 'Status'
  },
  {
    key: 'open_count',
    header: 'Open Count'
  },
  {
    key: 'close_count',
    header: 'Close Count'
  }
]

const descriptionColumn = [
  {
    key: 'desc',
    header: 'Description'
  }
]

interface ObjectConfigDraft extends Draft {
  config: DraftConfig
}

const Draft = () => {
  const {id} = useParams()

  const [draft, setDraft] = useState<ObjectConfigDraft>({
    apply_count: 0,
    chain_id: "",
    close_count: 0,
    config: {},
    deposit: "",
    desc: "",
    draft_id: 0,
    open_count: 0,
    proposed_at: 0,
    proposer: "",
    status: "",
    tally_approve: "",
    tally_deposit: "",
    tally_reject: ""
  })
  const configColumns = useMemo(() => {
    const configColumns: CollapsedTableColumn<any>[] = []
    for (const key of Object.keys(draft.config)) {
      configColumns.push({
        key,
        header: configNameMapping[key]
      })
    }
    return configColumns
  }, [draft.config])

  const [statLoading, setStatLoading] = useState(true)
  const dispatch = useDispatch()

  const fetchAccount = useCallback((chainId: string) => {
    ExplorerAPI
      .fetchDraft(chainId, Number(id))
      .then(({data}) => {
        let config = data.config as string

        // Anti-Corruption
        if (config.charAt(0) === '"' && config.charAt(config.length - 1) === '"') {
          config = config.slice(1, config.length - 1).replace(/\\"/g, '"')
        }

        setDraft({
          ...data,
          config: JSON.parse(config)
        })
        setStatLoading(false)
      })
      .catch((e: AxiosError) => {
        console.error(e)
        dispatch(replace(`/${chainId}/inspect/404`, {type: 'DRAFT', search: draft}))
        setStatLoading(false)
      })
  }, [id, dispatch])
  useEnsureNetwork(fetchAccount)

  return (
    <>
      <InformationCard
        title="Draft information"
        columns={columns}
        data={draft}
        divider
        loading={statLoading}
      />
      <InformationCard
        columns={descriptionColumn}
        data={draft}
      />
      <InformationCard
        title="Proposed config"
        divider
        columns={configColumns}
        data={draft.config}
      />
    </>
  )
}

export default Draft
