import { Typography } from '@mui/material'

function CombinatoryScoreFormula() {
    return (
        <Typography component="div">
            <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
                <mrow>
                    <msub>
                        <mi>combinatory risk</mi>
                        <mi>c</mi>
                    </msub>
                    <mo>=</mo>
                    <mfrac>
                        <mrow>
                            <munderover>
                                <mo>&#x2211;</mo>
                                <mi>m</mi>
                                <mi>l</mi>
                            </munderover>
                            <msub>
                                <mi>W</mi>
                                <mi>m</mi>
                            </msub>
                            <msub>
                                <mi>P</mi>
                                <mrow>
                                    <mi>m</mi>
                                    <mo>,</mo>
                                    <mi>c</mi>
                                </mrow>
                            </msub>
                        </mrow>
                        <mrow>
                            <munderover>
                                <mo>&#x2211;</mo>
                                <mi>m</mi>
                                <mi>l</mi>
                            </munderover>
                            <msub>
                                <mi>W</mi>
                                <mi>m</mi>
                            </msub>
                        </mrow>
                    </mfrac>
                </mrow>
            </math>
        </Typography>
    )
}

export default CombinatoryScoreFormula
