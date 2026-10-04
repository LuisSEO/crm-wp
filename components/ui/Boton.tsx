import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variante = "primario" | "contorno" | "texto";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-[15px] font-medium leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

const variantes: Record<Variante, string> = {
  primario: "h-10 px-5 bg-primary text-on-primary hover:bg-primary-active active:bg-primary-active",
  contorno: "h-10 px-5 border border-hairline-strong bg-transparent text-ink hover:bg-surface-strong",
  texto: "text-ink underline-offset-4 hover:underline",
};

type Props = {
  variante?: Variante;
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

/** Botón en píldora. Con `href` se comporta como enlace. */
export function Boton({ variante = "primario", href, children, className = "", ...resto }: Props) {
  const clases = `${base} ${variantes[variante]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={clases}>
        {children}
      </Link>
    );
  }
  return (
    <button className={clases} {...resto}>
      {children}
    </button>
  );
}
