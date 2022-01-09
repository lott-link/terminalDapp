import { Offcanvas } from 'react-bootstrap'
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
