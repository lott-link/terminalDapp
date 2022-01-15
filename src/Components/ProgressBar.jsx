import { useState, useEffect } from "react"
const ProgressBar = ({estimatedTime=10})=>{
    const [now,setNow] = useState(0)
    const progress = ()=>{
        const interval = setInterval(()=>{
            let state;
            setNow(prev => state=prev)
            if(state+100/estimatedTime>=100){
                setNow(100)
                clearInterval(interval)
            }
            else
                setNow(prevState => Math.floor(prevState+100/estimatedTime))
        },1000)
    }
    useEffect(()=>progress(),[])
    return(
        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center" 
        style={{position:'absolute',top:'0',left:'0',zIndex:"20",backgroundColor:"rgba(2,117,216,0.5)"}}>
             <div className="w-25 my-2" style={{background:'white'}}>
                <div style={{width:now+"%",color:"white",backgroundColor:'red',transition:'0.2s',fontSize:'smaller' }}>
                    <span className="d-flex ejustify-content-center">{`${now}%`}</span>
                </div>
            </div>
        </div>
    )
}
export default ProgressBar;