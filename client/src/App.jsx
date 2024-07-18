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
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute.jsx';
import CreatePost from './pages/CreatePost.jsx';


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/About' element={<About />} />
        <Route path='/Sign-in' element={<SignIn />} />
        <Route path='/Sign-Up' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/Dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/Create-Post' element={<CreatePost />} />
        </Route>
        <Route path='/Projects' element={<Projects />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  )
};