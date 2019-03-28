import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {ApiQuery} from "../../library/api-query";
import {HomePage} from "../home/home";

/**
 * Generated class for the SubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-subscription',
    templateUrl: 'subscription.html',
})
export class SubscriptionPage {

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery) {
        api.storage.get('user_id').then((val) => {
            if (val) {
                window.open('https://www.gobaby.co.il/newpayment/?userId=' + val + '&out=1', '_system');
            }
        });

        this.navCtrl.push(HomePage);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SubscriptionPage');
    }

}
