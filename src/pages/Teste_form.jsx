export default function Login() {

  return (
    <main className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Ho le petite teste</h3>
        </div>
        <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg text-left">
          <form className="space-y-5" action="http://localhost:5000/teste" method="POST">
            <input name="username" type="text" required placeholder="User name" className="w-full px-3 py-2 border rounded-lg" />
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg">Se connecter</button>
          </form>
        </div>
      </div>
    </main>
  );
}