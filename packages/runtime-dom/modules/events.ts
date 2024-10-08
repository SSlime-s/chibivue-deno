interface Invoker extends EventListener {
  value: EventValue;
}

// deno-lint-ignore ban-types
type EventValue = Function;

export function addEventListener(
  element: Element,
  event: string,
  handler: EventListener
) {
  element.addEventListener(event, handler);
}

export function removeEventListener(
  element: Element,
  event: string,
  handler: EventListener
) {
  element.removeEventListener(event, handler);
}

export function patchEvent(
  element: Element & {
    /** vei = vue event invokers */
    _vei?: Record<string, Invoker | undefined>;
  },
  rawName: `on${string}`,
  value: EventValue | null
) {
  const invokers = element._vei ?? (element._vei = {});
  const existingInvoker = invokers[rawName];

  if (value !== null && existingInvoker !== undefined) {
    // patch
    existingInvoker.value = value;
  } else {
    const name = parseName(rawName);

    if (value !== null) {
      // add
      const invoker = (invokers[rawName] = createInvoker(value));
      addEventListener(element, name, invoker);
    } else if (existingInvoker !== undefined) {
      // remove
      removeEventListener(element, name, existingInvoker);
      invokers[rawName] = undefined;
    }
  }
}

function parseName(rawName: `on${string}`): string {
  return rawName.slice(2).toLocaleLowerCase();
}

function createInvoker(initialValue: EventValue) {
  const invoker: Invoker = (e) => {
    invoker.value(e);
  };
  invoker.value = initialValue;

  return invoker;
}
