const UNIT = 1000000000000000000
const UNITS = ['', 'K', 'M', 'G', 'T']

export function AMO(mote: number) {
  let amo = mote / UNIT

  let idx = 0
  while (amo >= 1000 && idx < 4) {
    idx++
    amo /= 1000
  }

  return `${Number(amo.toFixed(2)).toLocaleString()}${UNITS[idx]} AMO`
}
