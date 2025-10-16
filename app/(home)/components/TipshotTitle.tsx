'use client';

export function TipshotTitle() {
  return (
    <div className="flex items-center justify-center animate-[float_2s_ease-in-out_infinite]">
      {/* TIPSHOT Text - Big and Responsive */}
      <h1
        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.15em] uppercase text-center px-4"
        style={{
          color: '#8e34d5',
          textShadow: '3px 4px 0px rgba(0, 0, 0, 0.6)',
        }}
      >
        TIPSHOT
      </h1>
    </div>
  );
}
