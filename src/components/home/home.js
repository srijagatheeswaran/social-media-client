import Slider from "../slider/slider";
import Header from "../header/header";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';




function Home() {
    const userEmail = localStorage.getItem("email")
    const token = localStorage.getItem("token")
    



    return <>
        <Header />
        <Slider />
    </>
}
export default Home;