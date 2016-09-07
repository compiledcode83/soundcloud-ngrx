import { PlayerActions } from '../player-actions';
import { playerReducer } from './player-reducer';
import { PlayerState, PlayerStateRecord } from './player-state';


describe('player', () => {
  describe('playerReducer', () => {
    let actions: PlayerActions;

    beforeEach(() => {
      actions = new PlayerActions();
    });


    describe('AUDIO_PAUSED action', () => {
      it('should set PlayerState.isPlaying to false', () => {
        let player = new PlayerStateRecord({isPlaying: true}) as PlayerState;
        player = playerReducer(player, actions.audioPaused());
        expect(player.isPlaying).toBe(false);
      });
    });


    describe('AUDIO_PLAYING action', () => {
      it('should set PlayerState.isPlaying to true', () => {
        let player = new PlayerStateRecord({isPlaying: false}) as PlayerState;
        player = playerReducer(player, actions.audioPlaying());
        expect(player.isPlaying).toBe(true);
      });
    });


    describe('AUDIO_VOLUME_CHANGED action', () => {
      it('should set PlayerState.volume to provided value', () => {
        let player = new PlayerStateRecord({volume: 1}) as PlayerState;
        player = playerReducer(player, actions.audioVolumeChanged(5));
        expect(player.volume).toBe(5);
      });
    });


    describe('PLAY_SELECTED_TRACK action', () => {
      const trackId = 123;
      const tracklistId = 'tracklist/1';

      it('should set PlayerState.trackId to provided value', () => {
        let player = new PlayerStateRecord() as PlayerState;
        player = playerReducer(player, actions.playSelectedTrack(trackId));
        expect(player.trackId).toBe(trackId);
      });

      it('should set PlayerState.tracklistId to provided value', () => {
        let player = new PlayerStateRecord() as PlayerState;
        player = playerReducer(player, actions.playSelectedTrack(trackId, tracklistId));
        expect(player.trackId).toBe(trackId);
        expect(player.tracklistId).toBe(tracklistId);
      });
    });
  });
});
