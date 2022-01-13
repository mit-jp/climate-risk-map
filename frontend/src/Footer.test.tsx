import { screen } from '@testing-library/react'
import { render } from './test-utils'
import Footer from './Footer'

test('It has an accessibility link', () => {
    render(<Footer />)
    expect(screen.getByText(/accessibility/i)).toHaveAttribute(
        'href',
        'https://accessibility.mit.edu/'
    )
})
