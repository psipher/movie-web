import c from "classnames";
import { useState } from "react";

import { MWQuery } from "@/backend/metadata/types/mw";
import { Flare } from "@/components/utils/Flare";

import { Icon, Icons } from "./Icon";
import { TextInputControl } from "./text-inputs/TextInputControl";

export interface SearchBarProps {
  placeholder?: string;
  onChange: (value: MWQuery, force: boolean) => void;
  onUnFocus: () => void;
  value: MWQuery;
}

export function SearchBarInput(props: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  function setSearch(value: string) {
    props.onChange(
      {
        ...props.value,
        searchQuery: value,
      },
      false
    );
  }

  return (
    <Flare.Base
      className={c({
        "hover:flare-enabled group relative flex flex-col rounded-[28px] transition-colors sm:flex-row sm:items-center":
          true,
        "bg-search-background": !focused,
        "bg-search-focused": focused,
      })}
    >
      <Flare.Light
        flareSize={400}
        enabled={focused}
        className="rounded-[28px]"
        backgroundClass={c({
          "transition-colors": true,
          "bg-search-background": !focused,
          "bg-search-focused": focused,
        })}
      />

      <Flare.Child className="flex flex-1 flex-col">
        <div className="pointer-events-none absolute bottom-0 left-5 top-0 flex max-h-14 items-center text-search-icon">
          <Icon icon={Icons.SEARCH} />
        </div>

        <TextInputControl
          onUnFocus={() => {
            setFocused(false);
            props.onUnFocus();
          }}
          onFocus={() => setFocused(true)}
          onChange={(val) => setSearch(val)}
          value={props.value.searchQuery}
          className="w-full flex-1 bg-transparent px-4 py-4 pl-12 text-search-text placeholder-search-placeholder focus:outline-none sm:py-4 sm:pr-2"
          placeholder={props.placeholder}
        />
      </Flare.Child>
    </Flare.Base>
  );
}
