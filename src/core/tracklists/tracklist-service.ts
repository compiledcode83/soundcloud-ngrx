import 'rxjs/add/operator/let';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { List } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { AppState } from 'src/core/interfaces';
import { Track } from 'src/core/tracks';
import { getCurrentTracklist, getTracksForCurrentTracklist } from './selectors';
import { Tracklist } from './tracklist';
import { TracklistActions } from './tracklist-actions';


@Injectable()
export class TracklistService {
  tracklist$: Observable<Tracklist>;
  tracks$: Observable<List<Track>>;

  constructor(private actions: TracklistActions, private store$: Store<AppState>) {
    this.tracklist$ = store$.let(getCurrentTracklist());
    this.tracks$ = store$.let(getTracksForCurrentTracklist());
  }

  loadFeaturedTracks(): void {
    this.store$.dispatch(
      this.actions.loadFeaturedTracks()
    );
  }

  loadNextTracks(): void {
    this.store$.dispatch(
      this.actions.loadNextTracks()
    );
  }
}
