export default function msToDuration(ms: number): Duration {
    return <Duration>{
        ms: ms % 1000,
        sec: Math.floor((ms / (1000 * 60)) % 60),
        min: Math.floor((ms / (1000 * 60)) % 60),
        hr: Math.floor(ms / (1000 * 60 * 60)) % 24,
        day: Math.floor(ms / (1000 * 60 * 60 * 24))
    };
}

export interface Duration {
    ms: number;
    sec: number;
    min: number;
    hr: number;
    day: number;
}
