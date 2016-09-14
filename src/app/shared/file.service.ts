import { Injectable } from '@angular/core';
import { ISpot } from '../spots/spot';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileService {

	read(inputValue: any, spot: ISpot): Observable<string> {
		return new Observable<string>(observer => {
			var file:File = inputValue.files[0];
	    var myReader:FileReader = new FileReader();

	    myReader.onloadend = (e) => {
				var image = myReader.result;
				spot.images = image;
				observer.next(image);
				observer.complete();
	    }

			myReader.readAsDataURL(file);
		});
  }
}
