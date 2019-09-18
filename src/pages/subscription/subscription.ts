import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, Platform} from "ionic-angular";
import {ApiQuery} from "../../library/api-query";
import {HomePage} from "../home/home";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {InAppPurchase} from "@ionic-native/in-app-purchase";
import {Page} from "../page/page";


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

    public products: any = [];
    public dataPage : any;
    public platform: any = 'ios';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public iab: InAppBrowser,
                public plt: Platform,
                public iap: InAppPurchase,
                public api: ApiQuery) {

        this.getPage();
        this.getRestore();
    }

    getRestore(){
        var that = this;
        this.iap.restorePurchases().then(function (data) {
            //this.restore = data;
            console.log(data);
            /*
             [{
             transactionId: ...
             productId: ...
             state: ...
             date: ...
             }]
             */

            var purchase = {};

            var timestemp = 0;

            for (var id in data) {

                var dateProd = new Date(data[id].date).getTime();

                if(dateProd > timestemp){

                    timestemp = dateProd;

                    purchase = data[id];
                }
            }

            that.sendSubscribe(purchase);
        }).catch(function (err) {
            console.log('getRestore' + JSON.stringify(err));
        });
    }

    getPage() {
        this.api.showLoad();
        this.api.http.get(this.api.url + '/user/subscriptions', this.api.setHeaders(true)).subscribe(data => {
            this.dataPage = data.json().subscription;
            //console.log(this.products);
            if (this.plt.is('android')) {
                this.platform = 'android';
                this.products = data.json().subscription.payments;
                this.api.hideLoad();
                this.api.storage.get('user_id').then((val) => {
                    if (val) {
                        let browser = this.iab.create('https://m.gobaby.co.il/subscription/?userId=' + val + '&out=2&mobile=2','_blank','location=no');

                        let that = this;

                        let checkStatus = setInterval(
                            function(){
                                if(that.api.isPaying == 1) {
                                    clearInterval(checkStatus);
                                    setTimeout(
                                        function () {
                                            browser.close();
                                        }, 4000
                                    )
                                }
                            }, 3000);
                    }
                });

                this.navCtrl.push(HomePage);

            } else {
                this.products = [];
                this.platform = 'ios';

                let productsList = ['gobaby.oneWeek','gobaby.oneMonth'/*, 'gobaby.threeMonth','gobaby.sixMonth', 'gobaby.oneYear'*/];

                this.iap
                    .getProducts(productsList)
                    .then((products) => {
                        this.api.hideLoad();
                        products.forEach(product => {

                            if(product.productId == 'gobaby.oneWeek'){
                                product.id = 0;
                                product.title = 'מנוי שבועי מתחדש';
                                product.description = 'מנוי מתחדש כל שבוע המאפשר לך לקרוא הודעות ללא הגבלה';
                            }
                            if(product.productId == 'gobaby.oneMonth'){
                                product.id = 1;
                                //product.title = 'חודשי מתחדש';
                                product.title = 'מנוי חודשי מתחדש';
                                product.description = 'מנוי מתחדש כל חודש המאפשר לך לקרוא הודעות ללא הגבלה';
                            }
                            /*if(product.productId == 'gobaby.threeMonth'){
                                product.id = 2;
                                product.title = 'מנוי תלת חודשי מתחדש';
                                product.description = 'מנוי מתחדש כל 3 חודשים המאפשר לך לקרוא הודעות ללא הגבלה';
                            }
                            if(product.productId == 'gobaby.sixMonth'){
                                product.id = 3;
                                product.title = 'מנוי חצי שנתי מתחדש';
                                product.description = 'מנוי מתחדש כל 6 חודשים המאפשר לך לקרוא הודעות ללא הגבלה';
                            }
                            if(product.productId == 'gobaby.oneYear'){
                                product.id = 4;
                                product.title = 'מנוי שנתי מתחדש';
                                product.description = 'מנוי מתחדש כל שנה המאפשר לך לקרוא הודעות ללא הגבלה';
                            }*/

                            this.products[product.id] = product;

                            console.log(JSON.stringify(this.products));

                        }).catch((err) => {
                            console.log(JSON.stringify(err));
                        });


                        //this.products = products;
                    })
                    .catch((err) => {
                        console.log('this.iap' + JSON.stringify(err));
                    });
            }
        });
        //this.goto('https://m.gobaby.co.il/subscription/?&userId=' + val);
    }


    subscribe(product) {

        this.api.showLoad();

        let monthsNumber;

        switch(product.productId){
            case 'gobaby.oneWeek':
                monthsNumber = 0.5;
                break;

            case 'gobaby.oneMonth':
                monthsNumber = 1;
                break;

        /*    case 'gobaby.threeMonth':
                monthsNumber = 3;
                break;

            case 'gobaby.sixMonth':
                 monthsNumber = 6;
                break;

            case 'gobaby.oneYear':
                 monthsNumber = 12;
                break;*/
        }
        this.iap
            .subscribe(product.productId)
            .then((data)=> {
                if(parseInt(data.transactionId) > 0){
                    //this.api.presentToast('Congratulations on your purchase of a paid subscription to richdate.co.il', 10000);
                    this.api.http.post(this.api.url + '/user/subscription/monthsNumber:' + monthsNumber, data, this.api.setHeaders(true)).subscribe(data => {
                        this.navCtrl.push(HomePage);
                    }, err => {
                        console.log('this.iap.subscribe ajax' + JSON.stringify(err));
                    });
                }
                this.api.hideLoad();
            })
            .catch((err)=> {
                console.log('this.iap.subscribe' + JSON.stringify(err));
                this.api.hideLoad();
            });
    }

    sendSubscribe(history){
        this.api.http.post(this.api.url + '/user/restore', JSON.stringify(history), this.api.setHeaders(true)).subscribe(data => {
            if(data.json().payment == 1) {
                this.navCtrl.push(HomePage);
            }
        });
    }

    page(pageId) {
        this.navCtrl.push(Page, {pageId: pageId});
    }

    ionViewDidLoad() {
        this.api.pageName = 'SubscriptionPage';
        console.log('ionViewDidLoad SubscriptionPage');
    }

}
