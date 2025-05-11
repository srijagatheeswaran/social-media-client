import Loader from "../../loader/loader";
import "./update.css";
import { useToast } from "../../../context/toastContext";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function Update({ showUpdateHandle, addClass, data }) {
    const [input, setInput] = useState({
        name: data?.name || "",
        gender: data?.gender || "",
        bio: data?.bio || "",
    });

    useEffect(() => {
        setInput({
            name: data?.name || "",
            gender: data?.gender || "",
            bio: data?.bio || "",
        });
    }, [data]); 

    const [loader, setLoader] = useState(false);
    let Toaster = useToast();

    function change(e) {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <>
            <div className={`update ${addClass ? "show" : ""}`}>
                <div className="box">
                    <i className="bi bi-x" onClick={showUpdateHandle}></i>
                    <h3>Update Details</h3>
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        onChange={change}
                        value={input.name}
                    />
                    <select name="gender" onChange={change} value={input.gender}>
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                    </select>
                    <textarea
                        placeholder="Bio"
                        name="bio"
                        onChange={change}
                        value={input.bio}
                    />

                    <button className="btn btn-success">Update</button>
                </div>
                {loader && <Loader />}
            </div>
        </>
    );
}
