ALTER TABLE public.lesson_progress
  ADD COLUMN answered_checks integer NOT NULL DEFAULT 0,
  ADD COLUMN correct_checks integer NOT NULL DEFAULT 0,
  ADD COLUMN best_correct_checks integer NOT NULL DEFAULT 0;

ALTER TABLE public.lesson_progress
  ADD CONSTRAINT lesson_progress_answered_checks_nonnegative CHECK (answered_checks >= 0),
  ADD CONSTRAINT lesson_progress_correct_checks_valid CHECK (correct_checks >= 0 AND correct_checks <= answered_checks),
  ADD CONSTRAINT lesson_progress_best_correct_checks_nonnegative CHECK (best_correct_checks >= 0);