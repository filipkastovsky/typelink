import Header from '../components/Header';

export default function Team() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Team</h1>
        </div>
      </main>
    </>
  );
}
