
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {
  const [state, setState] = useState({ name: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!state.name || !state.email || !state.password) {
      return setErrorMessage("All fields are required.");
    }
    if (!/^\S+@\S+\.\S+$/.test(state.email)) {
      return setErrorMessage("Invalid email format.");
    }
    if (state.password.length < 6) {
      return setErrorMessage("Password must be at least 6 characters.");
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/user/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent
        body: JSON.stringify(state),
      });

      const responseData = await response.json();
      console.log("📩 Server Response:", responseData);

      if (!response.ok) {
        setErrorMessage(responseData.message || "Something went wrong.");
        return;
      }

      alert("✅ Registration successful! Please log in.");
      router.push("/auth/signin");
    } catch (err) {
      setErrorMessage("Unexpected error occurred. Please try again.");
      console.error("❌ Registration Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="bg-[url('/images/chat.jpg')] bg-cover h-screen hidden lg:block lg:w-[40%] xl:w-[60%]"></div>
      <div className="flex-1 flex h-screen items-center justify-center px-4">
        <form className="w-[90%]" onSubmit={handleSubmit}>
          <h1 className="text-xl font-semibold text-white mb-8">Signup Here!</h1>

          <input type="text" name="name" value={state.name} onChange={onChange} placeholder="Name..." className="w-full h-14 rounded-lg px-4 bg-[#312F2F] text-white" />
          <input type="email" name="email" value={state.email} onChange={onChange} placeholder="Email..." className="w-full h-14 rounded-lg px-4 bg-[#312F2F] text-white mt-4" />
          <input type="password" name="password" value={state.password} onChange={onChange} placeholder="Password..." className="w-full h-14 rounded-lg px-4 bg-[#312F2F] text-white mt-4" />

          <button type="submit" disabled={isLoading} className={`w-full bg-[#00FF38] text-black text-lg font-semibold h-14 px-4 rounded-lg mt-6 ${isLoading && 'opacity-50'}`}>
            {isLoading ? "Signing up..." : "Signup"}
          </button>

          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

          <Link href="/auth/signin" className="inline-block mt-4 text-zinc-400 font-semibold hover:text-white">Already have an account?</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
