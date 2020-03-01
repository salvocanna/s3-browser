// Credits to https://github.com/cuvva/cuvva-log-node/

// export interface ClientError {
// 	code: string;
// 	meta?: Record<string, any>;
// }

const defineNonSerialisable = (obj: object, property: string, value: any) =>
	Object.defineProperty(obj, property, {
		value,
		writable: false,
		enumerable: false,
		configurable: true,
	});

export default class ClientError {
	static coerce(error: any) {
		let newError;

		if (error instanceof ClientError)
			return error;

		if (typeof error.code === 'string')
			newError = new ClientError(error.code, error.reasons, error.meta);
		else if (error instanceof Error)
			newError = new ClientError('unknown', { message: error.message });
		else
			newError = new ClientError('unknown', { error: error });

		if (error instanceof Error)
			defineNonSerialisable(newError, 'stack', error.stack);

		return newError;
	}

	private code: string;
	private reasons: object;
	private meta: any;
	private stack?: string;

	constructor(code: string, reasons?: object, meta?: any) {
		this.stack = new Error().stack;
		this.code = code;
		this.reasons = reasons;
		this.meta = meta;

		defineNonSerialisable(this, 'name', 'ClientError');
		defineNonSerialisable(this, 'message', this.code);
	}
}
