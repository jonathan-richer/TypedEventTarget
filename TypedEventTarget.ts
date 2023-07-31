type AnyRecord = Record<string | number | symbol, any>;

interface TypedEventListener<Data extends AnyRecord> {
  (evt: CustomEvent<Data>): void | Promise<void>;
}

interface TypedListenerObject<Data extends AnyRecord> {
  handleEvent(evt: CustomEvent<Data>): void | Promise<void>
}

type TypedEventListenerOrTypedListenerObject<Data extends AnyRecord> = TypedEventListener<Data> | TypedListenerObject

interface TypedEventTarget<Events extends Record<string, AnyRecord>> extends EventTarget {
  addEventListener<K extends keyof Events>(
    type: K,
    callback: TypedEventListenerOrTypedListenerObject<Events[K]> | null,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof Events>(
    type: K,
    callback: TypedEventListenerOrTypedListenerObject<Events[K]> | null,
    options?: EventListenerOptions | boolean,
  ): void;

  dispatchEvent<K extends keyof Events>(type: K, data: Events[K]): boolean;
  dispatchEvent(event: CustomEvent<Events[string]>): boolean;
}

class TypedEventTarget<Events extends Record<string, AnyRecord>> extends EventTarget {
  override dispatchEvent<K extends keyof Events>(
    type: K | CustomEvent<Events[K]>,
    data?: Events[K],
  ): boolean {
    if (type instanceof Event) return super.dispatchEvent(type);

    const event = new CustomEvent(type as string, {
      detail: data,
    });
    return super.dispatchEvent(event);
  }
}

export { TypedEventTarget };
export default TypedEventTarget;
