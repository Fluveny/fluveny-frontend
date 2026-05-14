import { useState } from 'react';

export default function FormModulePageSkeleton() {
  const [randomCount] = useState(() => Math.floor(Math.random() * 3) + 1);
  return (
    <>
      <div className="h-32 animate-pulse bg-zinc-200" />
      <div className="p-2 lg:px-80">
        <div className="mx-16 mt-12 h-12 animate-pulse rounded-xl bg-zinc-200 lg:mx-64" />

        <div className="m-2 mt-14 h-12 w-80 animate-pulse rounded-md bg-zinc-200 md:w-180 lg:w-145" />
        <div className="flex">
          {[...Array(randomCount)].map((_, i) => (
            <div
              key={i}
              className="m-2 h-6 w-30 animate-pulse rounded-md bg-zinc-200 lg:h-8"
            />
          ))}
        </div>

        <div className="m-2 mt-11 h-12 w-28 animate-pulse rounded-md bg-zinc-200" />

        <div className="m-2 mt-15 h-50 animate-pulse rounded-md bg-zinc-200" />

        <div className="m-4 mt-10 h-16 animate-pulse rounded-xl bg-zinc-200" />
      </div>
    </>
  );
}
