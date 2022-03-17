import Sidebar from '../../Components/Sidebar';
import Button from '../../Components/styled/Button'
import useWidth from '../../Hooks/useWidth';
const HomePage = () => {
    const width = useWidth()
    if(width < 992)
        return(
            <Sidebar HomePage={true} />
        )
    else 
    return (
        <div className="w-100 d-flex flex-column align-items-center justify-content-center" style={{overflow:'auto',minHeight: "calc(100vh - 7.5rem)"}}>
            <div>
                <div style={{whiteSpace:'pre'}}> =======================================================================</div>
                <div style={{whiteSpace:'pre'}}>  ██       ██████  ████████ ████████    ██      ██ ███    ██ ██   ██</div>
                <div style={{whiteSpace:'pre'}}>  ██      ██    ██    ██       ██       ██      ██ ████   ██ ██  ██</div>
                <div style={{whiteSpace:'pre'}}>  ██      ██    ██    ██       ██       ██      ██ ██ ██  ██ █████</div>
                <div style={{whiteSpace:'pre'}}>  ██      ██    ██    ██       ██       ██      ██ ██  ██ ██ ██  ██</div>
                <div style={{whiteSpace:'pre'}}>  ███████  ██████     ██       ██    ██ ███████ ██ ██   ████ ██   ██    </div>
                <div style={{whiteSpace:'pre'}}></div>
                <div style={{whiteSpace:'pre'}}> ================ Open source smart contract on EVM ===================</div>
                <div style={{whiteSpace:'pre'}}>  =============== Verify Random Function by ChainLink ================</div>
            </div>
            <div className='mt-5'>
                <h5 className='text-center'>Get free faucet</h5>
                <div>
                    <a href="https://faucet.rinkeby.io/" target="_blank" rel="noreferrer" >
                        <Button>Rinkeby</Button>
                    </a>
                    <a href="https://faucet.polygon.technology/" target="_blank" rel="noreferrer">
                        <Button>Mumbai</Button>
                    </a>
                    <a href="https://faucets.chain.link/fuji" target="_blank" rel="noreferrer">
                        <Button>Fuji</Button>
                    </a>
                </div>
            </div>
        </div>
    )
}
export default HomePage;

