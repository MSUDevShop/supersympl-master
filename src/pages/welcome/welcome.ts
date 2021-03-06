import { Component } from '@angular/core';
import { NavController, ToastController, ViewController } from 'ionic-angular';
import { MainPage } from '../../pages/pages';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';
import { ListMasterPage } from '../list-master/list-master';
import { SignupPage } from '../signup/signup';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {email: string, password: string} = {
    email: "",
    password: ""
  };


  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public toastCtrl: ToastController,
              public apollo : Angular2Apollo) {
  }

    CurrentUserForProfile = gql`
      query {
        user {
          id
        }
      }
    `;

    doLogin(event) {
      let userInfo = <any>{};
      this.signIn().then(({data}) =>{
        if (data) {
          userInfo.data = data
          console.log(userInfo.data.signinUser.token);
          window.localStorage.setItem('graphcoolToken', userInfo.data.signinUser.token);
        }
        // this.apollo.watchQuery({
        // query: this.CurrentUserForProfile
        // }).subscribe(({data}) => {
        //     console.log(data);
        // });

      }).then(() => {
        this.navCtrl.push(MainPage);
      }).catch(() => {
      console.log('view was not dismissed');
      this.showToast();
    });



        // console.log(data.token);
        // console.log(data.signinUser);
        // window.localStorage.setItem('graphcoolToken', data.signinUser.token);
      // })

    }

    showToast() {
    let toast = this.toastCtrl.create({
      message: 'Login failed, Please try again.',
      duration: 2500,
      position: 'bottom'
    });

    toast.present(toast);
  }

    signIn(){
      return this.apollo.mutate({
        mutation: gql`
        mutation signinUser($email: String!,
                            $password: String!){
          signinUser(email: {email: $email, password: $password}){
            token
          }
        }
        `,
        variables: {
          email: this.account.email,
          password: this.account.password
        }
      }).toPromise();
    }

    goToSignUp(){
      this.navCtrl.push(SignupPage);
    }

}
