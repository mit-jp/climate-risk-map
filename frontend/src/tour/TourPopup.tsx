function TourPopup({
    name,
    description,
    image,
}: {
    name: string
    description: string
    image?: string
}) {
    return (
        <div className="tour-popup">
            <h3>{name}</h3>
            <p>{description}</p>
            {image && <img src={image} alt={name} />}
        </div>
    )
}

export default TourPopup
