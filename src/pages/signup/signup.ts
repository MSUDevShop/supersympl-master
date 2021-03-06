import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ToastController, ViewController, Platform } from 'ionic-angular';
import { MainPage } from '../../pages/pages';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription';

import { Camera, CameraOptions } from '@ionic-native/camera';

import gql from 'graphql-tag';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  firstName: "";
  lastName: "";
  email: any = "";
  password: "";
  major: "";
  phone: "";
  year: "";

  imageUri = "https://msudenver.edu/media/sampleassets/profile-placeholder.png";

  userInfo = <any>{};

  private signupErrorString: string;
  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public toastCtrl: ToastController,
              // public formBuilder: FormBuilder,
              private apollo: Angular2Apollo,
              private Camera: Camera,
              private platform: Platform) {
  }

  //calls the createAndSignIn function
  //sets the auth token
  //pushes the Tabs Page
  loginEvent(event) {
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.major || !this.phone || !this.year) {
      let toast = this.toastCtrl.create({
        message: 'There is some information missing. Try again.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } else {
      if (this.email.substr(this.email.length - 7) != "msu.edu") {
        let toast = this.toastCtrl.create({
          message: 'You have to sign with your msu.edu email.',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      } else {
        this.createUser().then(({data}) => {
          if (data){
            this.SignIn().then(({data}) => {
              this.userInfo.data = data
              console.log(this.userInfo.data.signinUser.token);
              window.localStorage.setItem('graphcoolToken', this.userInfo.data.signinUser.token);
              this.navCtrl.setRoot(MainPage);
            }, (errors) => {
                console.log(errors);
                if (errors == "GraphQL error: No user found with that information") {
                  let toast = this.toastCtrl.create({
                    message: 'User already exists with that information. Try again.',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                }
              });

          }
        }, (errors) => {
          console.log(errors);
          if (errors == "Error: GraphQL error: User already exists with that information") {
            let toast = this.toastCtrl.create({
              message: 'User already exists with that information. Try again.',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        });
      }
    }
  }

  //returns a promise that both creates the user and returns the user's auth token
  createUser(){
      return this.apollo.mutate({
        mutation: gql`
        mutation createUser($email: String!,
                            $password: String!,
                            $firstName: String!,
                            $lastName: String!,
                            $major: String!,
                            $phone: String,
                            $year: String!,
                            $profilePic: String){

          createUser(authProvider: { email: {email: $email, password: $password}},
                     firstName: $firstName,
                     lastName: $lastName,
                     major: $major,
                     phone: $phone,
                     year: $year,
                     profilePic: $profilePic){
            id
          }
        }
        `,
        variables: {
          email: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
          major: this.major,
          phone: this.phone,
          year: this.year,
          profilePic: this.imageUri
        }
      }).toPromise();
  }
  SignIn(){
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
          email: this.email,
          password: this.password,
        }
      }).toPromise();
  }

  changePic() {
    let options: CameraOptions = {
      quality: 50,
      destinationType: 0,
      targetWidth: 500,
      targetHeight: 500,
      encodingType: 0,
      sourceType: 0,
      correctOrientation: true,
      allowEdit: true

    };
    if (this.platform.is('android')) {
      this.Camera.getPicture(options).then((ImageData) => {
        let base64Image = "data:image/jpeg;base64," + ImageData;
        this.imageUri = base64Image;
      });
    } else if (this.platform.is('ios')) {
      this.Camera.getPicture(options).then((ImageData) => {
        let base64Image = "data:image/jpeg;base64," + ImageData;
        this.imageUri = base64Image;
      })
    }
  }

  dismiss(){
    console.log("dismiss");
    this.viewCtrl.dismiss();
  }
}
