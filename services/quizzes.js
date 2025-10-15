import { supabase } from "./supabase";


export async function fetchQuizzes() {

  let query = supabase  
    .from("quizzes")
    .select(`
      *,
      created_by:profiles (
        id,
        first_name,
        last_name,
        email
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function fetchQuizById(id) {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`*, created_by:profiles (
      id,
      first_name,
      last_name,
      email
    )`)
    .eq('id', id)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data;
}

export async function fetchQuizzesByIds(ids) {
  if (ids.length === 0) return []
  const { data, error } = await supabase
    .from('quizzes')
    .select(`*, created_by:profiles (
      id,
      first_name,
      last_name,
      email
    )`)
    .in('id', ids)
  if (error) {
    throw new Error(error.message)
  }
  return data;
}


export async function fetchQuizQuestions(quizId) {
    const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('created_at', { ascending: false })
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function fetchQuizzesWithUserAttempts(userId) {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      created_by:profiles (
        id,
        first_name,
        last_name,
        email
      ),
      user_attempts:quiz_attempts!left (
        id,
        quiz_id,
        completed_at,
        started_at
      )
    `)
    .eq('is_active', true)
    .eq('user_attempts.user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}