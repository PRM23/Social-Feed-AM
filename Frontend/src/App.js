import logo from "./logo.svg";
import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Feed from "./components/Feed";
import Edit from "./components/Edit";
import Popup from "./components/Popup";
import SnakeBar from "./components/SnakeBar";
import LoginProtectedRoute from "./components/LoginProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" />}></Route>
        <Route element={<LoginProtectedRoute />}>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/signUp" element={<SignUp />}></Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/Feed" element={<Feed />}></Route>
          <Route path="/edit/:id" element={<Edit />}></Route>
          <Route path="/ChangePassword" element={<Popup />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>

    // <Popup />
    // <Feed />
  );
}

export default App;
