'use client';

import React from 'react';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: NameType;
    value: ValueType;
    color?: string;
    dataKey?: string;
    unit?: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-black text-white rounded-md shadow-lg">
        <p className="font-bold">{label}</p>
        {payload.map((pld, index) => (
          <p key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
