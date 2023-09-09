import { useCallback } from "react";

import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { useControls } from "@/_oldvideo/state/logic/controls";
import { useMediaPlaying } from "@/_oldvideo/state/logic/mediaplaying";
import { Icon, Icons } from "@/components/Icon";

export function MiddlePauseAction() {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const mediaPlaying = useMediaPlaying(descriptor);

  const handleClick = useCallback(() => {
    if (mediaPlaying?.isPlaying) controls.pause();
    else controls.play();
  }, [controls, mediaPlaying]);

  if (mediaPlaying.hasPlayedOnce) return null;
  if (mediaPlaying.isPlaying) return null;
  if (mediaPlaying.isFirstLoading) return null;

  return (
    <div
      onClick={handleClick}
      className="group pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-denim-400 text-white transition-[background-color,transform] hover:scale-125 hover:bg-denim-500 active:scale-100"
    >
      <Icon
        icon={Icons.PLAY}
        className="text-2xl transition-transform group-hover:scale-125"
      />
    </div>
  );
}
