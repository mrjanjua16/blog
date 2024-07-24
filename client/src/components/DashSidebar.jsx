import { Sidebar } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOutFailure, signOutSuccess } from '../redux/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { FcBusinessman, FcEditImage, FcSportsMode, FcDocument, FcCollaboration, FcComments } from "react-icons/fc";

export default function DashSidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  useEffect(()=>{
    const UrlParams = new URLSearchParams(location.search);
    const tabFromUrl = UrlParams.get("tab");
    
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  }, [location.search]);


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

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
          <Sidebar.Item active={tab === 'profile'} icon={FcBusinessman} label={currentUser.isAdmin ? "Admin" : "User"} labelColor='dark' as='div'>
            Profile
          </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=create-post'>
            <Sidebar.Item active={tab === 'create-post'} icon={FcEditImage} labelColor='dark' as='div'>
              Create Post
            </Sidebar.Item>
            </Link>  
          )}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item active={tab === 'posts'} icon={FcDocument} labelColor='dark' as='div'>
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item active={tab === 'users'} icon={FcCollaboration} labelColor='dark' as='div'>
                Users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item active={tab === 'comments'} icon={FcComments} labelColor='dark' as='div'>
                Comments
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item onClick={handleSignOut} icon={FcSportsMode} className="cursor-pointer">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
