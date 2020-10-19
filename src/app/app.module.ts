import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}

// cordova plugin add cordova-plugin-jc-googledrive --variable IOS_REVERSED_CLIENT_ID=287580716523-ll3jvmpchg30qod7m1pgmo0i7o60fg5g.apps.googleusercontent.com --variable IOS_CLIENT_ID=287580716523-ll3jvmpchg30qod7m1pgmo0i7o60fg5g.apps.googleusercontent.com

