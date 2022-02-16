export default function FileInfo({ file }: { file: File }) {
    return (
        <div>
            <p>{file.name}</p>
            <p>size: {file.size}</p>
        </div>
    )
}
