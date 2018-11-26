import {compile} from "../src/index";

describe('compiler spec', () => {
    it('should throw error if compiler config is null', () => {
        expect(() => compile(null)).toThrowError('config can\'t be null!');
    })
});