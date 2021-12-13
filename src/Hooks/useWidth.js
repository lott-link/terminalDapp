import { useState, useEffect } from 'react'

const useWidth = () => {
    const [width,setWidth] = useState(window.innerWidth);
    useEffect(()=>{
        window.addEventListener('resize',()=>setWidth(window.outerWidth))
    },[])
    return width;
}

export default useWidth