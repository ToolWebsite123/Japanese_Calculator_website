import { Link as RouterLink } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children?: ReactNode;
};

export default function Link({ href, children, onClick, target, rel, ...props }: LinkProps) {
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  if (isInternal) {
    return (
      <RouterLink
        to={href as never}
        {...props}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          onClick?.(event);
          event.stopPropagation();
        }}
      >
        {children}
      </RouterLink>
    );
  }

  const safeRel = target === "_blank" ? (rel ?? "noopener noreferrer") : rel;

  return (
    <a href={href} target={target} rel={safeRel} onClick={onClick} {...props}>
      {children}
    </a>
  );
}
