import { Injectable } from '@angular/core';

@Injectable()
export class TextTransformService {
	capitalize(word: string): string {
		if (word && word.length >= 1) {
			var firstChar = word.charAt(0);
			var remainingStr = word.slice(1);
			return firstChar.toUpperCase() + remainingStr;
		}
		return word;
	}
}
