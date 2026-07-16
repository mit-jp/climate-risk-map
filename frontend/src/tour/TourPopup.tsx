import { ReactNode, useEffect, useState } from 'react'
import css from './tour.module.css'

type TourPopupProps = {
    name: string
    description: string
    image?: string
    targetElement: string // CSS selector
    children?: ReactNode
}

function TourPopup({ name, description, image, targetElement, children }: TourPopupProps) {
    // the popup anchors to the tour highlight ring; when the target (and
    // therefore the ring) is missing, center the popup instead
    const [hasTarget, setHasTarget] = useState(true)
    useEffect(() => {
        setHasTarget(document.querySelector(targetElement) !== null)
    }, [targetElement])

    return (
        <div className={hasTarget ? css.tourPopup : `${css.tourPopup} ${css.centered}`}>
            <div className={css.popupContent}>
                <h3 className={css.popupTitle}>{name}</h3>
                <p className={css.popupDescription}>{description}</p>
                {image && <img src={image} alt={name} className={css.popupImage} />}
                {children}
            </div>
        </div>
    )
}

export default TourPopup
