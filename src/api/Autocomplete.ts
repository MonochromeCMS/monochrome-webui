import Base from "./Base"

export default class Autocomplete extends Base {
  public static readonly router: string = "/autocomplete"

  public static async groups() {
    const response = await Autocomplete._get("/groups", {})

    return Autocomplete._handleResponse<string[]>(response)
  }
}
