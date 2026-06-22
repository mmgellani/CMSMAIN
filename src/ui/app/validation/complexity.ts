import { Patterns } from '../common/pattern';

export function complexity(password: string) {
    return Patterns.Password.test(password);
};

export function alphabets(providedText: string) {
    return Patterns.Alphabets.test(providedText);
}

export function noWhiteSpace(providedText: string) {
    return Patterns.NoWhiteSpace.test(providedText);
}