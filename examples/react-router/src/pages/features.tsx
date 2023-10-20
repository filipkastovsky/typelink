import type { Q } from '@typelink/core';

import Header from '../components/Header';

declare module '#typelink' {
  interface Routes {
    '/features': Q<never>;
  }
}

export default function Features() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Features</h1>
        </div>
      </main>
    </>
  );
}
