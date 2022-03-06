import Sidebar from '../Components/Sidebar';
import Button from '../Components/styled/Button'
import useWidth from '../Hooks/useWidth';
const HomePage = () => {
    const width = useWidth()  
    return(
    // <div className={`${width > 992 ? "w-25 h-100 mx-auto" : "w-100" }`}>
    <div className={`w-100 `}>
        <div className={`${width > 992 ? "h-100" : "h-50"}`}>
            <Sidebar HomePage={true} />
        </div>
        
    </div>
    )
}
export default HomePage;

