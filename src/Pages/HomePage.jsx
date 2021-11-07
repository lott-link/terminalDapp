import React,{ useState, useEffect} from 'react'
import { useWeb3React } from '@web3-react/core'
const contractAddress = "0x2262F540DF345dE225B4d97651A492308dD1DB1a"
const contractABI = [{"inputs":[{"internalType":"address","name":"_registerContract","type":"address"},{"internalType":"address","name":"_randomNumberConsumer","type":"address"},{"internalType":"address","name":"_NFTContractAddress","type":"address"},{"internalType":"address","name":"_chanceRoomLibrary","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newLibrary","type":"address"},{"indexed":false,"internalType":"uint256","name":"updateTime","type":"uint256"}],"name":"ChanceRoomLibraryUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newNFTContract","type":"address"},{"indexed":false,"internalType":"uint256","name":"updateTime","type":"uint256"}],"name":"NFTContractUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"chanceRoom","type":"address"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"NewChanceRoom","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newConsumer","type":"address"},{"indexed":false,"internalType":"uint256","name":"updateTime","type":"uint256"}],"name":"RandomNumberConsumerUpdated","type":"event"},{"inputs":[],"name":"NFTContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"chanceRoomLibrary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"chanceRooms","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int256","name":"_length","type":"int256"},{"internalType":"int256","name":"_offset","type":"int256"}],"name":"chanceRoomsCloned","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"creatorToRooms","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"info","type":"string"},{"internalType":"string","name":"baseURI","type":"string"},{"internalType":"uint256","name":"gateFee","type":"uint256"},{"internalType":"uint256","name":"percentCommission","type":"uint256"},{"internalType":"uint256","name":"userLimit","type":"uint256"},{"internalType":"uint256","name":"timeLimit","type":"uint256"}],"name":"newChanceRoom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_chanceRoomLibrary","type":"address"}],"name":"newChanceRoomLibrary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_NFTContractAddress","type":"address"}],"name":"newNFTContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_randomNumberConsumer","type":"address"}],"name":"newRandomNumberConsumer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"numberOfClonedChanceRooms","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"randomNumberConsumer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"registerContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const HomePage = () => {
    const { active,library } = useWeb3React()
    const [events,setEvents] = useState()
    const getPastEvents = async ()=>{
        let allEvents = [];
        const firstBlock = 21122189; 
        const lastBlock = await library.eth.getBlockNumber().then(res=>res)
        const contract = new library.eth.Contract(contractABI,contractAddress);
        for(let i = firstBlock; i < lastBlock ; i+=1000){
            contract.getPastEvents("NewChanceRoom",{fromBlock:i,toBlock:i+1000},
            (error,events)=>{
                if(events && events.length !== 0){
                    events.map(event=>allEvents.push(event))
                }
            })
        }
        setEvents(allEvents)
    }
    useEffect(()=>{
        if(active){
            getPastEvents()
        }
    },[active])
    useEffect(()=>{
        if(events){
            console.log("events",events)
        }
    },[events])
    return (
        <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{overflow:'auto'}}>
            <div>
                <div style={{whiteSpace:'pre'}}> =======================================================================</div>
                <div style={{whiteSpace:'pre'}}>  ██       ██████  ████████ ████████    ██      ██ ███    ██ ██   ██</div>
                <div style={{whiteSpace:'pre'}}>  ██      ██    ██    ██       ██       ██      ██ ████   ██ ██  ██</div>
                <div style={{whiteSpace:'pre'}}>  ██      ██    ██    ██       ██       ██      ██ ██ ██  ██ █████</div>
                <div style={{whiteSpace:'pre'}}>  ██      ██    ██    ██       ██       ██      ██ ██  ██ ██ ██  ██</div>
                <div style={{whiteSpace:'pre'}}>  ███████  ██████     ██       ██    ██ ███████ ██ ██   ████ ██   ██    </div>
                <div style={{whiteSpace:'pre'}}></div>
                <div style={{whiteSpace:'pre'}}> ================ Open source smart contract on EVM ===================</div>
                <div style={{whiteSpace:'pre'}}>  =============== Verify Random Function by ChanLink ================</div>
            </div>
        </div>
    )
}
export default HomePage;