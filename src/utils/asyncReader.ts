import { getAsset } from "./prepareAssets";

export function readAsArrayBuffer(
  file: File,
): Promise<ArrayBuffer | string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () =>
      reject(new Error("Failed to read file as ArrayBuffer"));
    reader.readAsArrayBuffer(file);
  });
}

export function readAsImage(src: string | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (src instanceof Blob) {
        window.URL.revokeObjectURL(img.src);
      }
      resolve(img);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    if (src instanceof Blob) {
      const url = window.URL.createObjectURL(src);
      img.src = url;
    } else {
      img.src = src;
    }
  });
}

export function readAsDataURL(
  file: File,
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file as DataURL"));
    reader.readAsDataURL(file);
  });
}

export async function readAsPDF(file: Blob): Promise<any> {
  const pdfjsLib = await getAsset("pdfjsLib");
  const blob = new Blob([file]);
  const url = window.URL.createObjectURL(blob);
  try {
    const pdfDocument = await pdfjsLib.getDocument(url).promise;
    return pdfDocument;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to read file as PDF");
  } finally {
    window.URL.revokeObjectURL(url);
  }
}
