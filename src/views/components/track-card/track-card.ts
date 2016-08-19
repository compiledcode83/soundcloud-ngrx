import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TimesState } from 'src/core/player';
import { Track } from 'src/core/tracks';

import { FormatIntegerPipe } from '../../pipes/format-integer';
import { FormatTimePipe } from '../../pipes/format-time';
import { AudioTimelineComponent } from '../audio-timeline';
import { IconComponent } from '../icon';
import { IconButtonComponent } from '../icon-button';
import { WaveformTimelineComponent } from '../waveform-timeline';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    AudioTimelineComponent,
    IconComponent,
    IconButtonComponent,
    WaveformTimelineComponent
  ],
  encapsulation: ViewEncapsulation.None,
  pipes: [
    FormatIntegerPipe,
    FormatTimePipe
  ],
  selector: 'track-card',
  styles: [
    require('./track-card.scss')
  ],
  template: `
    <article class="track-card" [ngClass]="{'track-card--compact': compact, 'track-card--full': !compact}">
      <div class="track-card__image">
        <img [src]="track.artworkUrl">
      </div>

      <div class="track-card__main">
        <div class="track-card__timeline" *ngIf="compact">
          <audio-timeline
            *ngIf="isSelected"
            [times]="times | async"
            (seek)="seek.emit($event)"></audio-timeline>      
        </div>

        <a class="track-card__username" [linkTo]="'/users/' + track.userId + '/tracks'">{{track.username}}</a>
        <h1 class="track-card__title">{{track.title}}</h1>

        <waveform-timeline
          *ngIf="!compact"
          [isActive]="isSelected"
          [times]="times"
          [waveformUrl]="track.waveformUrl"
          (seek)="seek.emit($event)"></waveform-timeline>

        <div class="track-card__actions" *ngIf="track.streamable">
          <div class="cell">
            <icon-button
              [icon]="isPlaying ? 'pause' : 'play'"
              (onClick)="isPlaying ? pause.emit() : play.emit()"></icon-button>
            <span class="meta-duration">{{track.duration | formatTime:'ms'}}</span>
          </div>

          <div class="cell" *ngIf="!compact">
            <icon name="headset" className="icon--small"></icon>
            <span class="meta-playback-count">{{track.playbackCount | formatInteger}}</span>
          </div>

          <div class="cell" *ngIf="!compact">
            <icon name="favorite-border" className="icon--small"></icon>
            <span class="meta-likes-count">{{track.likesCount | formatInteger}}</span>
          </div>

          <div class="cell">
            <a [href]="track.userPermalinkUrl" target="_blank" rel="noopener noreferrer">
              <icon name="launch" className="icon--small"></icon>
            </a>
          </div>
        </div>
      </div>
    </article>
  `
})

export class TrackCardComponent {
  @Input() compact = false;
  @Input() isPlaying = false;
  @Input() isSelected = false;
  @Input() times: Observable<TimesState>;
  @Input() track: Track;

  @Output() pause = new EventEmitter(false);
  @Output() play = new EventEmitter(false);
  @Output() seek = new EventEmitter(false);
}
