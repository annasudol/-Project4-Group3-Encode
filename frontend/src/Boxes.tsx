import { FunctionComponent } from 'react'
import Stack from '@mui/material/Stack'
type BoxesProps = {
    ERHBalance: number
    tokenBalance: number
    votingPower: number
}

const Boxes: FunctionComponent<BoxesProps> = ({
    ERHBalance = '',
    tokenBalance = '',
    votingPower = '',
}) => {
    return (
        <Stack spacing={2} direction="row">
            <p>Your ETH balance is {ERHBalance}</p>
            <p>Your token balance is {tokenBalance}</p>
            <p>Your voting power is {votingPower}</p>
        </Stack>
    )
}

export default Boxes
