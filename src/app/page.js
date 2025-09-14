"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className='container'>
      <h1 className='title'>Welcome to YourCounter ⏳</h1>
      <p className='subtitle'>Create and track countdowns easily!</p>

      <div className='buttonsContainer'>
        <button
          className='button'
          onClick={() => router.push("/counter")}
        >
          Create Counter
        </button>

        <button
          className='button'
          onClick={() => router.push("/auth/login")}
        >
          Login
        </button>

        <button
          className='button'
          onClick={() => router.push("/auth/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}
