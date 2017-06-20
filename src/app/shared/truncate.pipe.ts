import { Pipe } from '@angular/core'

@Pipe({
  name: 'truncate'
})
export class TruncatePipe {
  transform(value: string, limit: number) : string {
    if (limit == 0) return value;
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
