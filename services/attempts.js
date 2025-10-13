import { supabase } from './supabase'
import { fetchQuizById } from './quizzes'
import { fetchQuizQuestions } from './quizzes'

export async function createQuizAttempt({ quiz_id, user_id }) {
  const quiz = await fetchQuizById(quiz_id)
  const questions = await fetchQuizQuestions(quiz_id)
  const snapshot = { ...quiz, questions }
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      quiz_id,
      user_id,
      started_at: new Date().toISOString(),
      snapshot_quiz: snapshot,
    })
    .select('*')
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function completeQuizAttempt(id, { score }) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .update({ score, completed_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function createAnswersBatch(inputs) {
  if (!Array.isArray(inputs) || inputs.length === 0) return []
  const { data, error } = await supabase
    .from('answers')
    .insert(inputs)
    .select('*')
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function calculateAttemptScore(attemptId) {
  const { data, error } = await supabase
    .rpc('calculate_attempt_score', { attempt_id_input: attemptId })
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function fetchAttemptById(attemptId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('id', attemptId)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function fetchAttemptsByUserId(userId) {


  let query = supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })



  const { data, error } = await query;
  if (error) {
    throw new Error(error.message)
  }
  return data
}

