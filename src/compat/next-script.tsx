import type { ScriptHTMLAttributes } from "react";

type ScriptProps = ScriptHTMLAttributes<HTMLScriptElement> & {
  strategy?: string;
};

export default function Script({ strategy: _strategy, ...props }: ScriptProps) {
  return <script {...props} />;
}