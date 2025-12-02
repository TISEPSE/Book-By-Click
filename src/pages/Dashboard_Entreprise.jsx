import {useEffect, useRef, useState} from "react"
import {CalendarDaysIcon} from "@heroicons/react/24/outline"

const AvatarMenu = () => {
  const [state, setState] = useState(false)
  const profileRef = useRef()

  const navigation = [
    {title: "Dashboard", path: "javascript:void(0)"},
    {title: "Analytics", path: "javascript:void(0)"},
    {title: "Profile", path: "javascript:void(0)"},
    {title: "Settings", path: "javascript:void(0)"},
  ]

  useEffect(() => {
    const handleDropDown = e => {
      if (!profileRef.current.contains(e.target)) setState(false)
    }
    document.addEventListener("click", handleDropDown)
    return () => document.removeEventListener("click", handleDropDown)
  }, [])

  return (
    <div className="relative">
      <button
        ref={profileRef}
        className="w-10 h-10 outline-none rounded-full ring-offset-2 ring-gray-200 hover:ring-2 hidden lg:block"
        onClick={() => setState(!state)}
      >
        <img
          src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg"
          className="w-full h-full rounded-full object-cover"
          alt="Avatar"
        />
      </button>
      <ul
        className={`bg-white top-14 right-0 mt-2 space-y-1 lg:absolute lg:rounded-lg lg:w-52 lg:shadow-lg ${
          state ? "lg:block" : "lg:hidden"
        } bg-gray-50`}
      >
        {navigation.map((item, idx) => (
          <li key={idx}>
            <a
              className="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors px-4 py-2.5"
              href={item.path}
            >
              {item.title}
            </a>
          </li>
        ))}
        <button className="block w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors px-4 py-2.5 mt-1">
          Logout
        </button>
      </ul>
    </div>
  )
}

export default () => {
  const [state, setState] = useState(false)

  const submenuNav = [
    {title: "Overview", path: "javascript:void(0)"},
    {title: "Integration", path: "javascript:void(0)"},
    {title: "Billing", path: "javascript:void(0)"},
    {title: "Transactions", path: "javascript:void(0)"},
    {title: "Plans", path: "javascript:void(0)"},
  ]

  return (
    <header className="text-base lg:text-sm bg-white border-b border-gray-200">
      <div
        className={`items-center gap-x-14 px-4 max-w-screen-xl mx-auto lg:flex lg:px-8 ${
          state ? "h-full fixed inset-x-0" : ""
        }`}
      >
        <div className="flex items-center justify-between py-3 lg:py-5">
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="w-8 h-8 text-indigo-600 " />
            <a href="/" className="text-xl font-bold text-gray-900">
              Book By Click
            </a>
          </div>
          <div className="lg:hidden">
            <button
              className="text-gray-500 hover:text-gray-800 p-2"
              onClick={() => setState(!state)}
            >
              {state ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm8.25 5.25a.75.75 0 01.75-.75h8.25a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div
          className={`nav-menu flex-1 pb-28 mt-8 overflow-y-auto max-h-screen lg:block lg:overflow-visible lg:pb-0 lg:mt-0 ${
            state ? "" : "hidden"
          }`}
        >
          <ul className="items-center space-y-6 lg:flex lg:space-x-6 lg:space-y-0">
            <form
              onSubmit={e => e.preventDefault()}
              className="flex-1 items-center justify-start pb-4 lg:flex lg:pb-0"
            >
              <div className="flex items-center gap-2 px-3 border border-gray-200 rounded-lg bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-2 py-2 text-gray-700 bg-transparent rounded-md outline-none placeholder:text-gray-400"
                />
              </div>
            </form>
            <AvatarMenu />
          </ul>
        </div>
      </div>
      <nav className="border-gray-100">
        <ul className="flex items-center gap-x-3 max-w-screen-xl mx-auto px-4 overflow-x-auto lg:px-8">
          {submenuNav.map((item, idx) => (
            <li
              key={idx}
              className={`py-1 ${
                idx === 0 ? "border-b-2 border-indigo-600" : ""
              }`}
            >
              <a
                href={item.path}
                className="block py-2 px-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 duration-150"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
