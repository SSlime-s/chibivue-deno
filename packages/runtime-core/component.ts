import type { ReactiveEffect } from "../reactivity/effect.ts";
import { unreachable } from "../shared/unreachable.ts";
import { emit } from "./componentEmits.ts";
import { ComponentOptions } from "./componentOptions.ts";
import { initProps, type Props } from "./componentProps.ts";
import type { VNode, VNodeChild } from "./vnode.ts";

export type Component = ComponentOptions;

export interface ComponentInternalInstance {
  type: Component;
  vnode: VNode;
  subTree: VNode;
  next: VNode | null;
  effect: ReactiveEffect;
  render: InternalRenderFunction;
  update: () => void;
  isMounted: boolean;
  propsOptions?: Props;
  props: Data;
  emit: (event: string, ...args: unknown[]) => void;
  setupState: Data;
}

export type InternalRenderFunction = {
  (ctx: Data): VNodeChild;
};

export type Data = Record<string, unknown>;

export function createComponentInstance(
  vnode: VNode,
): ComponentInternalInstance {
  const type = vnode.type as Component;

  const instance: ComponentInternalInstance = {
    type,
    vnode,
    next: null,
    subTree: null!,
    effect: null!,
    render: null!,
    update: null!,
    isMounted: false,
    propsOptions: type.props as Props | undefined ?? {},
    props: {},
    emit: null!, // set immediately
    setupState: {},
  };
  instance.emit = emit.bind(null, instance);

  return instance;
}

export function setupComponent(instance: ComponentInternalInstance) {
  initProps(instance, instance.vnode.props);

  const component = instance.type as Component;
  if (component.setup !== undefined) {
    const setupResult = component.setup(
      instance.props,
      {
        emit: instance.emit,
      },
    ) as InternalRenderFunction | Record<string, unknown> | void;

    switch (typeof setupResult) {
      case "function":
        instance.render = setupResult;
        break;
      case "object":
        instance.setupState = setupResult;
        break;
      case "undefined":
        break;
      default:
        unreachable(setupResult);
    }
  }

  if (compile !== undefined && component.render === undefined) {
    const template = component.template ?? "";
    if (template !== "") {
      instance.render = compile(template);
    }
  }
}

type CompileFunction = (template: string) => InternalRenderFunction;
let compile: CompileFunction | undefined;

export function registerRuntimeCompiler(_compile: CompileFunction) {
  compile = _compile;
}
