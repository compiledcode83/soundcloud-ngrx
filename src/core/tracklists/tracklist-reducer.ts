import { Action, ActionReducer } from '@ngrx/store';
import { List } from 'immutable';
import { TRACKS_PER_PAGE } from 'src/core/constants';
import { SearchActions } from 'src/core/search';
import { TrackData } from 'src/core/tracks';
import { UserActions } from 'src/core/users';
import { Tracklist, TracklistRecord } from './tracklist';
import { TracklistActions } from './tracklist-actions';


const initialState: Tracklist = new TracklistRecord() as Tracklist;


export const tracklistReducer: ActionReducer<Tracklist> = (state: Tracklist = initialState, {payload, type}: Action) => {
  switch (type) {
    case TracklistActions.FETCH_TRACKS_FULFILLED:
      return state.withMutations((tracklist: any) => {
        tracklist
          .merge({
            isNew: false,
            isPending: false,
            nextUrl: payload.next_href || null,
            trackIds: mergeTrackIds(tracklist.trackIds, payload.collection)
          })
          .merge(updatePagination(tracklist, tracklist.currentPage + 1));
      }) as Tracklist;

    case TracklistActions.LOAD_NEXT_TRACKS:
      return state.hasNextPageInStore ?
             state.merge(updatePagination(state, state.currentPage + 1)) as Tracklist :
             state.set('isPending', true) as Tracklist;

    case TracklistActions.LOAD_FEATURED_TRACKS:
    case SearchActions.LOAD_SEARCH_RESULTS:
    case UserActions.LOAD_USER_LIKES:
    case UserActions.LOAD_USER_TRACKS:
      return state.isNew ?
             state.merge({id: payload.tracklistId, isPending: true}) as Tracklist :
             state.merge(updatePagination(state, 1)) as Tracklist;

    default:
      return state;
  }
};


function mergeTrackIds(trackIds: List<number>, collection: TrackData[]): List<number> {
  let ids = trackIds.toJS();

  let newIds = collection.reduce((list, trackData) => {
    if (ids.indexOf(trackData.id) === -1) list.push(trackData.id);
    return list;
  }, []);

  return newIds.length ? List<number>(ids.concat(newIds)) : trackIds;
}


function updatePagination(tracklist: Tracklist, page: number): any {
  let pageCount = Math.ceil(tracklist.trackIds.size / TRACKS_PER_PAGE);
  let currentPage = Math.min(page, pageCount);
  let hasNextPageInStore = currentPage < pageCount;
  let hasNextPage = hasNextPageInStore || tracklist.nextUrl !== null;

  return {
    currentPage,
    hasNextPage,
    hasNextPageInStore,
    pageCount
  };
}
