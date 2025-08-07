import css from './tour.module.css'

type TourPopupProps = {
    name: string
    description: string
    image?: string
}

function TourProp({ name, description, image }: TourPopupProps) {
    return (
        <div className={css.tourPopup}>
            <div className={css.popupContent}>
                <h3 className={css.popupTitle}>{name}</h3>
                <p className={css.popupDescription}>{description}</p>
                {image && <img src={image} alt={name} className={css.popupImage} />}
            </div>
        </div>
    )
}

export default TourProp
