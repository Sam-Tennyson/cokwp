import Head from "next/head";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";

const SAMPLE_COURSES = [
  {
    id: "eng-foundations",
    title: "English Foundations",
    description: "Master grammar, vocabulary, and communication basics.",
    amount: 499,
  },
  {
    id: "math-olympiad",
    title: "Math Olympiad",
    description: "Challenging problems and strategies for competitions.",
    amount: 799,
  },
  {
    id: "science-lab",
    title: "Science Lab",
    description: "Interactive experiments and concept visualizations.",
    amount: 699,
  },
];

export default function PremiumCourses() {
  const [isLoadingId, setIsLoadingId] = useState("");
  const router = useRouter();
  const isTestEnv = useMemo(() => {
    return (process.env.NEXT_PUBLIC_CASHFREE_ENV || "TEST") !== "LIVE";
  }, []);

  async function handlePayNow(course) {
    setIsLoadingId(course.id);
    const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("authToken");
    if (!isAuthenticated) {
      router.push({ pathname: "/login", query: { returnUrl: `/checkout?courseId=${course.id}&courseName=${encodeURIComponent(course.title)}&amount=${course.amount}` } });
      setIsLoadingId("");
      return;
    }
    router.push({ pathname: "/checkout", query: { courseId: course.id, courseName: course.title, amount: course.amount } });
  }

  return (
    <>
      <Head>
        <title>Premium Courses</title>
      </Head>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Premium Courses</h1>
        <span className={`text-sm px-2 py-1 rounded ${isTestEnv ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
          {isTestEnv ? "TEST MODE" : "LIVE MODE"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE_COURSES.map((course) => (
          <div key={course.id} className="border rounded p-4 shadow-sm bg-white">
            <h2 className="text-xl font-medium mb-1">{course.title}</h2>
            <p className="text-gray-600 text-sm mb-3">{course.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-semibold">₹{course.amount}</span>
              <button
                className="inline-flex text-white bg-blue-500 border-0 py-2 px-4 focus:outline-none hover:bg-blue-600 rounded"
                onClick={() => handlePayNow(course)}
                disabled={isLoadingId === course.id}
              >
                {isLoadingId === course.id ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-xs text-gray-500">
        <p>For demo/testing only. Payments use Cashfree sandbox credentials.</p>
      </div>
    </>
  );
}


