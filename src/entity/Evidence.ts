import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Case } from "./Case"

@Entity({name: 'evidences'})
export class Evidence {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @Column()
    type: string

    @ManyToOne(() => Case, (c) => c.evidences)
    case: Case
}
