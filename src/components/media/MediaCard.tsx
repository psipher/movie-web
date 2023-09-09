import c from "classnames";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { TMDBMediaToId } from "@/backend/metadata/tmdb";
import { MWMediaMeta } from "@/backend/metadata/types/mw";
import { DotList } from "@/components/text/DotList";
import { Flare } from "@/components/utils/Flare";

import { IconPatch } from "../buttons/IconPatch";
import { Icons } from "../Icon";

export interface MediaCardProps {
  media: MWMediaMeta;
  linkable?: boolean;
  series?: {
    episode: number;
    season?: number;
    episodeId: string;
    seasonId: string;
  };
  percentage?: number;
  closable?: boolean;
  onClose?: () => void;
}

function MediaCardContent({
  media,
  linkable,
  series,
  percentage,
  closable,
  onClose,
}: MediaCardProps) {
  const { t } = useTranslation();
  const percentageString = `${Math.round(percentage ?? 0).toFixed(0)}%`;

  const canLink = linkable && !closable;

  const dotListContent = [t(`media.${media.type}`)];
  if (media.year) dotListContent.push(media.year);

  return (
    <Flare.Base
      className={`group -m-3 mb-2 rounded-xl bg-background-main transition-colors duration-100 ${
        canLink ? "hover:bg-mediaCard-hoverBackground" : ""
      }`}
    >
      <Flare.Light
        flareSize={300}
        cssColorVar="--colors-mediaCard-hoverAccent"
        backgroundClass="bg-mediaCard-hoverBackground duration-100"
        className={c({
          "rounded-xl bg-background-main group-hover:opacity-100": canLink,
        })}
      />
      <Flare.Child
        className={`pointer-events-auto relative mb-2 p-3 transition-transform duration-100 ${
          canLink ? "group-hover:scale-95" : ""
        }`}
      >
        <div
          className={[
            "relative mb-4 aspect-[2/3] w-full overflow-hidden rounded-xl bg-mediaCard-hoverBackground bg-cover bg-center transition-[border-radius] duration-100",
            closable ? "" : "group-hover:rounded-lg",
          ].join(" ")}
          style={{
            backgroundImage: media.poster ? `url(${media.poster})` : undefined,
          }}
        >
          {series ? (
            <div
              className={[
                "absolute right-2 top-2 rounded-md bg-mediaCard-badge px-2 py-1 transition-colors",
              ].join(" ")}
            >
              <p
                className={[
                  "text-center text-xs font-bold text-mediaCard-badgeText transition-colors",
                  closable ? "" : "group-hover:text-white",
                ].join(" ")}
              >
                {t("seasons.seasonAndEpisode", {
                  season: series.season || 1,
                  episode: series.episode,
                })}
              </p>
            </div>
          ) : null}

          {percentage !== undefined ? (
            <>
              <div
                className={`absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-mediaCard-shadow to-transparent transition-colors ${
                  canLink ? "group-hover:from-mediaCard-hoverShadow" : ""
                }`}
              />
              <div
                className={`absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-mediaCard-shadow to-transparent transition-colors ${
                  canLink ? "group-hover:from-mediaCard-hoverShadow" : ""
                }`}
              />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="relative h-1 overflow-hidden rounded-full bg-mediaCard-barColor">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-mediaCard-barFillColor"
                    style={{
                      width: percentageString,
                    }}
                  />
                </div>
              </div>
            </>
          ) : null}

          <div
            className={`absolute inset-0 flex items-center justify-center bg-mediaCard-badge bg-opacity-80 transition-opacity duration-200 ${
              closable ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <IconPatch
              clickable
              className="text-2xl text-mediaCard-badgeText"
              onClick={() => closable && onClose?.()}
              icon={Icons.X}
            />
          </div>
        </div>
        <h1 className="mb-1 line-clamp-3 max-h-[4.5rem] text-ellipsis break-words font-bold text-white">
          <span>{media.title}</span>
        </h1>
        <DotList className="text-xs" content={dotListContent} />
      </Flare.Child>
    </Flare.Base>
  );
}

export function MediaCard(props: MediaCardProps) {
  const content = <MediaCardContent {...props} />;

  const canLink = props.linkable && !props.closable;

  let link = canLink
    ? `/media/${encodeURIComponent(TMDBMediaToId(props.media))}`
    : "#";
  if (canLink && props.series) {
    if (props.series.season === 0 && !props.series.episodeId) {
      link += `/${encodeURIComponent(props.series.seasonId)}`;
    } else {
      link += `/${encodeURIComponent(
        props.series.seasonId
      )}/${encodeURIComponent(props.series.episodeId)}`;
    }
  }

  if (!props.linkable) return <span>{content}</span>;
  return (
    <Link to={link} className={props.closable ? "hover:cursor-default" : ""}>
      {content}
    </Link>
  );
}
