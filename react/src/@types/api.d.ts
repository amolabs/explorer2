type AccountSchema = {
  chain_id: string,
  address: string,
  balance: string,
  stake: string,
  val_addr: string,
  delegate: string,
  del_addr?: string,
  val_pubkey: string,
  val_power: string
}

type ValidatorAccount = {
  address: string,
  eff_stake: string,
  owner: string,
  power: string,
  pubkey: string,
  stake: string
}

type BlockStat = {
  chain_id: string,
  last_height: number,
  num_txs: number,
  avg_num_txs: number,
  avg_blk_tx_bytes: number,
  avg_interval: number
}

type TxStat = {
  chain_id: string,
  tx_height: number,
  num_txs: number,
  num_txs_valid: number,
  num_txs_invalid: number
  avg_fee: number,
  avg_tx_bytes: number,
  avg_binding_lag: number,
  max_binding_lag: number
}

type AssetStat = {
  chain_id: string,
  active_coins: string,
  stakes: string,
  delegates: string
}

type BlockchainStat = {
  block_stat: BlockStat
  tx_stat: TxStat
  asset_stat: AssetStat
  height: number,
  time: string,
  tx_height: number,
  tx_index: number
} & BlockStat
  & Pick<TxStat, 'num_txs_valid' | 'num_txs_invalid' | 'avg_binding_lag' | 'max_binding_lag'>
  & AssetStat

type ValidatorStat = {
  avg_blk_incentive: string,
  avg_eff_stake: number,
  total_eff_stakes: number
  num_validators: number
}

type IncentiveStat = {
  avgIncentive: number,
  avgReward: number,
  avgTxFee: number,
  estInterest: number
}
