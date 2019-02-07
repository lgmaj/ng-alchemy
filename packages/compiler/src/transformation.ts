import {SourceTransformation} from "./public_api";
import {TextRange} from "./transpiler/model";

export function add(text: string, pos: number): SourceTransformation {
    return {text, start: pos, end: pos};
}

export function update(text: string, range: TextRange): SourceTransformation {
    return {text, start: range.start, end: range.end};
}

export function remove(range: TextRange): SourceTransformation {
    return {text: '', start: range.start, end: range.end};
}
