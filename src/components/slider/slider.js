import "./slider.css"
import { useNavigate  } from "react-router-dom";

function Slider() {

const navigate  = useNavigate ()

function nav(rout){
    navigate(rout)
    console.log(rout)

}


    return <>
        <div className="slider">
            <div onClick={() => navigate("/home")}>
                <i className="bi bi-house"></i>
                <p>Home</p>
            </div>
            <div onClick={() => navigate("/profile")}>
                <i className="bi bi-person-circle"></i>
                <p>Profile</p>
            </div>
            <div onClick={() => navigate("/home")}>
                <i className="bi bi-chat"></i>
                <p>Chat</p>
            </div>
        </div>
    </>
}
export default Slider;