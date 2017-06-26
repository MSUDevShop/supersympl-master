import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription';

import { ProfilePage } from '../profile/profile';

import gql from 'graphql-tag';

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})




export class ItemDetailPage {
  classInfo: string = "professor";
  section: any;
  users = <any>[];
  events = <any>[];

  pastEvents = <any>[];

  constructor(public navCtrl: NavController,
                     navParams: NavParams,
                     private apollo: Angular2Apollo) {

    this.section = navParams.get('section');
    this.users = this.section.users;
    let now = new Date().toISOString();



    for (let event of this.section.events) {
      if (event.dueDate < now) {
        if (this.pastEvents.length < 3) {
          this.pastEvents.push(event);
        }
      } else {
        this.events.push(event);
      }
    }
  }

  gotoUser(user) {
    console.log("ha");
    this.navCtrl.push(ProfilePage, {user: user});
  }



}
