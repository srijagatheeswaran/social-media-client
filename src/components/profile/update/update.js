import Loader from "../../loader/loader";
import "./update.css"
import { useState } from 'react';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Update({ showUpdateHandle, addClass, email}) {

    const [input, setInput] = useState({})
    const [message, setMessage] = useState({})
    const [loader, setloader] = useState(false)


    function notifiyErr(err) {
        toast.error(err, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            theme: "colored",
            transition: Flip,
            closeButton: true
        });
        
    }
    function notifiysuccess(data) {
        toast.success(data, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            // pauseOnHover: true,
            draggable: true,
            // progress: 0,
            theme: "colored",
            transition: Flip,
        });
    }

    function change(e) {
        const name = e.target.name;
        const value = e.target.value;
        setInput((pre) => { return { ...pre, [name]: value } })

    }
    function UpdateDetails(e) {
        e.preventDefault()
        setloader(true)
        // console.log(input)
        fetch('http://localhost:3000/updateUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                name: input.name,
                gender: input.gender,
                bio: input.bio
            })
        })
            .then(response => {
                const status = response.status;
                return response.json().then(data => ({ data, status }));
            })
            .then(({ data, status }) => {
                setloader(false)
                if (data.message) {
                    if (status === 400) {
                        notifiyErr(data.message)
                    }
                    else {
                        // setMessage(data.message);
                        showUpdateHandle("update")
                        notifiysuccess(data.message)
                        setInput({ name: "", bio: "", gender: "" })

                    }

                } else {
                    setMessage('Login failed');
                    notifiyErr('Login failed')
                }
            })
            .catch(error => {
                setloader(false)
                console.error('Error:', error);
                setMessage('An error occurred');
                notifiyErr(error)

            });

    }
    return <>
        <div className={`update ${addClass?'show':""}`}>
            <div className="box">
                <i className="bi bi-x" onClick={showUpdateHandle}></i>
                <h1>Update</h1>
                <input type="text" placeholder="name" name="name" onChange={change} value={input.name} />
                <select name="gender" onChange={change} value={input.gender}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>
                <textarea placeholder="Bio" name="bio" onChange={change} value={input.bio} />

                <button className="btn btn-success" onClick={UpdateDetails}>Update</button>
            </div>
            {loader ? <Loader /> : null}
        </div>
    </>
}