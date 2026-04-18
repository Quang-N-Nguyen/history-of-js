/// <reference types="vite/client" />

declare module '*?worker' {
  const workerConstructor: new () => Worker;
  export default workerConstructor;
}

declare module 'virtual:lessons' {
  import type { Lesson } from '@/lesson-types';
  export const lessons: Lesson[];
  const _default: Lesson[];
  export default _default;
}
