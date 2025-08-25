export const intervalOptions = [
  { value: 1, label: '1sn' },
  { value: 5, label: '5sn' },
  { value: 10, label: '10sn' },
  { value: 20, label: '20sn' },
  { value: 30, label: '30sn' },
  { value: 60, label: '1dk' },
  { value: 300, label: '5dk' },
  { value: 600, label: '10dk' },
  { value: 3600, label: '1saat' },
  { value: 86400, label: '1gün' },
];

export const formatInterval = (value: number) => {
  const option = intervalOptions.find((o) => o.value === value);
  return option ? option.label : String(value);
};
