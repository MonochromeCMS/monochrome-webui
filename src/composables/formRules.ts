import i18n from '@/plugins/i18n'

export const required = (v: string) => !!v || i18n.global.t('form.required')
export const email = (v: string) =>
  !v || /.+@.+/.test(v) || i18n.global.t('form.email')
export const numeric = (v: string) =>
  /[0-9]*/.test(v) || i18n.global.t('form.numeric')
export const max = (n: number) => {
  return (v: string) => v.length <= n || i18n.global.t('form.max', { n })
}
export const regex = (regex: RegExp) => {
  return (v: string) => regex.test(v) || i18n.global.t('form.regex')
}
export const digits = (n: number) => {
  return (v: string | number) => {
    if (typeof v === 'number')
      v = v.toString()
    return (
      (/[0-9]+/.test(v) && v.length === n)
      || i18n.global.t('form.digits', { n })
    )
  }
}
