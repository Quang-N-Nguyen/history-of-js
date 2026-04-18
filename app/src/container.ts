import { WebContainer } from '@webcontainer/api';
import type { DirectoryNode, FileSystemTree } from '@webcontainer/api';
import type { Terminal as XTerm } from 'xterm';
import type { LessonFile } from '@/lesson-types';

export function absWorkspacePath(wc: WebContainer, rel: string): string {
  const w = wc.workdir.replace(/\/+$/, '');
  const r = rel.replace(/^\/+/, '');
  return `${w}/${r}`;
}

let instance: WebContainer | null = null;
let booting: Promise<WebContainer> | null = null;

export function getWebContainer(): WebContainer | null {
  return instance;
}

export async function bootOnce(): Promise<WebContainer> {
  if (instance) return instance;
  if (booting) return booting;
  booting = WebContainer.boot({ coep: 'credentialless' })
    .then((wc) => {
      instance = wc;
      return wc;
    })
    .catch((err) => {
      booting = null;
      throw err;
    });
  return booting;
}

export function filesToTree(files: LessonFile[]): FileSystemTree {
  const tree: FileSystemTree = {};
  for (const f of files) {
    const parts = f.path.split('/').filter(Boolean);
    let current: FileSystemTree = tree;
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      if (i === parts.length - 1) {
        current[name] = { file: { contents: f.contents } };
      } else {
        const existing = current[name];
        if (!existing) {
          current[name] = { directory: {} };
        } else if (!('directory' in existing)) {
          throw new Error(`Path conflict mounting ${f.path}`);
        }
        current = (current[name] as DirectoryNode).directory;
      }
    }
  }
  return tree;
}

export async function mountLesson(wc: WebContainer, files: LessonFile[]): Promise<void> {
  await wc.mount(filesToTree(files));
}

export function packageJsonNeedsInstall(contents: string): boolean {
  try {
    const j = JSON.parse(contents) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const d = j.dependencies ? Object.keys(j.dependencies).length : 0;
    const dd = j.devDependencies ? Object.keys(j.devDependencies).length : 0;
    return d + dd > 0;
  } catch {
    return false;
  }
}

export async function streamProcessOutput(
  proc: Awaited<ReturnType<WebContainer['spawn']>>,
  onChunk: (chunk: string) => void,
): Promise<void> {
  const reader = proc.output.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) onChunk(value);
    }
  } finally {
    reader.releaseLock();
  }
}

export async function spawnWithOutput(
  wc: WebContainer,
  command: string,
  args: string[],
  onChunk: (chunk: string) => void,
): Promise<{ exitCode: number }> {
  const proc = await wc.spawn(command, args);
  await streamProcessOutput(proc, onChunk);
  const exitCode = await proc.exit;
  return { exitCode };
}

export type ShellHandle = {
  writeCommand: (cmd: string) => void;
  sendSignal: (ctrl: 'c' | 'd') => void;
  resize: (cols: number, rows: number) => void;
  kill: () => void;
};

export async function attachShell(wc: WebContainer, term: XTerm): Promise<ShellHandle> {
  const proc = await wc.spawn('jsh', {
    terminal: { cols: term.cols, rows: term.rows },
  });
  const writer = proc.input.getWriter();
  void streamProcessOutput(proc, (chunk) => {
    term.write(chunk);
  });
  const onDataDisposable = term.onData((data) => {
    void writer.write(data);
  });
  return {
    writeCommand(cmd: string) {
      void writer.write(`${cmd}\n`);
    },
    sendSignal(ctrl: 'c' | 'd') {
      void writer.write(ctrl === 'c' ? '\x03' : '\x04');
    },
    resize(cols: number, rows: number) {
      proc.resize({ cols, rows });
    },
    kill() {
      try {
        onDataDisposable.dispose();
      } catch {
        /* ignore */
      }
      try {
        writer.releaseLock();
      } catch {
        /* ignore */
      }
      try {
        proc.kill();
      } catch {
        /* ignore */
      }
    },
  };
}
