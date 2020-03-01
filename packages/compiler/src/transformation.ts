import {SourceTransformation} from "./public_api";
import {TextRange} from "./transpiler/model";

export function add(text: string, pos: number): SourceTransformation {
    return new SourceTransformation(pos, pos, text);
}

export function update(text: string, range: TextRange): SourceTransformation {
    return new SourceTransformation(range.start, range.end, text);
}

export function remove(range: TextRange): SourceTransformation {
    return new SourceTransformation(range.start, range.end, '');
}
