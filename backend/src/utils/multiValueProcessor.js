const processMultiValueField = (fieldName, delimiter = '; ') => {
  return [
    { $project: { [fieldName]: { $split: [`$${fieldName}`, delimiter] } } },
    { $unwind: `$${fieldName}` },
    { $addFields: { [fieldName]: { $trim: { input: `$${fieldName}` } } } }, // Add trim stage
    { $match: { [fieldName]: { $ne: "" } } }, // Add match stage to filter out empty strings
    { $group: { _id: `$${fieldName}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ];
};

export { processMultiValueField };