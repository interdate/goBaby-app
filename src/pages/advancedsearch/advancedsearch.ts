import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {Http} from "@angular/http";
import {ApiQuery} from "../../library/api-query";
import {AdvancedSearchResultPage} from "../advanced-search-result/advanced-search-result";
import {SelectPage} from "../select/select";

/**
 * Generated class for the AdvancedsearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-advancedsearch',
    templateUrl: 'advancedsearch.html',
})
export class AdvancedsearchPage {

    form: any;

    ageLower: any = 20;
    ageUpper: any = 50;

    ages: any[] = [];

    height: any[] = [];

    default_range: any = {lower: this.ageLower, upper: this.ageUpper};

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public http: Http,
                public api: ApiQuery) {

        this.http.get(api.url + '/user/advanced/search', api.setHeaders(true)).subscribe(data => {

            this.form = data.json().form;
            this.form.heightFrom.value = '';
            this.form.heightTo.value = '';

            for (let i = 100; i <= 250; i++) {
                this.height.push(i);
            }

            for (let i = 18; i <= 80; i++) {
                this.ages.push(i);
            }
        }, err => {
            console.log("Oops!");
        });
    }

    toSearchResultsPage() {
        let params = JSON.stringify({
            action: 'search',
            list: '',
            filter: 'lastActivity',
            page: 1,
            advanced_search: {
                ageFrom: this.form.age.valueFrom,
                ageTo: this.form.age.valueTo,
                body: this.form.body.value,
                drinking: this.form.drinking.value,
                education: this.form.education.value,
                ethnicity: this.form.ethnicity.value,
                eyesColor: this.form.eyesColor.value,
                food: this.form.food.value,
                hairColor: this.form.hairColor.value,
                hairLength: this.form.hairLengthId.value,
                heightFrom: this.form.heightFrom.value,
                heightTo: this.form.heightTo.value,
                income: this.form.income.value,
                maritalStatus: this.form.maritalStatus.value,
                occupation: this.form.occupation.value,
                portability: this.form.portability.value,
                purpose: this.form.purpose.value,
                region: this.form.region.value,
                religion: this.form.religion.value,
                sexPref: this.form.sexPref.value,
                smoking: this.form.smoking.value,
                sport: this.form.sport.value,
                children: this.form.userChildren.value,
                city: this.form.userCityName.value,
                interests: this.form.userInterests.value,
                withPhotos: this.form.withPhotos.value
            }
        });
        this.navCtrl.push(AdvancedSearchResultPage, {params: params});
    }

    ionViewWillEnter() {
        this.api.pageName = 'AdvancedSearchPage';
    }

    openSelect(field, index) {
        if (typeof field == 'undefined') {
            field = false;
        }

        let profileModal = this.api.modalCtrl.create(SelectPage, {data: field});
        profileModal.present();

        profileModal.onDidDismiss(data => {
            if (data) {
                let choosedVal = data.val.toString();
                this.form.fields[index]['valLabel'] = data.label.toString();

            }
        });
    }

    /*selectedRegion() {
     this.http.get(this.api.url + '/search?advanced=1&advanced_search[region]=' + this.form.region.value, this.api.setHeaders(true)).subscribe(data => {
     this.form.area = data.json().area;
     }, err => {
     console.log("Oops!");
     });
     }*/

    getAgeValues(event) {
        if (event.value.upper != 0) {
            this.ageUpper = event.value.upper;
        }
        if (event.value.lower != 0) {
            this.ageLower = event.value.lower;
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AdvancedSearchPage');
    }
}
