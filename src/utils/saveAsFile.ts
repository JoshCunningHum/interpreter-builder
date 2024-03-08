export const saveAsFile = (
  data: any,
  filename: string,
  type: string = "text/plain",
) => {
  const a = document.createElement("a");
  const file = new Blob([data], { type });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
};
