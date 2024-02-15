"use client";

import { stringify } from "javascript-stringify";
import { useCallback, useState, useEffect } from "react";
import { useKey } from "react-use";
import lodash from "lodash";
import { consoleEvent, devConsole } from "./console";

type PkgWindow = Window & {
  lodash: typeof lodash;
};

declare let window: PkgWindow;

window.lodash = lodash;

type Command = {
  input: string;
  output: string;
};

export default function Home() {
  const [code, setCode] = useState("");
  const [commands, setCommands] = useState<Array<Command>>([]);

  const execute = useCallback(() => {
    eval(`const console = ${stringify(devConsole)}; ` + code);
    setCode("");
  }, [code]);

  useKey("Enter", execute, undefined, [code]);

  useEffect(() => {
    const handler = (e: CustomEvent<unknown>) => {
      setCommands((commands) => [
        ...commands,
        {
          input: code,
          output: stringify(e.detail, null, 2) || "",
        },
      ]);
    };

    window.addEventListener(consoleEvent, handler);
    return () => window.removeEventListener(consoleEvent, handler);
  }, [code]);

  return (
    <main className="p-10 font-mono">
      <h1 className="text-4xl">pkground</h1>
      <div>
        {commands.map((command, idx) => (
          <div key={idx}>
            <div className="flex gap-2 my-2">
              <span>#</span>
              <div>{command.input}</div>
            </div>
            <div>{command.output}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 my-2">
        <span>#</span>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono bg-transparent caret-slate-500 focus:outline-none w-full"
          placeholder="write your code here..."
        />
      </div>
    </main>
  );
}
