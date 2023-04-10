export type Dataset = {
    id: number
    short_name: string
    name: string
    description: string
    units: string
}

export type DatasetPatch = {
    id: number
    short_name?: string
    name?: string
    description?: string
    units?: string
}
