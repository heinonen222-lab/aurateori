import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/** Cachelivslängd som gäller alla förfrågningar om inte en query valt något eget. */
const STALE_MS = 5 * 60_000;

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Undvik omhämtning vid varje besök/fokusbyte – frågebanken och statistiken
        // ändras sällan under en session.
        staleTime: STALE_MS,
        gcTime: 30 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Ladda nästa sida redan vid tryck/hovring så att bytet känns omedelbart.
    defaultPreload: "intent",
    defaultPreloadStaleTime: STALE_MS,
  });

  return router;
};
