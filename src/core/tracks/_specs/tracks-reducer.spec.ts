import { is, Map } from 'immutable';
import { TracklistActions } from 'src/core/tracklists';
import { testUtils } from 'src/core/utils/test';
import { createTrack } from '../track';
import { tracksReducer } from '../tracks-reducer';


describe('tracks', () => {
  describe('tracksReducer', () => {
    let actions: TracklistActions;

    beforeEach(() => {
      actions = new TracklistActions();
    });


    describe('default case', () => {
      it('should return initial state', () => {
        let tracks = tracksReducer(undefined, {type: 'UNDEFINED'});
        expect(is(tracks, Map())).toBe(true);
      });
    });


    describe('FETCH_TRACKS_FULFILLED action', () => {
      it('should add tracks to state as TrackRecord instances created by track factory', () => {
        let data = {collection: testUtils.createTracks(3)};
        let action = actions.fetchTracksFulfilled(data, 'tracklist/1');
        let tracks = tracksReducer(undefined, action);

        data.collection.forEach(trackData => {
          expect(is(tracks.get(trackData.id), createTrack(trackData))).toBe(true);
        });
      });
    });
  });
});
