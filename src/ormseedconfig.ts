import ormconfig from "./ormconfig";
import { SeedDB1677221182558 } from "./seeds/1677221182558-SeedDB";

const ormseedconfig = {
    ...ormconfig,
    migrations: [SeedDB1677221182558],
};

export default ormseedconfig;
