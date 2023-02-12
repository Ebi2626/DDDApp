import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigInitService } from './init/config-init.service';
import { initializeKeycloak } from './init/keycloak-init.factory';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    KeycloakAngularModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    ConfigInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, ConfigInitService],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
