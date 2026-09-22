import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'

function AllTheProviders({ children }: { children: any }) {
    return <Provider store={store}>{children}</Provider>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
