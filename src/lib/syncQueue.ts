/**
 * Offline sync queue — stores pending mutations in localStorage
 * and replays them when the browser comes back online.
 */

const QUEUE_KEY = "hallow_sync_queue";

export interface QueuedAction {
  id: string;
  type: "upsert_note" | "delete_note" | "add_favorite" | "remove_favorite";
  payload: Record<string, unknown>;
  created_at: string;
}

function readQueue(): QueuedAction[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedAction[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function enqueue(action: Omit<QueuedAction, "id" | "created_at">) {
  const queue = readQueue();
  queue.push({
    ...action,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  });
  writeQueue(queue);
}

export function dequeue(id: string) {
  writeQueue(readQueue().filter(a => a.id !== id));
}

export function peekQueue(): QueuedAction[] {
  return readQueue();
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

export function isOffline(): boolean {
  return !navigator.onLine;
}
