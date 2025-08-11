import { useEffect, useState } from 'react'
import css from './tour.module.css'

type TourHighlightProps = {
    targetElement: string
}

function TourHighlight({ targetElement }: TourHighlightProps) {
    const [rect, setRect] = useState<DOMRect | null>(null)

    useEffect(() => {
        const updatePosition = () => {
            const element = document.querySelector(targetElement)
            if (element) {
                setRect(element.getBoundingClientRect())
            }
        }
        updatePosition()

        const observer = new MutationObserver(() => {
            const element = document.querySelector(targetElement)
            if (element) {
                setRect(element.getBoundingClientRect())
                observer.disconnect()
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })
        window.addEventListener('scroll', updatePosition)
        window.addEventListener('resize', updatePosition)

        return () => {
            window.removeEventListener('scroll', updatePosition)
            window.removeEventListener('resize', updatePosition)
        }
    }, [targetElement])

    if (!rect) {
        return null
    }

    return (
        <div
            className={css.tourHighlight}
            style={{
                position: 'fixed',
                top: rect.top - 4,
                left: rect.left - 4,
                width: rect.width + 8,
                height: rect.height + 8,
            }}
        />
    )
}

export default TourHighlight
