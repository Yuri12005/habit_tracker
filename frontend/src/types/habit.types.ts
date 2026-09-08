export interface IHabit {
  id: number;
  title: string;
  color: string;
  created_at: string;
  is_active: boolean;
  user: string;
  current_streak: number;
  today_log_id?: number | null;
  end_date: string | null;
}
