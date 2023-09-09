import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import { MWQuery } from "@/backend/metadata/types/mw";
import { WideContainer } from "@/components/layout/WideContainer";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { HomeLayout } from "@/pages/layouts/HomeLayout";
import { BookmarksPart } from "@/pages/parts/home/BookmarksPart";
import { HeroPart } from "@/pages/parts/home/HeroPart";
import { WatchingPart } from "@/pages/parts/home/WatchingPart";
import { SearchListPart } from "@/pages/parts/search/SearchListPart";
import { SearchLoadingPart } from "@/pages/parts/search/SearchLoadingPart";

function useSearch(search: MWQuery) {
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearch = useDebounce<MWQuery>(search, 500);
  useEffect(() => {
    setSearching(search.searchQuery !== "");
    setLoading(search.searchQuery !== "");
  }, [search]);
  useEffect(() => {
    setLoading(false);
  }, [debouncedSearch]);

  return {
    loading,
    searching,
  };
}

export function HomePage() {
  const { t } = useTranslation();
  const [showBg, setShowBg] = useState<boolean>(false);
  const searchParams = useSearchQuery();
  const [search] = searchParams;
  const s = useSearch(search);

  return (
    <HomeLayout showBg={showBg}>
      <div className="relative z-10 mb-16 sm:mb-24">
        <Helmet>
          <title>{t("global.name")}</title>
        </Helmet>
        <HeroPart searchParams={searchParams} setIsSticky={setShowBg} />
      </div>
      <WideContainer>
        {s.loading ? (
          <SearchLoadingPart />
        ) : s.searching ? (
          <SearchListPart searchQuery={search} />
        ) : (
          <>
            <BookmarksPart />
            <WatchingPart />
          </>
        )}
      </WideContainer>
    </HomeLayout>
  );
}
