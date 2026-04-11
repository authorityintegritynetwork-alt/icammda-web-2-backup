import { useCallback } from "react";
import { useGetSiteContent } from "@workspace/api-client-react";

/**
 * Returns a helper function `c(key, fallback)` that looks up site content from
 * the DB. Falls back to the hardcoded string if the key is not found.
 * All content is loaded once globally via React Query (cached).
 */
export function useSiteContent() {
  const { data = [] } = useGetSiteContent(
    {},
    { query: { staleTime: 60_000 } },
  );

  return useCallback(
    (key: string, fallback = "") => {
      const found = data.find((c) => c.key === key);
      return found?.value ?? fallback;
    },
    [data],
  );
}
