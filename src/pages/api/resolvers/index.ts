import { merge } from "lodash";

import scalars from "./scalars";
import user from "./user";
import team from "./team";
import session from "./session";

export default merge(scalars, user, team, session);
