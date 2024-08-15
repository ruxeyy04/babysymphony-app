import { GoogleAuthContext } from "@/context/GoogleAuthContext";
import { useContext } from "react";

export const useGoogleAuth = () => useContext(GoogleAuthContext);
