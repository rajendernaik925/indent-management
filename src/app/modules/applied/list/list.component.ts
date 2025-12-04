import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from '../../../shared/shared-modules';
import { ReactiveFormsModule } from '@angular/forms';
import { COMMON_EXPORTS } from '../../../core/common-exports.constants';
declare var YT: any;

@Component({
  selector: 'app-clinic',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    COMMON_EXPORTS
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements AfterViewInit {
   ngAfterViewInit(): void {
    // Load YouTube Iframe API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    // Wait for API to load
    (window as any).onYouTubeIframeAPIReady = () => {
      new YT.Player('player', {
        videoId: 'aj-h-jxK7Bs',
        playerVars: {
          autoplay: 1,
          controls: 0,
          mute: 0,   // Sound ON, but may require user interaction
          loop: 0,
          rel: 0,
        },
        events: {
          onStateChange: this.onPlayerStateChange.bind(this)
        }
      });
    };
  }

  onPlayerStateChange(event: any) {
    if (event.data === YT.PlayerState.ENDED) {
      document.getElementById("nextSection")?.scrollIntoView({
        behavior: "smooth"
      });
    }
  }

}
