import React from 'react'
import { Text, View } from 'react-native'


type StepProps = {
    step: {
        stepDetail: string,
        stepNo: number
    }
}

const Step = ({ step }: StepProps) => {
    return (
        <View>
            <Text className='text-center font-bold text-xl leading-5 text-primary/50 mb-8'>Step {step.stepNo}</Text>
            <Text className='text-xl leading-7 text-left text-primary/75'>
                {step.stepDetail}
            </Text>
        </View>
    )
}

export default Step