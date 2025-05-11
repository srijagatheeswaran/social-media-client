import { createContext, useContext } from "react";
import { toast, Flip } from "react-toastify"; 

const ToastContext = createContext();

export const ToastProvider = ({ children }) => { 

    const showToast = (message, type = "success") => {
        toast[type](message, {  
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Flip, 
        });
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children} 
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
