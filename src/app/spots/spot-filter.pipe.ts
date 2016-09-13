import { PipeTransform, Pipe } from '@angular/core';
import { ISpot } from './spot';

@Pipe({
    name: 'spotFilter'
})
export class SpotFilterPipe implements PipeTransform {

    transform(value: ISpot[], filter: string): ISpot[] {
        filter = filter ? filter.toLocaleLowerCase() : null;
        return filter ? value.filter((spot: ISpot) =>
            spot.title.toLocaleLowerCase().indexOf(filter) !== -1) : value;
    }
}
