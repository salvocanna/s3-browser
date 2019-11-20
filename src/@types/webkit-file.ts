export interface WebkitFile extends File {
	webkitRelativePath?: string; // in webkit, if undefined, it is set as empty string.
}
