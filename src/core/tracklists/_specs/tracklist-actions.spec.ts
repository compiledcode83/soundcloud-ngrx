import { TracklistActions } from '../tracklist-actions';


describe('tracklists', () => {
  describe('TracklistActions', () => {
    let actions: TracklistActions;
    let tracklistId: string;


    beforeEach(() => {
      actions = new TracklistActions();
      tracklistId = 'tracklist/1';
    });


    describe('fetchTracksFailed()', () => {
      it('should create an action', () => {
        let error = {};
        let action = actions.fetchTracksFailed(error);

        expect(action).toEqual({
          type: TracklistActions.FETCH_TRACKS_FAILED,
          payload: error
        });
      });
    });


    describe('fetchTracksFulfilled()', () => {
      it('should create an action', () => {
        let action = actions.fetchTracksFulfilled({collection: []}, tracklistId);

        expect(action).toEqual({
          type: TracklistActions.FETCH_TRACKS_FULFILLED,
          payload: {
            collection: [],
            tracklistId
          }
        });
      });
    });


    describe('loadNextTracks()', () => {
      it('should create an action', () => {
        let action = actions.loadNextTracks();

        expect(action).toEqual({
          type: TracklistActions.LOAD_NEXT_TRACKS
        });
      });
    });


    describe('mountTracklist()', () => {
      it('should create an action', () => {
        let action = actions.mountTracklist(tracklistId);

        expect(action).toEqual({
          type: TracklistActions.MOUNT_TRACKLIST,
          payload: {
            tracklistId
          }
        });
      });
    });
  });
});
