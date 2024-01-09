import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm"
import { Detective } from "./Detective"
import { Evidence } from "./Evidence"

@Entity({name: 'cases'})
export class Case {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @Column()
    status: string

    @ManyToMany(() => Detective)
    @JoinTable({inverseJoinColumn: {name: "detective_id"}, joinColumn: {name: "case_id"}})
    detectives: Detective[]

    @OneToMany(() => Evidence, (evidence) => evidence.case)
    evidences: Evidence[]
}
