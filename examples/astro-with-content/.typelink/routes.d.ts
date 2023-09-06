declare module "#typelink" {
    import type { FromUnion } from "@typelink/core";
    export type FSHref = "/about" | "/" | "/blog/[...slug]" | "/blog";
    export interface Routes extends FromUnion<FSHref> {
    }
}