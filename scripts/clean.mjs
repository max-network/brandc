// Remove dist/ before a build so deleted sources don't leave stale artifacts in the tarball.
import { rmSync } from "node:fs";
rmSync(new URL("../dist", import.meta.url), { recursive: true, force: true });
