import { getPlatformById } from '@/lib/platforms';

interface Props {
  platformId: string;
  size?: number;
}

export default function PlatformIcon({ platformId, size = 20 }: Props) {
  const platform = getPlatformById(platformId);
  const bg = platform.color === '#ffffff' || platform.color === '#FFFC00' || platform.color === '#FFDD00'
    ? '#1a1a1a'
    : platform.color + '22';
  const iconColor = platform.color === '#000000' ? '#ffffff' : platform.color;

  return (
    <div style={{
      width: size + 8, height: size + 8,
      borderRadius: '6px',
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={iconColor}
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: platform.svg }}
      />
    </div>
  );
}
