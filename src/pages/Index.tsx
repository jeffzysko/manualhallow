import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.href = "/manual.html";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090F]">
      <p className="text-[#9E9A92] text-sm tracking-widest uppercase animate-pulse">
        Carregando manual...
      </p>
    </div>
  );
};

export default Index;
