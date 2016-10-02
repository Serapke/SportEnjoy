import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'locationFilter'
})
export class LocationFilterPipe implements PipeTransform {

    transform(value: string[], filter: string): string[] {
        filter = filter ? filter.toLocaleLowerCase() : null;
        return filter ? value.filter((location: string) =>
            location.toLocaleLowerCase().startsWith(filter)) : value;
    }
}
