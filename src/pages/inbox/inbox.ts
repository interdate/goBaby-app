import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
import {Http} from '@angular/http';
import * as $ from "jquery";

/**
 * Generated class for the InboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-inbox',
    templateUrl: 'inbox.html',
})
export class InboxPage {

    users: Array<{ id: string, message: string, mainImage: string, nickName: string, newMessagesNumber: string, faceWebPath: string, noPhoto: string }>;
    texts: { no_results: string };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public http: Http,
                public loadingCtrl: LoadingController,
                public api: ApiQuery) {




    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InboxPage');
    }

    ionViewWillLeave() {
        $('.back-btn').hide();
    }

    ionViewWillEnter() {
        $('.back-btn').show();
        $('.link-banner').hide();

        let loading = this.loadingCtrl.create({
            content: 'אנא המתן...'
        });
        loading.present();
        this.http.get(this.api.url + '/user/contacts/perPage:200/page:1', this.api.setHeaders(true)).subscribe(data => {
            this.users = data.json().allChats;
            loading.dismiss();
        });
        this.api.pageName = 'InboxPage';
    }

    toDialogPage(user) {
        this.navCtrl.push('DialogPage', {user: user.user});
    }

}
