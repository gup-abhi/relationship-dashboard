const processMultiValueField = (fieldName, delimiter = '; ') => {
  return [
    { $project: { [fieldName]: { $split: [`$${fieldName}`, delimiter] } } },
    { $unwind: `$${fieldName}` },
    { $group: { _id: `$${fieldName}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ];
};

export { processMultiValueField };