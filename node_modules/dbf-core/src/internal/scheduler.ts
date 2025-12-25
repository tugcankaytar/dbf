/**
 * Batch update scheduler: Aynı tick'te çok setState → tek render garantisi
 */

let scheduledTasks: Set<() => void> = new Set();
let isScheduled = false;

export function schedule(fn: () => void) {
  scheduledTasks.add(fn);

  if (!isScheduled) {
    isScheduled = true;
    queueMicrotask(() => {
      // Tüm scheduled task'ları çalıştır
      const tasks = Array.from(scheduledTasks);
      scheduledTasks.clear();
      isScheduled = false;

      for (const task of tasks) {
        try {
          task();
        } catch (error) {
          console.error("[dbf-core:scheduler] Task error:", error);
        }
      }
    });
  }
}

/**
 * Batch update'i manuel olarak flush et (test için)
 */
export function flushScheduled() {
  if (isScheduled) {
    const tasks = Array.from(scheduledTasks);
    scheduledTasks.clear();
    isScheduled = false;
    for (const task of tasks) {
      task();
    }
  }
}
  