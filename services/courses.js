import { supabase } from "./supabase";

/**
 * Fetch all active premium courses
 * @returns {Promise<Array>} List of active premium courses
 */
export async function fetchPremiumCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("id, title, description, price, is_premium, is_active")
    .eq("is_active", true)
    .eq("is_premium", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Fetch a course by ID
 * @param {string} courseId - The course ID
 * @returns {Promise<Object>} Course details
 */
export async function fetchCourseById(courseId) {
  const { data, error } = await supabase
    .from("courses")
    .select("id, title, description, price, is_premium, is_active")
    .eq("id", courseId)
    .eq("is_active", true)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

