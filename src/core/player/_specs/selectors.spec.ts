import { ReflectiveInjector } from '@angular/core';
import { provideStore, Store } from '@ngrx/store';
import { List, Map } from 'immutable';
import { TracklistActions, TracklistRecord, tracklistsReducer } from 'src/core/tracklists';
import { TrackRecord, tracksReducer } from 'src/core/tracks';
import { testUtils } from 'src/core/utils/test';
import { PlayerActions } from '../player-actions';
import { initialState as initialPlayerState, playerReducer } from '../player-reducer';
import {
  getPlayer,
  getPlayerTrack,
  getPlayerTrackId,
  getPlayerTracklist,
  getPlayerTracklistCursor
} from '../selectors';


describe('player', () => {
  describe('selectors', () => {
    let playerActions: PlayerActions;
    let store: any;
    let tracklistActions: TracklistActions;


    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        PlayerActions,
        provideStore(
          {
            player: playerReducer,
            tracklists: tracklistsReducer,
            tracks: tracksReducer
          },
          {
            tracklists: Map({
              'tracklist/1': new TracklistRecord({id: 'tracklist/1', trackIds: List([1,2,3])}),
              'tracklist/2': new TracklistRecord({id: 'tracklist/2', trackIds: List([1])})
            }),

            tracks: Map()
              .set(1, new TrackRecord({id: 1}))
              .set(2, new TrackRecord({id: 2}))
              .set(3, new TrackRecord({id: 3}))
          }
        )
      ]);

      playerActions = new PlayerActions();
      store = injector.get(Store);
      tracklistActions = new TracklistActions();
    });


    describe('getPlayer()', () => {
      it('should return observable that emits PlayerState on change', () => {
        let count = 0;
        let player = null;

        store
          .let(getPlayer())
          .subscribe(value => {
            count++;
            player = value;
          });

        // auto-emitting initial value
        expect(count).toBe(1);
        expect(player).toBe(initialPlayerState);

        // changing isPlaying should emit
        store.dispatch(playerActions.audioPlaying());
        expect(count).toBe(2);
        expect(player.isPlaying).toBe(true);

        // should not emit: no change
        store.dispatch(playerActions.audioPlaying());
        expect(count).toBe(2);

        // changing trackId should emit
        store.dispatch(playerActions.playSelectedTrack(1));
        expect(count).toBe(3);

        // dispatching unrelated action should not emit
        store.dispatch({type: 'UNDEFINED'});
        expect(count).toBe(3);
      });
    });


    describe('getPlayerTrack()', () => {
      it('should return observable that emits track corresponding to PlayerState.trackId', () => {
        let count = 0;
        let track = null;

        store
          .let(getPlayerTrack())
          .subscribe(value => {
            count++;
            track = value;
          });

        // changing trackId should emit
        store.dispatch(playerActions.playSelectedTrack(1, 'tracklist/1'));
        expect(count).toBe(1);
        expect(track.id).toBe(1);

        // should not emit: same trackId
        store.dispatch(playerActions.playSelectedTrack(1, 'tracklist/2'));
        expect(count).toBe(1);

        // changing trackId should emit
        store.dispatch(playerActions.playSelectedTrack(2, 'tracklist/1'));
        expect(count).toBe(2);
        expect(track.id).toBe(2);

        // should not emit: changes isPlaying but not trackId
        store.dispatch(playerActions.audioPlaying());
        expect(count).toBe(2);

        // dispatching unrelated action should not emit
        store.dispatch({type: 'UNDEFINED'});
        expect(count).toBe(2);
      });
    });


    describe('getPlayerTrackId()', () => {
      it('should return observable that emits PlayerState.trackId', () => {
        let count = 0;
        let trackId = null;

        store
          .let(getPlayerTrackId())
          .subscribe(value => {
            count++;
            trackId = value;
          });

        // auto-emitting initial value
        expect(count).toBe(1);
        expect(trackId).toBe(null);

        // changing trackId should emit
        store.dispatch(playerActions.playSelectedTrack(1, 'tracklist/1'));
        expect(count).toBe(2);
        expect(trackId).toBe(1);

        // same trackId should emit
        store.dispatch(playerActions.playSelectedTrack(1, 'tracklist/2'));
        expect(count).toBe(3);
        expect(trackId).toBe(1);

        // changing trackId should emit
        store.dispatch(playerActions.playSelectedTrack(2, 'tracklist/2'));
        expect(count).toBe(4);
        expect(trackId).toBe(2);

        // changing state.player should emit
        store.dispatch(playerActions.audioPlaying());
        expect(count).toBe(5);

        // dispatching unrelated action should emit
        store.dispatch({type: 'UNDEFINED'});
        expect(count).toBe(6);
      });
    });


    describe('getPlayerTracklist()', () => {
      it('should return observable that emits tracklist with PlayerState.tracklistId', () => {
        let count = 0;
        let tracklist = null;

        store
          .let(getPlayerTracklist())
          .subscribe(value => {
            count++;
            tracklist = value;
          });

        // changing tracklistId should emit
        store.dispatch(playerActions.playSelectedTrack(1, 'tracklist/1'));
        expect(count).toBe(1);
        expect(tracklist.id).toBe('tracklist/1');

        // should not emit: different trackId, but same tracklistId
        store.dispatch(playerActions.playSelectedTrack(2, 'tracklist/1'));
        expect(count).toBe(1);

        // changing tracklistId should emit
        store.dispatch(playerActions.playSelectedTrack(1, 'tracklist/2'));
        expect(count).toBe(2);
        expect(tracklist.id).toBe('tracklist/2');

        // should not emit: same tracklistId
        store.dispatch(playerActions.audioPlaying());
        expect(count).toBe(2);

        // mount tracklist and load track; changes tracklist trackCount
        store.dispatch(tracklistActions.mountTracklist('tracklist/2'));
        store.dispatch(tracklistActions.fetchTracksFulfilled({collection: [testUtils.createTrack()]}, 'tracklist/2'));
        expect(count).toBe(3);
        expect(tracklist.id).toBe('tracklist/2');

        // dispatching unrelated action should not emit
        store.dispatch({type: 'UNDEFINED'});
        expect(count).toBe(3);
      });
    });


    describe('getPlayerTracklistCursor()', () => {
      it('should return observable that emits player tracklist cursor when PlayerState.trackId changes', () => {
        let count = 0;
        let cursor = null;

        store
          .let(getPlayerTracklistCursor())
          .subscribe(value => {
            count++;
            cursor = value;
          });

        store.dispatch(playerActions.playSelectedTrack(1, 'tracklist/1'));
        expect(count).toBe(1);
        expect(cursor.toJS()).toEqual({
          currentTrackId: 1,
          nextTrackId: 2,
          previousTrackId: null
        });

        store.dispatch(playerActions.playSelectedTrack(2, 'tracklist/1'));
        expect(count).toBe(2);
        expect(cursor.toJS()).toEqual({
          currentTrackId: 2,
          nextTrackId: 3,
          previousTrackId: 1
        });

        store.dispatch(playerActions.playSelectedTrack(3, 'tracklist/1'));
        expect(count).toBe(3);
        expect(cursor.toJS()).toEqual({
          currentTrackId: 3,
          nextTrackId: null,
          previousTrackId: 2
        });
      });
    });
  });
});
