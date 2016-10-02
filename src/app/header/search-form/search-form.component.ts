import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchResult } from './search-result';
import { SpotService } from '../../spots/spot.service';
import { TextTransformService } from '../../shared/text-transform.service';
import { LocationFilterPipe } from './location.pipe';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
	selector: 'search-form',
	templateUrl: './search-form.component.html',
	styleUrls: ['./search-form.component.css'],
    pipes: [LocationFilterPipe],
})
export class SearchFormComponent implements OnInit {
    rotatedCategoryDropdownArrow: boolean = false;
    rotatedCityDropdownArrow: boolean = false;
    category: string = '';
    location: string = '';
	model = new SearchResult('', '');
    cities: string[];
    categories: string[];
    errorMessage: string;

    constructor(
        private _router: Router,
        private _spotService: SpotService,
        private _textTransformService: TextTransformService,
        private _translate: TranslateService,
    ) {

    }

    ngOnInit(): void {
        this._spotService.getCategories()
            .subscribe(categories => {
                         this.getTranslations(categories);
					 },
					 error =>  this.errorMessage = <any>error
            );
        this._spotService.getCities()
            .subscribe(cities => {
						 this.cities = cities;
					 },
					 error =>  this.errorMessage = <any>error
            );
    }
    
    prettify(word: string): string {
        return this._textTransformService.capitalize(word);
    }

    onSubmit() {
        this._translate.use('lt');
        this._translate.get(this.category).subscribe((translation: string) => {
            this.category = translation;
            this._router.navigate(['/spots',  { location: this.location, category: this.category }]);
        });
	}

    showCategories(): void {
        this.rotatedCategoryDropdownArrow = true;
	}

    hideCategories(): void {
        this.rotatedCategoryDropdownArrow = false;
    }

    showCities(): void {
		this.rotatedCityDropdownArrow = true;
	}

    hideCities(): void {
        this.rotatedCityDropdownArrow = false;
    }

    disabledSubmit(): boolean {
        return this.location == '' || this.category == ''
    }

    getTranslations(categories: string[]): void {
        this.categories = new Array();
        this._translate.get(categories).subscribe((translations: string[]) => {
            console.log(translations);
            for (let key in translations) {
                if (translations.hasOwnProperty(key)) {
                    this.categories.push(translations[key]);
                }
            }
        });
    }

	saveCategory(category: string): void {
		this.category = category;
		this.model.category = this.prettify(this.category.toLowerCase());
		this.rotatedCategoryDropdownArrow = !this.rotatedCategoryDropdownArrow;
	}

    saveCity(city: string): void {
        this.location = city;
		this.model.location = this.prettify(this.location.toLowerCase());
		this.rotatedCityDropdownArrow = !this.rotatedCityDropdownArrow;
    }

    parseParams(path: string): void {
		let buff = path.substring(path.indexOf('=')+1);
		this.location = buff.substring(0, buff.indexOf(';'));
		buff = buff.substring(path.indexOf('=')+1).replace(/%20/g, ' ');
		this.category = buff.replace(/%C5%A1/g, 'š');
		console.log(this.location + " " + this.category);
	}
}