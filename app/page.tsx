import PasswordGen from "@/components/PasswordGen";

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center mt-25 min-w-screen">
        <section>
          <h1 className="text-6xl mb-2 text-center font-bold">PassGen</h1>
          <p className="text-center mb-2">Generate secure passwords & keep them safe in one place</p>
        </section>
        <section className="lg:w-[50%] w-[90%]">
          <PasswordGen />
        </section>
      </main>
    </>
  );
}
