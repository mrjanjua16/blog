import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Header from './components/Header.jsx';
import FooterCom from './components/FooterCom.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import OnlyUserPrivateRoute from './components/OnlyUserPrivateRoute.jsx';
import CreatePost from './components/CreatePost.jsx';
import UpdatePost from './pages/UpdatePost.jsx';
import PostPage from './pages/PostPage.jsx';
import ScrollToTop from './components/ScrolToTop.jsx';
import Search from './pages/Search.jsx';

export default function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <div className="pt-16">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/About' element={<About />} />
          <Route path='/Sign-in' element={<SignIn />} />
          <Route path='/Sign-Up' element={<SignUp />} />
          <Route path='/Search' element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path='/Dashboard' element={<Dashboard />} />
          </Route>
          <Route element={<OnlyUserPrivateRoute />}>
          <Route path='/Create-Post' element={<CreatePost />} />
          <Route path='/Update-Post/:postId' element={<UpdatePost />} />
          </Route>
          <Route path='/Projects' element={<Projects />} />
          <Route path='/Post/:postSlug' element={<PostPage />} />
        </Routes>
      </div>
      <FooterCom />
    </BrowserRouter>
    </QueryClientProvider>
  )
}
