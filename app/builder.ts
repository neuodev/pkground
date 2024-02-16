import { stringify } from "javascript-stringify";
import { devConsole } from "./console";

export class CodeBuilder {
  private code: string = "";

  public withCodeId(id: string): CodeBuilder {
    this.code += `const __id = ${stringify(id)};`;
    return this;
  }

  public withDevConsole(): CodeBuilder {
    this.code += `const console = ${stringify(devConsole)};`;
    return this;
  }

  public withErrorHandling(raw: string): CodeBuilder {
    this.code += `try {${raw}} catch (err) {console.log(stringify(err))};`;
    return this;
  }

  getCode(): string {
    return this.code;
  }
}
