import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {ApiQuery} from "../../library/api-query";
import {HomePage} from "../home/home";
import {InAppBrowser} from "@ionic-native/in-app-browser";

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
                public iab: InAppBrowser,
                public api: ApiQuery) {

        api.storage.get('user_id').then((val) => {
            if (val) {
                let browser = this.iab.create('https://m.gobaby.co.il/subscription/?userId=' + val + '&out=2','_blank');

                let that = this;

                let checkStatus = setInterval(
                    function(){
                        console.log('is paying' + that.api.isPaying);
                        if(that.api.isPaying == 1) {
                            clearInterval(checkStatus);
                            setTimeout(
                                function () {
                                    browser.close();
                                }, 10000
                            )
                        }
                    }, 3000);
            }
        });

        this.navCtrl.push(HomePage);
    }

    ionViewDidLoad() {
        this.api.pageName = 'SubscriptionPage';
        console.log('ionViewDidLoad SubscriptionPage');
    }

}
