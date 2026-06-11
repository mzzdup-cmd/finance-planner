"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatMoney } from "@/lib/utils";
import type { CategoryBreakdown } from "@/types";

interface CategoryChartProps {
  data: CategoryBreakdown[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Нет данных за этот месяц
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="amount"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatMoney(Number(value))}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {data.slice(0, 5).map((item) => (
          <div key={item.category} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1 truncate text-xs text-muted-foreground">
              {item.label}
            </span>
            <span className="text-xs font-semibold tabular-nums">
              {item.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
