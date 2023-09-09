import { ReactNode, useCallback, useState } from "react";

import { AirplayAction } from "@/_oldvideo/components/actions/AirplayAction";
import { BackdropAction } from "@/_oldvideo/components/actions/BackdropAction";
import { CastingTextAction } from "@/_oldvideo/components/actions/CastingTextAction";
import { ChromecastAction } from "@/_oldvideo/components/actions/ChromecastAction";
import { FullscreenAction } from "@/_oldvideo/components/actions/FullscreenAction";
import { HeaderAction } from "@/_oldvideo/components/actions/HeaderAction";
import { KeyboardShortcutsAction } from "@/_oldvideo/components/actions/KeyboardShortcutsAction";
import { LoadingAction } from "@/_oldvideo/components/actions/LoadingAction";
import { MiddlePauseAction } from "@/_oldvideo/components/actions/MiddlePauseAction";
import { MobileCenterAction } from "@/_oldvideo/components/actions/MobileCenterAction";
import { PageTitleAction } from "@/_oldvideo/components/actions/PageTitleAction";
import { PauseAction } from "@/_oldvideo/components/actions/PauseAction";
import { PictureInPictureAction } from "@/_oldvideo/components/actions/PictureInPictureAction";
import { ProgressAction } from "@/_oldvideo/components/actions/ProgressAction";
import { SeriesSelectionAction } from "@/_oldvideo/components/actions/SeriesSelectionAction";
import { ShowTitleAction } from "@/_oldvideo/components/actions/ShowTitleAction";
import { SkipTimeAction } from "@/_oldvideo/components/actions/SkipTimeAction";
import { TimeAction } from "@/_oldvideo/components/actions/TimeAction";
import { VolumeAction } from "@/_oldvideo/components/actions/VolumeAction";
import { VideoPlayerError } from "@/_oldvideo/components/parts/VideoPlayerError";
import { PopoutProviderAction } from "@/_oldvideo/components/popouts/PopoutProviderAction";
import {
  VideoPlayerBase,
  VideoPlayerBaseProps,
} from "@/_oldvideo/components/VideoPlayerBase";
import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { useControls } from "@/_oldvideo/state/logic/controls";
import { Transition } from "@/components/Transition";
import { useIsMobile } from "@/hooks/useIsMobile";

import { CaptionRendererAction } from "./actions/CaptionRendererAction";
import { DividerAction } from "./actions/DividerAction";
import { SettingsAction } from "./actions/SettingsAction";
import { VolumeAdjustedAction } from "./actions/VolumeAdjustedAction";

type Props = VideoPlayerBaseProps;

function CenterPosition(props: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {props.children}
    </div>
  );
}

function LeftSideControls() {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);

  const handleMouseEnter = useCallback(() => {
    controls.setLeftControlsHover(true);
  }, [controls]);
  const handleMouseLeave = useCallback(() => {
    controls.setLeftControlsHover(false);
  }, [controls]);

  return (
    <>
      <div
        className="flex items-center px-2"
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <PauseAction />
        <SkipTimeAction />
        <VolumeAction className="mr-2" />
        <TimeAction />
      </div>
      <ShowTitleAction />
    </>
  );
}

export function VideoPlayer(props: Props) {
  const [show, setShow] = useState(false);
  const { isMobile } = useIsMobile();

  const onBackdropChange = useCallback(
    (showing: boolean) => {
      setShow(showing);
    },
    [setShow]
  );

  return (
    <VideoPlayerBase
      autoPlay={props.autoPlay}
      includeSafeArea={props.includeSafeArea}
      onGoBack={props.onGoBack}
    >
      {({ isFullscreen }) => (
        <>
          <KeyboardShortcutsAction />
          <PageTitleAction />
          <VolumeAdjustedAction />
          <VideoPlayerError onGoBack={props.onGoBack}>
            <BackdropAction onBackdropChange={onBackdropChange}>
              <CenterPosition>
                <LoadingAction />
              </CenterPosition>
              <CenterPosition>
                <CastingTextAction />
              </CenterPosition>
              <CenterPosition>
                <MiddlePauseAction />
              </CenterPosition>
              {isMobile ? (
                <Transition
                  animation="fade"
                  show={show}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <MobileCenterAction />
                </Transition>
              ) : (
                ""
              )}
              <Transition
                animation="slide-down"
                show={show}
                className="pointer-events-auto absolute inset-x-0 top-0 flex flex-col px-8 py-6 pb-2"
              >
                <HeaderAction
                  showControls={isMobile}
                  onClick={props.onGoBack}
                  isFullScreen
                />
              </Transition>
              <Transition
                animation="slide-up"
                show={show}
                className={[
                  "pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col px-4 pb-2",
                  props.includeSafeArea || isFullscreen
                    ? "[margin-bottom:env(safe-area-inset-bottom)]"
                    : "",
                ].join(" ")}
              >
                <div className="flex w-full items-center space-x-3">
                  {isMobile && <TimeAction noDuration />}
                  <ProgressAction />
                </div>
                <div className="flex items-center">
                  {isMobile ? (
                    <div className="grid w-full grid-cols-[56px,1fr,56px] items-center">
                      <div />
                      <div className="flex items-center justify-center">
                        <SeriesSelectionAction />
                        <PictureInPictureAction />
                        <SettingsAction />
                      </div>
                      <FullscreenAction />
                    </div>
                  ) : (
                    <>
                      <LeftSideControls />
                      <div className="flex-1" />
                      <SeriesSelectionAction />
                      <DividerAction />
                      <SettingsAction />
                      <ChromecastAction />
                      <AirplayAction />
                      <PictureInPictureAction />
                      <FullscreenAction />
                    </>
                  )}
                </div>
              </Transition>
              {show ? <PopoutProviderAction /> : null}
            </BackdropAction>
            <CaptionRendererAction isControlsShown={show} />
            {props.children}
          </VideoPlayerError>
        </>
      )}
    </VideoPlayerBase>
  );
}
