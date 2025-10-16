import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import React from 'react';

interface SocialLoginButtonProps extends React.ComponentProps<typeof Button> {
  label: string;
  icon: string;
  callback?: () => void;
}

export default function SocialLoginButton({
  label,
  icon,
  callback,
  ...props
}: SocialLoginButtonProps) {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return (
    <Button
      onClick={() => callback && callback()}
      size="lg"
      className="w-full h-16 text-xl font-bold uppercase tracking-wider"
      {...props}
    >
      <Label
        className={`cursor-pointer leading-loose font-superstar text-gray-100 ${
          isMobile ? 'text-[20px]' : 'text-[24px]'
        }`}
      >
        {label}
      </Label>
      <Image src={icon} alt={label} width={24} height={24} />
    </Button>
  );
}
