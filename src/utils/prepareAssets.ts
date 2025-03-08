type Script = {
  name: string;
  src: string;
};

const assets: Record<string, Promise<any>> = {};

const scripts: Script[] = [
  {
    name: "pdfjsLib",
    src: "https://unpkg.com/pdfjs-dist@2.3.200/build/pdf.min.js",
  },
];

// Function to get an asset (script) by name
export function getAsset(name: string): Promise<any> {
  if (assets[name] !== undefined) return assets[name];
  const script = scripts.find((s) => s.name === name);
  if (!script) throw new Error(`Script ${name} not exists.`);
  return prepareAsset(script);
}

// Function to prepare an asset (script) by creating a script tag and loading it
export function prepareAsset({ name, src }: Script): Promise<any> {
  if (assets[name] !== undefined) return assets[name];

  assets[name] = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve((window as any)[name]);
    };
    script.onerror = () => {
      reject(`The script ${name} didn't load correctly.`);
    };
    document.body.appendChild(script);
  });

  return assets[name];
}

// Function to prepare all the assets (scripts) by iterating through the scripts list
export default function prepareAssets(): void {
  scripts.forEach(prepareAsset);
}
