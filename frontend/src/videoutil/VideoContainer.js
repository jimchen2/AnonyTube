import React from "react";
import {
  Player,
  ControlBar,
  LoadingSpinner,
  BigPlayButton,
  PlaybackRateMenuButton,
} from "video-react";
import { handleTimeUpdate } from "./VideoHelper";
import SubtitleComponent from "./SubtitleComponent";

const VideoContainer = ({
  selectedVideo,
  playerRef,
  subtitleTexts,
  setSubtitleTexts,
  selectedSubtitles,
}) => {
  return (
    <div>
      <div className="video-container">
        <Player
          ref={playerRef}
          onTimeUpdate={() =>
            handleTimeUpdate(playerRef, subtitleTexts, setSubtitleTexts)
          }
          key={selectedVideo.url}
          aspectRatio="16:9"
          fluid={false}
        >
          <source src={selectedVideo.url} />
          <LoadingSpinner />
          <BigPlayButton position="center" />

          <ControlBar>
            <PlaybackRateMenuButton order={7} rates={[0.5, 1, 1.5, 2]} />
          </ControlBar>
          <SubtitleComponent
            selectedSubtitles={selectedSubtitles}
            subtitleTexts={subtitleTexts}
          />
        </Player>
      </div>
    </div>
  );
};

export default VideoContainer;
