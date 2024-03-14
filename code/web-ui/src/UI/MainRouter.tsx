import {Route, Routes, useNavigate} from "react-router-dom";
import UIContainer from "./UIContainer";
import LoginPage from "./Pages/LoginPage"
import {useAppSelector} from "../hooks";
import {useEffect} from 'react';

export default function MainRouter() {
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const handleLogin = () => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }
    useEffect(handleLogin, [isAuthenticated]);
    return (
        <Routes>
            <Route index path="/*" element={<UIContainer/>}/>
            <Route path="/login" element={<LoginPage/>}/>
        </Routes>
    )
}