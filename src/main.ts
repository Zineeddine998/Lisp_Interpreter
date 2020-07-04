export function ToChars(s: string): string[] {
	return Array.from(s)
}

// Atom is the basic unit in Lisp
// it could be a number or a symbol
export interface Atom {
	value: number | string
}

// @ts-ignore
export function ParseAtom(s : string): Atom {

   s = s.trim();
	if( s === '') throw new Error('Invalid symbol');
	const result = Number(s);
	return isNaN(result) ? <Atom>{value : s} : <Atom>{ value :result}

}

export interface List{
	items : (Atom | List)[]
}

const ListOpenDelimeter = '(';
const ListCloseDelimeter = ')';
const ListElementDelimeter = ' ';

function ParseListActual(elements: string[], i: number): [List, number] {
	let result = <List>{items : []};
	let atomStart = -1;
	const AddAtom = () => {
		if(atomStart != -1) {
			const term  = elements.slice(atomStart,i);
			result.items.push(ParseAtom(term.join('')));
		}

	}

}