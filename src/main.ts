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

	while( i < elements.length){
		if(elements[i] === ListCloseDelimeter) {
			AddAtom();
			return [result, i + 1];
		}

		if(elements[i] === ListOpenDelimeter) {
			const [r,k] = ParseListActual(elements, i+1);
			i = k;
			result.items.push(r);
			continue
		}

		if(elements[i] === ListElementDelimeter){
			AddAtom();
			atomStart = -1;
		}else{
			if(atomStart == -1){
				atomStart = i;
			}
		}
		i++;
	}
  return [result, i];
}