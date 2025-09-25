import React from 'react';

interface CrossTabulationData {
  field1: string;
  field2: string;
  count: number;
}

interface CrossTabulationHeatmapProps {
  data: CrossTabulationData[];
  field1Name: string;
  field2Name: string;
}

const CrossTabulationHeatmap: React.FC<CrossTabulationHeatmapProps> = ({ data, field1Name, field2Name }) => {
  // Extract unique values for field1 and field2 to create headers
  const uniqueField1Values = Array.from(new Set(data.map(item => item.field1)));
  const uniqueField2Values = Array.from(new Set(data.map(item => item.field2)));

  // Create a map for easier lookup: { field1Value: { field2Value: count } }
  const dataMap = new Map<string, Map<string, number>>();
  data.forEach(item => {
    if (!dataMap.has(item.field1)) {
      dataMap.set(item.field1, new Map<string, number>());
    }
    dataMap.get(item.field1)?.set(item.field2, item.count);
  });

  return (
    <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{field1Name} \ {field2Name}</th>
            {uniqueField2Values.map(val => (
              <th key={val} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{val}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {uniqueField1Values.map(f1Val => (
            <tr key={f1Val}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{f1Val}</td>
              {uniqueField2Values.map(f2Val => {
                const count = dataMap.get(f1Val)?.get(f2Val) || 0;
                return (
                  <td key={`${f1Val}-${f2Val}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {count}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrossTabulationHeatmap;
