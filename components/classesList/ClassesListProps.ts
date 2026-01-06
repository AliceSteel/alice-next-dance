type ClassCard = {
    id: string;
    title: string;
    imageUrl: string;
    description?:string
}
export type ClassesListProps = {
    classes: ClassCard[]
}