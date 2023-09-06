declare module "#typelink" {
    import type { FromUnion } from "@typelink/core";
    export type FSHref = "/company" | "/contact" | "/features" | "/" | "/marketplace" | "/team" | "/auth/login";
    export interface Routes extends FromUnion<FSHref> {
    }
}