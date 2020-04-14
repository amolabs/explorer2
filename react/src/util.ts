const UNIT = 1000000000000000000
const UNITS = ['', 'K', 'M', 'G', 'T']

function convert(mote: number) {
  let amo = mote / UNIT

  let idx = 0
  while (amo >= 1000 && idx < 4) {
    idx++
    amo /= 1000
  }

  return [amo, idx]
}

export function AMO(mote: number) {
  const [amo, idx] = convert(mote)
  return `${Number(amo.toFixed(2)).toLocaleString()}${UNITS[idx]} AMO`
}

export function ActualAMO(mote: number) {
  const [amo, idx] = convert(mote)
  return `${Number(amo).toLocaleString()}${UNITS[idx]} AMO`
}
