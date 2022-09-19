import { useRouteParams } from '@vueuse/router'

export function useRouteSingleParam(name: string) {
  const param = useRouteParams(name)
  const computedParam = computed(() => {
    if (typeof param.value === 'string')
      return param.value
    else if (param.value)
      return param.value[0] ?? ''
    else
      return ''
  })

  return {
    get value() {
      return computedParam.value
    },
    set value(value: string) {
      param.value = value
    },
  }
}
