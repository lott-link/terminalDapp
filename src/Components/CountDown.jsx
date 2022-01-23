import { useState, useEffect } from 'react'

const CountDown = (props) => {
    const [timer,setTimer] = useState(props.time*1000 - new Date().getTime());
    const [days,setDays] = useState(Math.floor(timer / (1000 * 60 * 60 * 24)))
    const [hours,setHours] = useState(Math.floor((timer / (1000 * 60 * 60)) % 24))
    const [minutes,setMinutes] = useState(Math.floor((timer / 1000 / 60) % 60))
    const [seconds,setSeconds] = useState(Math.floor((timer / 1000) % 60))
    const calculateTime = ()=>{
        setDays(Math.floor(timer / (1000 * 60 * 60 * 24)))
        setHours(Math.floor((timer / (1000 * 60 * 60)) % 24))
        setMinutes(Math.floor((timer / 1000 / 60) % 60))
        setSeconds(Math.floor((timer / 1000) % 60))
    }
    useEffect(()=>{
        const time = setTimeout(()=>{
            setTimer(timer-1000)
            calculateTime()
            return ()=>{
                clearTimeout(time)
            }
        },1000)
    },[timer])
    //return days/hours/minutes 
    if(days!==0)
        return (`${days < 10 ? "0"+ days+"d" : days+"d"}:${hours < 10 ? "0"+ hours+"h" : hours+"h"}:${minutes < 10 ? "0"+minutes+"m" : minutes+"m"}`);
    //return hours/minutes/seconds
    else
        return (`${hours < 10 ? "0"+ hours+"h" : hours+"h"}:${minutes < 10 ? "0"+minutes+"m" : minutes+"m"}:${seconds < 10 ? "0"+seconds+"s" : seconds+"s"}`);
      
}

export default CountDown;
