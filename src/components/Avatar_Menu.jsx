const AvatarMenu = () => {
  return (
    <div className="relative">
      <button className="w-10 h-10 outline-none rounded-full ring-offset-2 ring-gray-200 hover:ring-2 hidden lg:block">
        <img
          src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg"
          className="w-full h-full rounded-full object-cover"
          alt="Avatar"
        />
      </button>
      <ul className="bg-white top-14 right-0 mt-2 space-y-1 lg:absolute lg:rounded-lg lg:w-52 lg:shadow-lg hidden bg-gray-50">
        <li>
          <a className="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors px-4 py-2.5" href="javascript:void(0)">
            Dashboard
          </a>
        </li>
        <li>
          <a className="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors px-4 py-2.5" href="javascript:void(0)">
            Analytics
          </a>
        </li>
        <li>
          <a className="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors px-4 py-2.5" href="javascript:void(0)">
            Profile
          </a>
        </li>
        <li>
          <a className="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors px-4 py-2.5" href="javascript:void(0)">
            Settings
          </a>
        </li>
        <button className="block w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors px-4 py-2.5 mt-1">
          Logout
        </button>
      </ul>
    </div>
  )
}

export default AvatarMenu;