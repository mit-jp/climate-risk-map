import { ReactNode } from 'react'
import css from './tour.module.css'

type TourPopupProps = {
    name: string
    description: string
    image?: string
    hasTarget: boolean
    children?: ReactNode
}

function TourPopup({ name, description, image, hasTarget, children }: TourPopupProps) {
    // the popup anchors to the tour highlight ring; when the target (and
    // therefore the ring) is missing, center the popup instead
    return (
        <div
            className={hasTarget ? css.tourPopup : `${css.tourPopup} ${css.centered}`}
            data-testid="tour-popup"
        >
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
