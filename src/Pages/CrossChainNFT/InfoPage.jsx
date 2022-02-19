import React from 'react'
import Button from '../../Components/styled/Button'
import styles from './SelectNFT.module.css'
import useWidth from '../../Hooks/useWidth'
const InfoPage = ({setCircles,setStages,setSelectedWay}) => {
    const width = useWidth()
    const lockAndMint = ()=>{
        setCircles([true,true,false])
        setStages([false,true,false])
        setSelectedWay(true)
    }
    const burnAndRelease = ()=>{
        setCircles([true,true,false])
        setStages([false,true,false])
        setSelectedWay(false)
    }
    return (
        <div className={`${width < 992 ? "w-100" : "w-50"} h-100 p-2 mx-auto ${styles["animation-in"]}`} 
        style={{borderRight:"1px solid white",borderLeft:"1px solid white",position:"relative"}}>
            <div className='w-100 h-100 d-flex flex-column' style={{border:"1px solid white"}}>
                <div className='text-center py-4' style={{borderBottom:"1px solid white",fontSize:"22px"}}>
                    Info
                </div>
                <div className='d-flex flex-column' style={{position:'relative',flexGrow:"1"}}>
                    <div className='py-4'>
                        <div className='px-4 text-center'>
                            We provide multiple CCN (Cross-Chain-NFT) 
                            contracts in multiple networks.
                            You can lock your NFT in CCN-contract 
                            and mint the same NFT on other networks.
                        </div>
                        <div className='d-flex justify-content-center'>
                            <Button primary onClick={lockAndMint}>Lock and Mint</Button>
                        </div>
                    </div>
                    <div className='py-4'>
                        <div className='px-4 text-center'>
                            You can claim back your original NFT with 
                            the ownership of the minted NFT on CCN contracts.
                        </div>
                        <div className='d-flex justify-content-center'>
                            <Button primary onClick={burnAndRelease}>Burn and Release</Button>
                        </div>
                    </div>
                    <div className='px-4 text-center mb-4 d-flex align-items-end' style={{color:"#FF00FF",flexGrow:"1"}}>
                        In this version, CCN-contracts interact with centralized 
                        relayers that protect with Openzeppelin defender.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoPage
