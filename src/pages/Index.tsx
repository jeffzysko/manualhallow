import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.replace("/manual.html");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "#09090F" }}>
      <p className="text-sm tracking-widest uppercase animate-pulse" style={{ color: "#9E9A92" }}>
        Carregando manual…
      </p>
    </div>
  );
};

export default Index;
