import './App.css';
import Post from "./Post";
import Header from "./Header";
import {Route, Routes} from "react-router-dom";
import Layout from './Layout';
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';
import PostPage from './pages/PostPage';
import { UserContextProvider } from './UserContext';
import EditPostPage from './pages/EditPostPage';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
         <Route index element={<IndexPage/>} />
         <Route path="/login" element={<LoginPage/>} />
         <Route path="/register" element={<RegisterPage/>} />
         <Route path="/profile" element={<ProfilePage/>} />
         <Route path="/create" element={<CreatePostPage/>} />
         <Route path="/post/:id" element={<PostPage/>} />
         <Route path="/edit/:id" element={<EditPostPage/>} />
        </Route>
     </Routes>
    </UserContextProvider>
  );
}

export default App;
