export function ToChars(s: string): string[] {
	return Array.from(s)
}






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

export function ParseList(s :  string) : List {
	if(s.length == 0) throw new Error("Expect a valid string here");
	s = s.trim();
	if(s[0] !== '(') throw new Error("Debut '('  non trouve");
const elements = ToChars(s);

	const [l, m] = ParseListActual(elements, 0);
	return <List>l.items[0];
}

export function isAtom( o :Atom | List ): o is Atom {
	return ( o as Atom).value !== undefined;

}

export function isList(o: Atom | List): o is List {
	return (o as List).items !== undefined
}


export function first( l: List) : Atom {
	if(l.items.length === 0) throw new Error("Ls liste est vide");
	if(isAtom(l.items[0])){
		return l.items[0];
	}else{
		throw new Error("Atom au debut de la list");
	}

}

export function rest(l : List) : List {
	let result = <List>{items : []};
	if(l.items.length === 0) return result;
	result.items = l.items.slice(1);

	return result;
}

type basicArithmeticOp = (a: Atom , b :Atom ) => Atom

interface FunMap {
	[key : string] : basicArithmeticOp
}
     type ArithmeticOp = (c : number, d : number) => number;
const validate =  ( a : Atom , b : Atom , op : ArithmeticOp) : Atom => {
	if(typeof a.value === 'number' && typeof b.value === 'number'){
		return <Atom>{value : op(a.value, b.value)}

	}
	throw new Error('il ya un terme invalide dans l operation');
};

const _add = (a : Atom , b :Atom ) : Atom => {
	return validate(a, b , (c:number, d: number) => c + d);
};
const _sub = (a :Atom , b : Atom ): Atom => {
	return validate(a, b, (c : number, d : number) => c -d );
};

const _mul = (a: Atom, b: Atom): Atom => {
	return validate(a, b, (c: number, d: number) => c * d)
};
const _div = (a: Atom, b: Atom): Atom => {
	return validate(a, b, (c: number, d: number) => c / d)
};



const _builtInFunctionNames: FunMap = {
	'+': _add, '-': _sub, '*': _mul, '/': _div
};
export function Eval(exp: Atom | List): Atom {
	// if Atom, return itself
	if (isAtom(exp)) {
		return exp
	} else if (isList(exp)) {
		// if List evaluate the first
		// then evaluate the rest
		const f = first(exp)
		if (f.value in _builtInFunctionNames) {
			const r = rest(exp)
			const evaluated = r.items.map(k => Eval(k));
			if (evaluated.length === 0) throw Error('Not enough arguments to the operator ' + f.value);
			let a = evaluated[0];
			const fun = _builtInFunctionNames[f.value];
			for (let i = 1; i < evaluated.length; i++) {
				a = fun(a, evaluated[i])
			}
			return a
		}
	}
	throw Error('Unknown evaluation error ' + exp)
}
