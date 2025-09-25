'use client';

import React from 'react';
import { WordCloud } from '@isoterik/react-word-cloud';

interface SecondaryIssuesWordCloudProps {
  data: Array<{ _id: string; count: number }>;
}

const SecondaryIssuesWordCloud: React.FC<SecondaryIssuesWordCloudProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const transformedData = data.map(item => ({ text: item._id, value: item.count }));

  return (
    <div>
      <WordCloud
        words={transformedData}
        width={500}
        height={300}
        fontSize={(word) => Math.log2(word.value) * 4}
        rotate={() => 0}
      />
    </div>
  );
};

export default SecondaryIssuesWordCloud;