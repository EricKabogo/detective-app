import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity({name: 'detectives'})
export class Detective {
    @PrimaryColumn()
    id: string

    @Column()
    name: string
}
