import { useRef } from "react";

import { CastingInternal } from "@/_oldvideo/components/internal/CastingInternal";
import { WrapperRegisterInternal } from "@/_oldvideo/components/internal/WrapperRegisterInternal";
import { VideoErrorBoundary } from "@/_oldvideo/components/parts/VideoErrorBoundary";
import { useInterface } from "@/_oldvideo/state/logic/interface";
import { useMeta } from "@/_oldvideo/state/logic/meta";

import { MetaAction } from "./actions/MetaAction";
import ThumbnailGeneratorInternal from "./internal/ThumbnailGeneratorInternal";
import { VideoElementInternal } from "./internal/VideoElementInternal";
import {
  VideoPlayerContextProvider,
  useVideoPlayerDescriptor,
} from "../state/hooks";

export interface VideoPlayerBaseProps {
  children?:
    | React.ReactNode
    | ((data: { isFullscreen: boolean }) => React.ReactNode);
  autoPlay?: boolean;
  includeSafeArea?: boolean;
  onGoBack?: () => void;
}

function VideoPlayerBaseWithState(props: VideoPlayerBaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const descriptor = useVideoPlayerDescriptor();
  const videoInterface = useInterface(descriptor);
  const media = useMeta(descriptor);

  const children =
    typeof props.children === "function"
      ? props.children({
          isFullscreen: videoInterface.isFullscreen,
        })
      : props.children;

  // TODO move error boundary to only decorated, <VideoPlayer /> shouldn't have styling
  return (
    <VideoErrorBoundary onGoBack={props.onGoBack} media={media?.meta.meta}>
      <div
        ref={ref}
        className={[
          "is-video-player popout-location relative h-full w-full select-none overflow-hidden bg-black",
          props.includeSafeArea || videoInterface.isFullscreen
            ? "[border-left:env(safe-area-inset-left)_solid_transparent] [border-right:env(safe-area-inset-right)_solid_transparent]"
            : "",
        ].join(" ")}
      >
        <MetaAction />
        <ThumbnailGeneratorInternal />
        <VideoElementInternal autoPlay={props.autoPlay} />
        <CastingInternal />
        <WrapperRegisterInternal wrapper={ref.current} />
        <div className="absolute inset-0">{children}</div>
      </div>
    </VideoErrorBoundary>
  );
}

export function VideoPlayerBase(props: VideoPlayerBaseProps) {
  return (
    <VideoPlayerContextProvider>
      <VideoPlayerBaseWithState {...props} />
    </VideoPlayerContextProvider>
  );
}
