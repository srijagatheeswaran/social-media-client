import Loader from "../../loader/loader";
import "./update.css";
import { useToast } from "../../../context/toastContext";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import customFetch from "../../../api";


export default function Update({ showUpdateHandle, addClass, data ,fetchProfile }) {
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
const handleUpdateUser = async (input, data) => {
            // console.log(input); 
            // console.log(data);

            try {
                const { status, body } = await customFetch(`profile/updateUser`, {
                    method: "POST",
                    body: JSON.stringify({ ...input, email: data.email }),
                });

                if (status === 200) {
                    Toaster("User updated successfully", "success");
                    setLoader(false);
                    showUpdateHandle('update');
                    fetchProfile(); 
                } else {
                    Toaster(body?.message || "Failed to update user", "error");
                }
            } catch (error) {
                console.error("Update error:", error);
                Toaster("Something went wrong", "error");
            }
        };
    const Update = () => {
        if (!input.name.trim()) {
            Toaster("Please enter your name", "error");
            return;
        } else {
            handleUpdateUser(input, data);
        }

    }

    return (
        <>
            <div className={`update ${addClass ? "show" : ""}`}>
                <div className="box">
                    <i className="bi bi-x remove_btn" onClick={showUpdateHandle}></i>
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

                    <button className="btn btn-success" onClick={Update}>Update</button>
                </div>
                {loader && <Loader />}
            </div>
        </>
    );
}
