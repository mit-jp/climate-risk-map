import { Typography } from '@mui/material'

function RiskFormula() {
    return (
        <Typography component="div">
            <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
                <mrow>
                    <msub>
                        <mi>relative risk</mi>
                        <mrow>
                            <mi>m</mi>
                            <mo>,</mo>
                            <mi>c</mi>
                        </mrow>
                    </msub>
                    <mo>=</mo>
                    <msub>
                        <mi>percentile</mi>
                        <mrow>
                            <mi>m</mi>
                            <mo>,</mo>
                            <mi>c</mi>
                        </mrow>
                    </msub>
                    <mo>=</mo>
                    <msub>
                        <mi>p</mi>
                        <mrow>
                            <mi>m</mi>
                            <mo>,</mo>
                            <mi>c</mi>
                        </mrow>
                    </msub>
                    <mo>=</mo>
                    <mfrac>
                        <mrow>
                            <msub>
                                <mi>rank</mi>
                                <mrow>
                                    <mi>m</mi>
                                    <mo>,</mo>
                                    <mi>c</mi>
                                </mrow>
                            </msub>
                            <mo>×</mo>
                            <mn>100</mn>
                        </mrow>
                        <mi>n</mi>
                    </mfrac>
                </mrow>
            </math>
        </Typography>
    )
}

export default RiskFormula
