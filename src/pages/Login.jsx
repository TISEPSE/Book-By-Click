export default function LoginForm() {
  return (
    <div className="flex items-center justify-center mt-10">
      <form
        action="http://localhost:5000/login_form"
        method="POST"
        className="w-80 flex flex-col gap-4 p-6 rounded shadow-md"
        style={{
          backgroundColor: "#ffffffff",
          border: "1px solid #e5e5e500"
        }}
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
            className="mt-1 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ border: "1px solid #e5e5e500", backgroundColor: "#F2F2F2" }}
          />
        </label>

        <label className="flex flex-col text-sm text-gray-800">
          Password :
          <input
            type="password"
            name="password"
            required
            className="mt-1 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ border: "1px solid #e5e5e500", backgroundColor: "#F2F2F2" }}
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
