import { render } from './test-utils'
import Footer from './Footer'
import { screen } from '@testing-library/react'

test('It has an accessibility link', () => {
    render(<Footer />)
    expect(screen.getByText(/accessibility/i)).toHaveAttribute(
        'href',
        'https://accessibility.mit.edu/'
    )
})
