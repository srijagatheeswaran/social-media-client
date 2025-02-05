import "./slider.css"
import { useNavigate } from "react-router-dom";

function Slider() {

    const navigate = useNavigate()



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
            <div onClick={() => navigate("/chat")}>
                <i className="bi bi-chat"></i>
                <p>Chat</p>
            </div>
            <div onClick={() => navigate("/search")}>
                <i className="bi bi-search"></i>
                <p>Search</p>
            </div>

        </div>
    </>
}
export default Slider;