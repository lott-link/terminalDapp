import React, { useState, useEffect ,useRef } from 'react'
import QRCodeStyling from "qr-code-styling";
import styles from './QrCode.styles.module.css'
import domtoimage from 'dom-to-image';
const QrCode = ({ profile, background,firstColor,secondColor,rotation,data,qr,text}) => {
    const [options, setOptions] = useState({
      width: 252,
      height: 282,
      type: "svg",
      data,
      // image: "/lottlink-cropped.svg",
      margin: 30,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "Q",
      },
      dotsOptions: {
        // color: '#222222',
        gradient: {
          type: "linear", // 'radial'
          rotation:rotation,
          colorStops :[
              {offset:0,color:firstColor},
              {offset:1,color:secondColor}
          ],
        },
        type: "square",
      },
      backgroundOptions: {
        color: "white",
      },
    });
    const [qrCode] = useState(new QRCodeStyling(options));
    const ref = useRef(null);
    useEffect(() => {
      if (ref.current) {
        qrCode.append(ref.current);
      }
    }, [qrCode, ref]);
    
    
  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options]);

  useEffect(()=>{
    setOptions({...options,data:data})
  },[data])
  return (
    <div ref={qr} className={`${styles[background]}  d-flex flex-column justify-content-center align-items-center`}>
        <div style={{ position: "relative"}}>
          <div
            style={{position: "absolute",left: "101px",top: "-30px",backgroundColor: "white",borderRadius: "50%",border:background === "eth" ?'1px solid #606060':"" }}>
            <img style={{ width: "51px", height: "51px"}}  src={profile} alt="" />
          </div>
          <div ref={ref} className={styles["svg-parent"]} />
        </div>
        <div style={{ position: "absolute",bottom:'45px'}}>
            <div className={`d-flex align-items-center`}>
              <img style={{width:'30px',height:'30px'}} className='filter' src="/lottlinkSingle-cropped.svg" alt="" />
              <div style={{color:"#0eb2cc"}} className='mx-2'>
                {text}
              </div>
            </div>
        </div>
    </div>
  );
};

export default QrCode;
