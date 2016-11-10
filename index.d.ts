declare module 'spur-events' {
	export type Buttons = 0 | 1 | 2 | 4 | 8 | 16;
	export type Button = 0 | 1 | 2 | 3 | 4;
	export type EventPhase = 0 | 1 | 2 | 3;

	export class SpurEvent {
		clientX: number;
		clientY: number;
		screenX: number;
		screenY: number;
		pageX: number;
		pageY: number;
		type: string;
		timeStamp: number;

		button: Button;
		buttons: Buttons;

		target: EventTarget;
		currentTarget: EventTarget;
		relatedTarget: EventTarget | null;

		path: Array<Node> | null;
		bubbles: boolean;
		eventPhase: EventPhase;
		defaultPrevented: boolean;

		propagationStopped: boolean;
		immediatePropagationStopped: boolean;

		constructor(eventType: string);
		preventDefault(): void;
		stopPropagation(): void;
		stopImmediatePropagation(): void;
	}

	export type PointerType = 'touch' | 'mouse' | 'pen';

	export type PointerEventType =
		'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel' | 'pointerenter' | 'pointerover' |
		'pointerleave' | 'pointerout';

	export class PointerEvent extends SpurEvent {
		pointerId: string;
		pointerType: PointerType;
		type: PointerEventType;
		width: number;
		height: number;
		pressure: number;
		tiltX: number;
		tiltY: number;
		isPrimary: boolean;

		originalEvent: MouseEvent | TouchEvent | PointerEvent;

		constructor(eventType: PointerEventType);
	}

	export type ListenerOptions = {
		context?: any,
		capture?: boolean // default false
		id?: string | number
	};

	export function addListener(target: EventTarget, listenerType: string, callBack: (e: SpurEvent) => void, options?: ListenerOptions): void;
	export function removeListener(target: EventTarget, listenerType: string, callBack: (e: SpurEvent) => void, options?: ListenerOptions): void;
	export function removeListenerById(target: EventTarget, listenerType: string, listenerId: string): void;
	export function removeAllListeners(target: EventTarget, listenerType: string): void;
	export function dispatchEvent(event: SpurEvent): void;
	export function setupBaseNode(target: EventTarget): void;
}
