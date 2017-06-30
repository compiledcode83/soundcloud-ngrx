import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// components
import { AppComponent } from './app';
import { AppHeaderComponent } from './app-header';

// modules
import { CoreModule } from 'src/core';
import { HomeModule } from 'src/home';
import { PlayerModule } from 'src/player';
import { SearchModule } from 'src/search';
import { SharedModule } from 'src/shared';
import { TracklistsModule } from 'src/tracklists';
import { UsersModule } from 'src/users';
import { AppStateModule } from './app-state';


@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    AppHeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], {useHash: false}),
    AppStateModule,
    CoreModule,
    HomeModule,
    PlayerModule,
    SearchModule,
    SharedModule,
    TracklistsModule,
    UsersModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'}
  ]
})
export class AppModule {}
