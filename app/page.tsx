"use client";

import { stringify } from "javascript-stringify";
import { useCallback, useState, useEffect } from "react";
import { useKey } from "react-use";
import lodash, { cloneDeep, isEmpty } from "lodash";
import { consoleEvent, devConsole } from "./console";
import { v4 as uuid } from "uuid";
import { CodeBuilder } from "./builder";
import "./compiler";

type PkgWindow = Window & {
  lodash: typeof lodash;
  stringify: typeof stringify;
};

declare let window: PkgWindow;

window.lodash = lodash;
window.stringify = stringify;

type Command = {
  id: string;
  input: string;
  output: string[];
};

export default function Home() {
  const [code, setCode] = useState("");
  const [stdout, addOutput] = useState<string[]>([]);

  const writeToStdout = useCallback((output?: string) => {
    addOutput((stdout) => stdout.concat([output || "undefined"]));
  }, []);

  const execute = useCallback(() => {
    writeToStdout(code);

    const result = eval(
      new CodeBuilder()
        .withCodeId(uuid())
        .withDevConsole()
        .withErrorHandling(code)
        .getCode()
    );

    writeToStdout(stringify(result));
    setCode("");
  }, [code, writeToStdout]);

  useKey("Enter", execute, undefined, [code]);

  useEffect(() => {
    const handler = (e: CustomEvent<unknown>) => {
      writeToStdout(stringify(e.detail));
    };

    window.addEventListener(consoleEvent, handler);
    return () => window.removeEventListener(consoleEvent, handler);
  }, [code, writeToStdout]);

  return (
    <main className="p-10 font-mono">
      <h1 className="text-4xl">pkground</h1>
      <div className="my-2">
        {stdout.map((output, idx) => (
          <div className="flex gap-2 mb-2" key={idx}>
            <span>&gt;</span>
            <div>{output}</div>
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
