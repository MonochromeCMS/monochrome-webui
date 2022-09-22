import { useRouteParams } from '@vueuse/router'

export function useRouteSingleParam(name: string) {
  const param = useRouteParams(name)
  const computedParam = computed({
    get() {
      if (typeof param.value === 'string')
        return param.value
      else if (param.value)
        return param.value[0] ?? ''
      else
        return ''
    },
    set(value: string) {
      param.value = value
    },
  })

  return computedParam
}
