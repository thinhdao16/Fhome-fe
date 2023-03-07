import { useContext, createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../context/firebase";
import axios from "axios";
const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState("");
  const [buildings, setBuildings] = useState([]);
  const buildingsData = buildings.data
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken();
    setAccessToken(token);
    setUser(user);
  };
  const logOut = () => {
    signOut(auth);
    localStorage.clear();
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        currentUser.getIdToken().then((token) => {
          setAccessToken(token);
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);
  useEffect(() => {
    axios
      .get("https://fhome-be.vercel.app/getBuildings")
      .then((response) => {
        setBuildings(response.data);
        localStorage.setItem("buildings", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user, accessToken,buildingsData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const UserAuth = () => {
  return useContext(AuthContext);
};
