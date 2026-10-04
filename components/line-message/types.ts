"use client";

export type CopyLineAction = (text: string) => void | boolean | Promise<void | boolean>;
