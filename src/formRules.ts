import i18n from "./i18n"

export interface IVForm {
  validate: () => boolean
  reset: () => void
}

export const required = (v: string) => !!v || i18n.t("form.required")
export const email = (v: string) => !v || /.+@.+/.test(v) || i18n.t("form.email")
export const numeric = (v: string) => /[0-9]*/.test(v) || i18n.t("form.numeric")
export const max = (n: number) => {
  return (v: string) => v.length <= n || i18n.t("form.max", { n })
}
export const regex = (regex: RegExp) => {
  return (v: string) => regex.test(v) || i18n.t("form.regex")
}
export const digits = (n: number) => {
  return (v: string) => (/[0-9]+/.test(v) && v.length === n) || i18n.t("form.digits", { n })
}
