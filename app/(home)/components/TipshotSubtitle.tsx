'use client';

interface TipshotSubtitleProps {
  text?: string;
}

export function TipshotSubtitle({
  text = 'JOIN LIVE EVENTS & TIP YOUR FAVORITES',
}: TipshotSubtitleProps) {
  return (
    <p
      className="text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold tracking-wide sm:tracking-wider md:tracking-widest uppercase px-4"
      style={{
        color: '#8e34d5',
        textShadow: '2px 3px 0px rgba(0, 0, 0, 0.6)',
        letterSpacing: '0.15em',
      }}
    >
      {text}
    </p>
  );
}
