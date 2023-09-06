declare module "#typelink" {
    import type { FromUnion } from "@typelink/core";
    export type FSHref = "/404" | "/about" | "/contact" | "/" | "/pricing" | "/privacy" | "/styleguide";
    export interface Routes extends FromUnion<FSHref> {
    }
}