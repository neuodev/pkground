declare global {
  interface WindowEventMap {
    [consoleEvent]: CustomEvent;
  }
}

export const consoleEvent = "pkground:console";

export const devConsole = {
  log(value: string) {
    window.dispatchEvent(
      new CustomEvent("pkground:console", { detail: value })
    );
  },
};
