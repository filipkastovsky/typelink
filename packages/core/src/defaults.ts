declare module '#typelink' {
  export interface Routes {}
  export type Href = keyof Routes;
  export default Href;
}
