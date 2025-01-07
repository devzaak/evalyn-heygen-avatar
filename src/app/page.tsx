import AvatarDemo from "../components/AvatarDemo";

export default function Home() {
  return (
    <main className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "white" }}>
      <h1>Interactive Avatar Demo (Next.js + TypeScript)</h1>
      <AvatarDemo />
    </main>
  );
}
