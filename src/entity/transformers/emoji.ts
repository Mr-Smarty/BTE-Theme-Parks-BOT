import { ValueTransformer } from 'typeorm';

export default <ValueTransformer>{
    from: (value: string) =>
        value === null
            ? null
            : /^<.+>$/.test(value)
            ? value
            : String.fromCodePoint(parseInt('0x' + value, 16)),
    to: (value: string) =>
        value === null
            ? null
            : /^<.+>$/.test(value)
            ? value
            : value.codePointAt(0).toString(16)
};
