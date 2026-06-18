import worker1 from "../assets/workers/worker1.svg";
import worker2 from "../assets/workers/worker2.svg";
import worker3 from "../assets/workers/worker3.svg";
import worker4 from "../assets/workers/worker4.svg";
import worker5 from "../assets/workers/worker5.svg";

const workerAvatars = {
  "worker1.svg": worker1,
  "worker2.svg": worker2,
  "worker3.svg": worker3,
  "worker4.svg": worker4,
  "worker5.svg": worker5,
};

const fallbackWorkerImages = [worker1, worker2, worker3, worker4, worker5];

const fallbackIndex = (seed) => {
  const value = Number(seed);

  if (!Number.isFinite(value) || value <= 0) return 0;

  return (value - 1) % fallbackWorkerImages.length;
};

export const fallbackWorkerImage = worker1;

export const resolveWorkerImage = (worker = {}) => {
  const rawImage = worker.image || worker.avatar_url || "";
  const fileName = rawImage.split("/").pop();
  const localImage = workerAvatars[fileName];

  if (localImage) return localImage;
  if (rawImage) return rawImage;

  return fallbackWorkerImages[fallbackIndex(worker.user_id || worker.id)];
};
