import "reflect-metadata"
import { DataSource } from "typeorm"
import { Detective} from "./entity/Detective"
import { Case } from "./entity/Case"
import { Evidence } from "./entity/Evidence"

export const Database = new DataSource({
    type: "mysql",
    host: "detective.ck5nk6d2mvj9.us-east-1.rds.amazonaws.com",
    port: 3306,
    username: "admin",
    password: "ChurchMass",
    database: "detective",
    synchronize: false,
    logging: false,
    entities: [Detective, Case, Evidence],
    migrations: [],
    subscribers: [],
})
