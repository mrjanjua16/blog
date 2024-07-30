import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signOutFailure, signOutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state) => state.user);
  const {theme} = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(
    () => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
      }
    },
    [location.search]
  )

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/sign-out', {
        method: 'POST',
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
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  return (
    <div>
      <Navbar className="border-b-2 whitespace-nowrap fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800">
        <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
          <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg'> MERN Blog</span>
        </Link>
        <form onSubmit={handleSubmit}>
          <TextInput
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
          />
          <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
        </Button>
        </form>
        <div className='flex gap-2 md:order-2'>
          <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={()=>{dispatch(toggleTheme())}}>
            {theme === 'light' ? <FaSun /> : <FaMoon />}
          </Button>
            {currentUser ? (
              <Dropdown 
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt='user'
                    img={currentUser.profilePicture}
                    rounded
                  />
                }
              >
                <Dropdown.Header>
                  <span className='block text-sm'>@{currentUser.username}</span>
                  <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                </Dropdown.Header>
                <Link to='dashboard?tab=profile'>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
              </Dropdown>
            ):(
              <Link to='/sign-in'>
              <Button gradientDuoTone='purpleToBlue'>
                Sign In
              </Button>
            </Link>
            )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={'div'}>
            <Link to='/'>
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/About"} as={'div'}>
            <Link to='/About'>
              About
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/Create-Post"} as={'div'}>
            <Link to='/Create-Post'>
              Write
            </Link>
            </Navbar.Link>
          <Navbar.Link active={path === "/Projects"} as={'div'}>
            <Link to='/Projects'>
              Projects
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}