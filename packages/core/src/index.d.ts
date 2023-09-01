declare module '#typelink' {
  export interface Routes {}
  export type Href = keyof Routes;
  export default Href;
}

export * from './lib/InferPath';
export * from './lib/LeadingSubPath';
export * from './lib/SubPath';
export * from './lib/Dynamic';
export * from './lib/FromUnion';
