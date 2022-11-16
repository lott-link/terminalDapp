import { useState } from 'react'

import Input from '../../../Components/styled/input'
import Button from '../../../Components/styled/Button'

const Step1 = ({setSteps, referral, setReferral}) => {

    const submit = ()=>{
        setReferral(referral);
        setSteps("step2")
    }
  return (
    <div className='p-3'>
        <div>
            <div>
            Buying Lott token in this phase just possible with referral code, please
            enter referral code from trusted referral.
            </div>
        </div>
        <div className='px-4 mt-5'>
             <Input
                type="text"
                name="referral code"
                title={"referral code"}
                style={{ width: "100%" }}
                value={referral}
                onChange={(e)=>setReferral(e.target.value)}
            />
        </div>
        <div className='w-100 px-4 mt-4'>
            <Button className='w-100 m-0' onClick={submit} primary>Submit</Button>
        </div>
    </div>
  )
}

export default Step1