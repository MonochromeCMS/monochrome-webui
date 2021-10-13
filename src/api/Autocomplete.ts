import type { ApiResponse } from './Base';
import Base from './Base';

export default class Autocomplete extends Base {
  public static readonly router: string = '/autocomplete';

  public static async groups() {
    const response = await Autocomplete._get('/groups', {});

    const result: ApiResponse<string[]> = Autocomplete._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      default:
        result.error = response.data.detail ?? response.statusText;
    }
    return result;
  }
}
