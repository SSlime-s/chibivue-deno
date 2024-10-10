export function patchAttr(
  element: Element,
  name: string,
  value: string | null,
) {
  if (value !== null) {
    element.setAttribute(name, value);
  } else {
    element.removeAttribute(name);
  }
}
