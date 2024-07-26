/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.svelte' {
    const content: any;
    export default content;
}
declare module '*.js' {
    const content: any;
    export default content;
}

declare module '*.svg' {
    const content: string;
    export default content;
}