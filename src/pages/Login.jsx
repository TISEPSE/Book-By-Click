import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    await fetch("http://localhost:5000/login_form", {
      method: "POST",
      body: formData
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Login
        </h2>

        <label className="flex flex-col text-sm text-gray-800">
          Email :
          <input
            type="email"
            name="email"
            required
            className="mt-1 p-2 border border-gray-400 rounded bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="flex flex-col text-sm text-gray-800">
          Password :
          <input
            type="password"
            name="password"
            required
            className="mt-1 p-2 border border-gray-400 rounded bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
