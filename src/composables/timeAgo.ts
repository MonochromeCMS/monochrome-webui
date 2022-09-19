type TimeFormatUnit =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year'

interface TimeUnitSchema {
  max: number
  value: number
  name: TimeFormatUnit
}

const TIME_UNITS: TimeUnitSchema[] = [
  { max: 60000, value: 1000, name: 'second' },
  { max: 2760000, value: 60000, name: 'minute' },
  { max: 72000000, value: 3600000, name: 'hour' },
  { max: 518400000, value: 86400000, name: 'day' },
  { max: 2419200000, value: 604800000, name: 'week' },
  { max: 28512000000, value: 2592000000, name: 'month' },
  { max: Infinity, value: 31536000000, name: 'year' },
]

function getTimeago(from: Date, now: Date) {
  const diff = +from - +now
  const absDiff = Math.abs(diff)

  for (const unit of TIME_UNITS) {
    if (absDiff < unit.max)
      return { diff: Math.ceil(diff / unit.value), unit: unit.name }
  }

  return { diff: NaN, unit: 'year' as TimeFormatUnit }
}

export function useAgo(timestamp: Date, updateInterval = 30_000) {
  const { locale } = useI18n()
  const now = useNow({ interval: updateInterval })

  const diff = computed(() => getTimeago(timestamp, now.value))
  const formatter = computed(
    () => new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' }),
  )

  const agoText = computed(() =>
    formatter.value.format(diff.value.diff, diff.value.unit),
  )

  return agoText
}
