import { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutFailure, signOutSuccess } from "../redux/user/userSlice";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/sign-out", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signOutFailure(data.message));
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center p-2 z-50">
    <Navbar className="w-[95%] lg:w-[85%] xl:w-[75%] 2xl:w-[65%] backdrop-blur-md bg-white/20 dark:bg-gray-900/70 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center justify-between w-full px-4 lg:px-8">
        <div className="flex justify-center">
        {/* Left section: Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-wide whitespace-nowrap text-gray-800 dark:text-white"
        >
          <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">
            Blog
          </span>
        </Link>

        {/* Desktop Navigation Links (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-6 ml-6">
          <Link
            to="/"
            className={`hover:text-indigo-500 transition-colors ${
              path === "/" ? "text-indigo-500" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/About"
            className={`hover:text-indigo-500 transition-colors ${
              path === "/About" ? "text-indigo-500" : ""
            }`}
          >
            About
          </Link>
          <Link
            to="/Create-Post"
            className={`hover:text-indigo-500 transition-colors ${
              path === "/Create-Post" ? "text-indigo-500" : ""
            }`}
          >
            Write
          </Link>
          <Link
            to="/Projects"
            className={`hover:text-indigo-500 transition-colors ${
              path === "/Projects" ? "text-indigo-500" : ""
            }`}
          >
            Projects
          </Link>
        </div>
        </div>

        <div className="flex justify-center gap-4">
        {/* Center section: Search Bar (hidden on small screens) */}
        <form
          onSubmit={handleSubmit}
          className="hidden md:flex items-center gap-2 ml-4"
        >
          <TextInput
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md"
          />
          <Button color="gray" type="submit" className="rounded-md">
            <AiOutlineSearch size={20} />
          </Button>
        </form>

        {/* Right section: Theme Toggle, Profile, and Mobile Menu Toggle */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme Toggle */}
          <Button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-slate-300 hover:shadow-md"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? (
              <FaSun size={18} className="text-yellow-500" />
            ) : (
              <FaMoon size={18} className="text-blue-500" />
            )}
          </Button>

          {/* User Dropdown */}
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={currentUser.profilePicture} className="bg-white rounded-full" rounded />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to="dashboard?tab=profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" className="rounded-md">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Navbar.Toggle />
          </div>
        </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <Navbar.Collapse className="md:hidden">
        {/* Search Bar for mobile */}
        <form onSubmit={handleSubmit} className="p-2">
          <TextInput
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md"
          />
        </form>

        {/* Navigation Links for mobile */}
        <Navbar.Link
          active={path === "/"}
          as="div"
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Link to="/" className="block py-2 px-4">
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link
          active={path === "/About"}
          as="div"
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Link to="/About" className="block py-2 px-4">
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link
          active={path === "/Create-Post"}
          as="div"
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Link to="/Create-Post" className="block py-2 px-4">
            Write
          </Link>
        </Navbar.Link>
        <Navbar.Link
          active={path === "/Projects"}
          as="div"
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Link to="/Projects" className="block py-2 px-4">
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
    </div>
  );
}
