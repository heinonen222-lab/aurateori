import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "./useAuth";
import { useSubscription } from "./useSubscription";
import { QUESTIONS } from "@/data/questions";
import { getPremiumQuestions } from "@/utils/questions.functions";

export function useQuestions() {
  const { user, loading: authLoading } = useAuth();
  const { isActive, loading: subLoading } = useSubscription();
  const fetchQuestions = useServerFn(getPremiumQuestions);
  const query = useQuery({
    queryKey: ["premium-questions", user?.id],
    enabled: Boolean(user && isActive),
    queryFn: () => fetchQuestions(),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
  return { ...query, questions: [...QUESTIONS, ...(user && isActive ? query.data ?? [] : [])], isPremium: isActive,
    ready: !authLoading && !(user && subLoading) && !(user && isActive && query.isPending && !query.isError) };
}