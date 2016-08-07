import { AUDIO_SOURCE_PROVIDER } from './audio-source';
import { PlayerActions } from './player-actions';
import { PlayerService } from './player-service';


export { PlayerService };
export { PlayerEffects } from './player-effects';
export { playerReducer } from './player-reducer';
export { PlayerState } from './player-state';


export const PLAYER_PROVIDERS = [
  AUDIO_SOURCE_PROVIDER,
  PlayerActions,
  PlayerService
];
