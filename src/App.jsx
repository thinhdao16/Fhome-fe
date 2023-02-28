import "./assets/libs/boxicons-2.1.1/css/boxicons.min.css";
import "./scss/App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import User from "./pages/Users/User";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layout/MainLayout";
import Profile from "./pages/Profiles/Profile";
import React from "react";
import Protected from "../src/components/context/Protected";
import { AuthContextProvider } from "./components/context/AuthContext";
import Login from "./pages/login/Login";
import Upload from "./pages/Uploads/Upload";
function App() {
  return (
    // <BrowserRouter>
    //     <Routes>
    //         <Route path="/" element={<MainLayout />}>
    //             <Route index element={<Dashboard />} />

    //         </Route>
    //     </Routes>
    // </BrowserRouter>

    <React.Fragment>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              {/* <Route path="/home" element={<Protected><Home /></Protected>} />
                    <Route path="/profile" element={<List />} /> */}
              <Route path="home" element={<MainLayout />}>
                <Route
                  index
                  element={
                    <Protected>
                      <Dashboard />
                    </Protected>
                  }
                />
                <Route path="users" element={<Protected><User /></Protected>} />
                <Route path="uploads" element={<Protected><Upload /></Protected>} />
                <Route path="customers" element={<Protected><User /></Protected>} />
                <Route path="settings" element={<Protected><User /></Protected>} />
                <Route path="stats" element={<Protected><User /></Protected>} />
                <Route path="profiles" element={<Protected><Profile /></Protected>} />
              </Route>
              <Route exact path="" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </React.Fragment>
  );
}

export default App;
