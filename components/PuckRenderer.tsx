"use client";

import { Render } from "@puckeditor/core";
import { puckConfig } from "@/lib/puck-config";

interface PuckRendererProps {
  data: any;
}

export function PuckRenderer({ data }: PuckRendererProps) {
  return <Render config={puckConfig as any} data={data} />;
}
