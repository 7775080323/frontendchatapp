"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import e from "cors";
const Login = () => {
  const [state, setState] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {

    console.log("inside handlesubmit");
    e.preventDefault();
    setErrorMessage(null);
  
    if (!state.email || !state.password) {
      return setErrorMessage("All fields are required.");
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/user/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send cookies
        body: JSON.stringify(state),
      });
  
      const responseData = await response.json();
      console.log("📩 Server Response:", responseData);
  
      if (!response.ok) {
        setErrorMessage(responseData.message || "Invalid credentials.");
        return;
      }
  
      // Extract token and store it in localStorage
      if (responseData.token) {
        localStorage.setItem("authToken", responseData.token);
      } else {
        throw new Error("Token not received.");
      }
  
      // alert("✅ Login successful!");
      router.replace("/"); // Redirect to chat page
    } catch (err) {
      setErrorMessage("Unexpected error occurred. Please try again.");
      console.error("❌ Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex">
      <div className="bg-[url('/images/chat.jpg')] bg-cover h-screen hidden lg:block lg:w-[40%] xl:w-[60%]"></div>
      <div className="flex-1 flex h-screen items-center justify-center px-4">
        <form className="w-[90%]" onSubmit={handleSubmit}>
          <h1 className="text-xl font-semibold text-white mb-8">Login Here!</h1>

          <input type="email" name="email" value={state.email} onChange={onChange} placeholder="Email..." className="w-full h-14 rounded-lg px-4 bg-[#312F2F] text-white" />
          <input type="password" name="password" value={state.password} onChange={onChange} placeholder="Password..." className="w-full h-14 rounded-lg px-4 bg-[#312F2F] text-white mt-4" />

          <button type="submit" disabled={isLoading} className={`w-full bg-[#00FF38] text-black text-lg font-semibold h-14 px-4 rounded-lg mt-6 ${isLoading && 'opacity-50'}`}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          <Link href="/auth/signup" className="inline-block mt-4 text-zinc-400 font-semibold hover:text-white">
            Don&#39;t have an account? Sign up
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
