declare module '#typelink' {
  export interface Routes {}
  export type Href = keyof Routes;
}

export * from './lib/InferPath';
export * from './lib/Dynamic';
export * from './lib/FromUnion';
