"use client";
import ToolIconUpload from "./ToolIconUpload";
import { useToolIcon } from "@/hooks/useToolIcon";

interface Props {
  slug: string;
  DefaultIcon: React.ElementType;
  color: string;
  colorDim: string;
  colorBorder: string;
  iconSize?: number;
}

export default function ToolPageIcon({ slug, DefaultIcon, color, colorDim, colorBorder, iconSize = 22 }: Props) {
  const { iconUrl, saveIcon, clearIcon } = useToolIcon(slug);

  return (
    <div
      className="relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
      style={{ background: colorDim, border: `1px solid ${colorBorder}`, boxShadow: `0 0 20px ${color}20` }}>
      {iconUrl ? (
        <img src={iconUrl} alt="" className="w-7 h-7 object-contain rounded-lg" />
      ) : (
        <DefaultIcon size={iconSize} style={{ color }} strokeWidth={1.5} />
      )}
      <ToolIconUpload hasCustom={!!iconUrl} onUpload={saveIcon} onClear={clearIcon} />
    </div>
  );
}
