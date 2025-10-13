import { supabase } from './supabase'

export async function fetchAnswersByAttemptId(attemptId) {
  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('attempt_id', attemptId)
    .order('created_at', { ascending: true })
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function createAnswer(input) {
  const isCorrect = input.selected_option === input.correct_option
  const { data, error } = await supabase
    .from('answers')
    .insert({
      attempt_id: input.attempt_id,
      question_id: input.question_id,
      selected_option: input.selected_option,
      is_correct: isCorrect,
    })
    .select('*')
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function createAnswersBatch(inputs) {
  const records = inputs.map((input) => ({
    attempt_id: input.attempt_id,
    question_id: input.question_id,
    selected_option: input.selected_option,
    is_correct: input.selected_option === input.correct_option,
  }))
  const { data, error } = await supabase
    .from('answers')
    .insert(records)
    .select('*')
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function calculateAttemptScore(attemptId) {
  const { data, error } = await supabase
    .from('answers')
    .select('is_correct')
    .eq('attempt_id', attemptId)
  if (error) {
    throw new Error(error.message)
  }
  const score = data.filter((answer) => answer.is_correct).length
  return score
}

