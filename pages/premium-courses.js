import Head from "next/head";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchPremiumCourses } from "../services/courses";
import { useProfileStore } from "../stores/profile";

export default function PremiumCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingId, setIsLoadingId] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const isAdmin = useProfileStore((state) => state.isAdmin);
  const isTestEnv = useMemo(() => {
    return (process.env.NEXT_PUBLIC_CASHFREE_ENV || "TEST") !== "LIVE";
  }, []);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPremiumCourses();
      setCourses(data);
    } catch (err) {
      console.error("Error loading courses:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePayNow(course) {
    setIsLoadingId(course.id);
    const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("authToken");
    if (!isAuthenticated) {
      router.push({ pathname: "/login", query: { returnUrl: `/checkout?courseId=${course.id}&courseName=${encodeURIComponent(course.title)}&amount=${course.price}` } });
      setIsLoadingId("");
      return;
    }
    router.push({ pathname: "/checkout", query: { courseId: course.id, courseName: course.title, amount: course.price } });
  }

  return (
    <>
      <Head>
        <title>Premium Courses</title>
      </Head>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Premium Courses</h1>
          {profile && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-600">
                {profile.first_name && profile.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile.email || "User"}
              </span>
              {isAdmin && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
          )}
        </div>
        <span className={`text-sm px-2 py-1 rounded ${isTestEnv ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
          {isTestEnv ? "TEST MODE" : "LIVE MODE"}
        </span>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Loading courses...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Error loading courses</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={loadCourses}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && courses.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          <p>No premium courses available at the moment.</p>
        </div>
      )}

      {!isLoading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="border rounded p-4 shadow-sm bg-white">
              <h2 className="text-xl font-medium mb-1">{course.title}</h2>
              <p className="text-gray-600 text-sm mb-3">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold">₹{course.price}</span>
                <button
                  className="inline-flex text-white bg-blue-500 border-0 py-2 px-4 focus:outline-none hover:bg-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePayNow(course)}
                  disabled={isLoadingId === course.id}
                >
                  {isLoadingId === course.id ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 text-xs text-gray-500">
        <p>For demo/testing only. Payments use Cashfree sandbox credentials.</p>
      </div>
    </>
  );
}


