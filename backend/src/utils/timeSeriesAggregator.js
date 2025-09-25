const getTimeSeriesAggregation = (timeUnit, dateField) => {
  let groupFormat;
  switch (timeUnit) {
    case 'day':
      groupFormat = '%Y-%m-%d';
      break;
    case 'month':
      groupFormat = '%Y-%m';
      break;
    case 'year':
      groupFormat = '%Y';
      break;
    default:
      groupFormat = '%Y-%m-%d'; // Default to day
  }

  return [
    {
      $group: {
        _id: { $dateToString: { format: groupFormat, date: `$${dateField}` } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];
};

export { getTimeSeriesAggregation };