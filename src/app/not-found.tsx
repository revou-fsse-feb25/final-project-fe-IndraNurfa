"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, HomeIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
      {/* 404 Number */}
      <div className="mb-6">
        <h1 className="text-muted-foreground/30 text-6xl font-bold select-none md:text-8xl">
          404
        </h1>
      </div>

      {/* Headline */}
      <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
        Halaman tidak ditemukan
      </h2>

      <p className="text-muted-foreground mb-2 max-w-md">
        Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
      </p>

      {/* URL Display */}
      <div className="bg-muted/50 mb-8 rounded-lg border p-3">
        <p className="text-muted-foreground mb-1 text-sm">URL yang diminta:</p>
        <code className="text-foreground font-mono text-sm">{pathname}</code>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={() => router.push("/")}
          className="px-6 py-2"
          aria-label="Kembali ke beranda"
        >
          <HomeIcon className="mr-2 h-4 w-4" />
          Kembali ke Beranda
        </Button>

        <Button
          variant="outline"
          onClick={() => router.back()}
          className="px-6 py-2"
          aria-label="Kembali ke halaman sebelumnya"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Halaman Sebelumnya
        </Button>
      </div>
    </main>
  );
}
