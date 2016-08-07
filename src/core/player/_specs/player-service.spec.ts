import { ReflectiveInjector } from '@angular/core';
import { provideStore, Store } from '@ngrx/store';
import { List, Map } from 'immutable';
import { TracklistRecord, tracklistsReducer } from 'src/core/tracklists';
import { TrackRecord, tracksReducer } from 'src/core/tracks';
import { AUDIO_SOURCE_PROVIDER } from '../audio-source';
import { PlayerActions } from '../player-actions';
import { initialState as playerInitialState, playerReducer } from '../player-reducer';
import { PlayerService } from '../player-service';


describe('player', () => {
  describe('PlayerService', () => {
    let actions: PlayerActions;
    let playerService: PlayerService;
    let store: any;


    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        AUDIO_SOURCE_PROVIDER,
        PlayerActions,
        PlayerService,
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
              .set(1, new TrackRecord({id: 1, streamUrl: 'http://stream/1'}))
              .set(2, new TrackRecord({id: 2, streamUrl: 'http://stream/2'}))
              .set(3, new TrackRecord({id: 3, streamUrl: 'http://stream/3'}))
          }
        )
      ]);

      actions = new PlayerActions();
      playerService = injector.get(PlayerService);
      store = injector.get(Store);
    });


    describe('cursor$', () => {
      it('should stream the player tracklist cursor from store', () => {
        let count = 0;
        let cursor;

        playerService.cursor$.subscribe(value => {
          count++;
          cursor = value;
        });

        store.dispatch(actions.playSelectedTrack(1, 'tracklist/1'));
        expect(count).toBe(1);
        expect(cursor.toJS()).toEqual({
          currentTrackId: 1,
          nextTrackId: 2,
          previousTrackId: null
        });

        store.dispatch(actions.playSelectedTrack(2, 'tracklist/1'));
        expect(count).toBe(2);
        expect(cursor.toJS()).toEqual({
          currentTrackId: 2,
          nextTrackId: 3,
          previousTrackId: 1
        });

        store.dispatch(actions.playSelectedTrack(3, 'tracklist/1'));
        expect(count).toBe(3);
        expect(cursor.toJS()).toEqual({
          currentTrackId: 3,
          nextTrackId: null,
          previousTrackId: 2
        });
      });
    });


    describe('player$', () => {
      it('should stream the player state from store', () => {
        let count = 0;
        let player;

        playerService.player$.subscribe(value => {
          count++;
          player = value;
        });

        // auto-emitting initial value
        expect(count).toBe(1);
        expect(player).toBe(playerInitialState);

        // changing isPlaying should emit
        store.dispatch(actions.audioPlaying());
        expect(count).toBe(2);
        expect(player.isPlaying).toBe(true);

        // should not emit: no change
        store.dispatch(actions.audioPlaying());
        expect(count).toBe(2);

        // changing trackId should emit
        store.dispatch(actions.playSelectedTrack(1));
        expect(count).toBe(3);

        // dispatching unrelated action should not emit
        store.dispatch({type: 'UNDEFINED'});
        expect(count).toBe(3);
      });
    });


    describe('track$', () => {
      it('should stream the player track from store', () => {
        let count = 0;
        let track;

        playerService.track$.subscribe(value => {
          count++;
          track = value;
        });

        // changing trackId should emit
        store.dispatch(actions.playSelectedTrack(1, 'tracklist/1'));
        expect(count).toBe(1);
        expect(track.id).toBe(1);

        // should not emit: same trackId
        store.dispatch(actions.playSelectedTrack(1, 'tracklist/2'));
        expect(count).toBe(1);

        // changing trackId should emit
        store.dispatch(actions.playSelectedTrack(2, 'tracklist/1'));
        expect(count).toBe(2);
        expect(track.id).toBe(2);

        // should not emit: changes isPlaying but not trackId
        store.dispatch(actions.audioPlaying());
        expect(count).toBe(2);

        // dispatching unrelated action should not emit
        store.dispatch({type: 'UNDEFINED'});
        expect(count).toBe(2);
      });

      it('should call play() with track.streamUrl when track changes', () => {
        let tracklistId = 'tracklist/1';
        let track;

        spyOn(playerService, 'play');
        playerService.track$.subscribe(value => track = value);

        store.dispatch(actions.playSelectedTrack(1, tracklistId));
        expect(playerService.play).toHaveBeenCalledWith(track.streamUrl);
      });
    });


    describe('select()', () => {
      it('should dispatch PLAY_SELECTED_TRACK action', () => {
        let trackId = 123;
        let tracklistId = 'tracklist/1';

        spyOn(store, 'dispatch');
        playerService.select({trackId, tracklistId});

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(actions.playSelectedTrack(trackId, tracklistId));
      });
    });
  });
});
