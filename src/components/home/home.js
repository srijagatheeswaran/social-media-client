import Slider from "../slider/slider";
import Header from "../header/header";
import { useAuth } from "../../context/AuthContext";
import { useEffect ,useState} from "react";
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Home(){
    const { isAuthenticated, checkAuth } = useAuth();
    const userEmail = localStorage.getItem("email")
    const token = localStorage.getItem("token")
    useEffect(()=>{
        const handleLogin = async () => {
            // console.log(userEmail, token)
            const isValid = await checkAuth(userEmail, token);
            if (isValid) {
                // showContant()
            } else {
                // navigate("/login")
                notifiyinfo('Please Login')
            }
        };
    handleLogin()
    },[])
    function notifiyinfo(info) {
        toast.info(info, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Flip,
        });
    }
    
    function notifiyErr(err) {
        toast.error(err, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Flip,
        });
    }
    function notifiysuccess(data) {
        toast.success(data, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
            transition: Flip,
        });
    }


    return<>
    <Header isAuthenticated={isAuthenticated}/>
    <Slider/>
    <ToastContainer/>
    </>
}
export default Home;