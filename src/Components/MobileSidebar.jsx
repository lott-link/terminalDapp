import { useEffect, useState } from 'react'
import { Offcanvas } from 'react-bootstrap'
import { useWeb3React } from "@web3-react/core";
import Sidebar from './Sidebar';
const MobileSidebar = ({show,handleClose}) => {
    return (
        <Offcanvas style={{background:'lightGray'}} show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
            <Sidebar/>
        </Offcanvas.Body>
      </Offcanvas>
    )
}

export default MobileSidebar
