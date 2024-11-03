
import { TailSpin } from 'react-loading-icons'
import "./loader.css"


export default function Loader() {

    return <>
        <div className='loader'>
            <TailSpin className='loading' stroke="#4A90E2"/>
        </div>
    </>
}