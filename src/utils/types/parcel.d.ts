declare function require(id: string): any;

interface ProcessEnv
{
    [key: string]: string | undefined;
}

declare const process: { env: ProcessEnv };